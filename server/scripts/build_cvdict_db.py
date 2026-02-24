"""
Build a new ZH dictionary database from CVDICT (CC BY-SA 4.0).
CVDICT format (CC-CEDICT style):
  Traditional Simplified [pinyin] /definition1/definition2/.../

Creates both forward (Chinese→Vietnamese) and reverse (Vietnamese→Chinese) lookups.
The reverse index extracts Vietnamese keywords from definitions so users can search
Vietnamese words and find the corresponding Chinese entries.
"""
import sqlite3
import re
import os
import unicodedata

CVDICT_PATH = "/tmp/CVDICT/CVDICT.u8"
DB_PATH = "/Users/niko/antigravity/vnme-app/server/databases/vn_zh_dictionary.db"

# CC-CEDICT line pattern: Traditional Simplified [pinyin] /def1/def2/
LINE_PATTERN = re.compile(
    r'^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+/(.+)/$'
)

# Stop words and noise to skip in reverse index
STOP_WORDS = {
    'của', 'và', 'là', 'có', 'được', 'để', 'trong', 'với', 'này', 'đó',
    'các', 'một', 'những', 'cho', 'từ', 'theo', 'về', 'đến', 'hay', 'hoặc',
    'không', 'cũng', 'như', 'khi', 'nếu', 'thì', 'mà', 'do', 'vì', 'bởi',
    'tại', 'trên', 'dưới', 'ngoài', 'giữa', 'sau', 'trước', 'ra', 'vào',
    'lên', 'xuống', 'lại', 'đi', 'đã', 'sẽ', 'đang', 'rồi', 'vẫn', 'còn',
    'rất', 'hơn', 'nhất', 'nào', 'gì', 'ai', 'đâu', 'sao', 'thế',
    'bị', 'chỉ', 'nhiều', 'ít', 'lớn', 'nhỏ', 'mới', 'cũ',
    'the', 'a', 'an', 'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by',
    'or', 'and', 'is', 'it', 'as', 'from', 'that', 'this', 'be', 'are',
}

# Parenthetical noise patterns to strip before extracting keywords
PAREN_PATTERN = re.compile(r'\([^)]*\)')
BRACKET_PATTERN = re.compile(r'\[[^\]]*\]')


def is_vietnamese_word(word):
    """Check if a word looks like Vietnamese (Latin script with possible diacritics)."""
    if len(word) < 2:
        return False
    for ch in word:
        if ch.isalpha():
            cat = unicodedata.category(ch)
            if cat.startswith('L'):
                # Check it's Latin-based (not CJK, not Cyrillic, etc.)
                if ord(ch) > 0x024F and ord(ch) < 0x1E00:
                    return False
                if ord(ch) > 0x9FFF:  # CJK
                    return False
            continue
        elif ch in '-':
            continue
        else:
            return False
    return True


def extract_vietnamese_phrases(definition):
    """Extract meaningful Vietnamese words and short phrases from a definition."""
    # Strip parenthetical content (usually annotations like (Đài Loan), (tiếng lóng))
    clean = PAREN_PATTERN.sub(' ', definition)
    clean = BRACKET_PATTERN.sub(' ', clean)

    # Split on semicolons and commas first to get individual meanings
    parts = re.split(r'[;,]', clean)

    phrases = set()
    for part in parts:
        part = part.strip()
        if not part:
            continue

        # Clean up
        words = part.split()
        # Filter to Vietnamese words only
        vi_words = [w for w in words if is_vietnamese_word(w) and w.lower() not in STOP_WORDS]

        if not vi_words:
            continue

        # Add individual words (2+ chars)
        for w in vi_words:
            if len(w) >= 2:
                phrases.add(w.lower())

        # Add the full cleaned phrase if it's 2-4 words (compound Vietnamese terms)
        if 2 <= len(vi_words) <= 4:
            phrase = ' '.join(w.lower() for w in vi_words)
            if len(phrase) >= 3:
                phrases.add(phrase)

    return phrases


def main():
    # Remove old DB
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL")

    # Create schema
    conn.executescript("""
        CREATE TABLE sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        );
        CREATE TABLE words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL,
            UNIQUE(word)
        );
        CREATE TABLE meanings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word_id INTEGER,
            source_id INTEGER,
            part_of_speech TEXT,
            meaning_text TEXT NOT NULL,
            FOREIGN KEY(word_id) REFERENCES words(id),
            FOREIGN KEY(source_id) REFERENCES sources(id)
        );
        CREATE TABLE examples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meaning_id INTEGER,
            vietnamese_text TEXT,
            english_text TEXT,
            FOREIGN KEY(meaning_id) REFERENCES meanings(id) ON DELETE CASCADE
        );
        CREATE INDEX idx_word ON words(word);
        CREATE INDEX idx_meaning_word ON meanings(word_id);
        CREATE INDEX idx_example_meaning ON examples(meaning_id);
    """)

    # Sources: forward (Chinese headwords) and reverse (Vietnamese headwords)
    conn.execute("INSERT INTO sources (name) VALUES (?)", ("CVDICT_Simplified",))
    conn.execute("INSERT INTO sources (name) VALUES (?)", ("CVDICT_Traditional",))
    conn.execute("INSERT INTO sources (name) VALUES (?)", ("CVDICT_Reverse",))
    conn.commit()

    simp_id = conn.execute("SELECT id FROM sources WHERE name = 'CVDICT_Simplified'").fetchone()[0]
    trad_id = conn.execute("SELECT id FROM sources WHERE name = 'CVDICT_Traditional'").fetchone()[0]
    rev_id = conn.execute("SELECT id FROM sources WHERE name = 'CVDICT_Reverse'").fetchone()[0]

    # Parse CVDICT — collect all entries first
    print("Parsing CVDICT...")
    entries = []  # (traditional, simplified, pinyin, definitions_str, definitions_list)

    with open(CVDICT_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            m = LINE_PATTERN.match(line)
            if not m:
                continue
            traditional, simplified, pinyin, defs_str = m.groups()
            definitions = [d.strip() for d in defs_str.split('/') if d.strip()]
            if definitions:
                entries.append((traditional, simplified, pinyin, defs_str, definitions))

    print(f"  Parsed {len(entries)} entries")

    # --- Forward index: Chinese headwords ---
    print("\nBuilding forward index (Chinese → Vietnamese)...")
    word_lookup = {}
    forward_meanings = 0

    for traditional, simplified, pinyin, defs_str, definitions in entries:
        meaning_text = '; '.join(definitions)

        for word, source_id in [(simplified, simp_id), (traditional, trad_id)]:
            if word == simplified and traditional == simplified and source_id == trad_id:
                continue

            if word not in word_lookup:
                cur = conn.execute("INSERT OR IGNORE INTO words (word) VALUES (?)", (word,))
                if cur.lastrowid:
                    word_lookup[word] = cur.lastrowid
                else:
                    row = conn.execute("SELECT id FROM words WHERE word = ?", (word,)).fetchone()
                    word_lookup[word] = row[0]

            conn.execute(
                "INSERT INTO meanings (word_id, source_id, part_of_speech, meaning_text) VALUES (?, ?, ?, ?)",
                (word_lookup[word], source_id, pinyin, meaning_text)
            )
            forward_meanings += 1

    conn.commit()
    print(f"  Forward meanings: {forward_meanings}")

    # --- Reverse index: Vietnamese → Chinese ---
    print("\nBuilding reverse index (Vietnamese → Chinese)...")
    # Map: vietnamese_phrase → set of (simplified, traditional, pinyin, meaning_text)
    reverse_map = {}

    for i, (traditional, simplified, pinyin, defs_str, definitions) in enumerate(entries):
        meaning_text = '; '.join(definitions)
        vi_phrases = extract_vietnamese_phrases(meaning_text)

        for phrase in vi_phrases:
            if phrase not in reverse_map:
                reverse_map[phrase] = []
            reverse_map[phrase].append((simplified, traditional, pinyin, meaning_text))

        if (i + 1) % 20000 == 0:
            print(f"  Processed {i + 1}/{len(entries)} entries...")

    print(f"  Unique Vietnamese keys: {len(reverse_map)}")

    # For Vietnamese keys with many matches, keep only the most relevant
    # (shorter Chinese words = more specific/direct translations)
    MAX_REVERSE_ENTRIES = 15
    reverse_meanings = 0

    for vi_phrase, chinese_entries in reverse_map.items():
        # Sort by Chinese word length (shorter = more direct match), then limit
        chinese_entries.sort(key=lambda e: len(e[0]))
        chinese_entries = chinese_entries[:MAX_REVERSE_ENTRIES]

        if vi_phrase not in word_lookup:
            cur = conn.execute("INSERT OR IGNORE INTO words (word) VALUES (?)", (vi_phrase,))
            if cur.lastrowid:
                word_lookup[vi_phrase] = cur.lastrowid
            else:
                row = conn.execute("SELECT id FROM words WHERE word = ?", (vi_phrase,)).fetchone()
                word_lookup[vi_phrase] = row[0]

        word_id = word_lookup[vi_phrase]

        for simplified, traditional, pinyin, meaning_text in chinese_entries:
            # Format: "Chinese (pinyin): Vietnamese definition"
            display = f"{simplified}"
            if simplified != traditional:
                display += f" [{traditional}]"
            display += f" ({pinyin}): {meaning_text}"

            conn.execute(
                "INSERT INTO meanings (word_id, source_id, part_of_speech, meaning_text) VALUES (?, ?, ?, ?)",
                (word_id, rev_id, pinyin, display)
            )
            reverse_meanings += 1

    conn.commit()
    print(f"  Reverse meanings: {reverse_meanings}")

    # VACUUM
    print("\nVACUUMing...")
    conn.execute("VACUUM")

    # Stats
    total_words = conn.execute("SELECT COUNT(*) FROM words").fetchone()[0]
    total_meanings = conn.execute("SELECT COUNT(*) FROM meanings").fetchone()[0]

    print(f"\nDone!")
    print(f"  Total words: {total_words}")
    print(f"  Total meanings: {total_meanings}")

    for src_name in ['CVDICT_Simplified', 'CVDICT_Traditional', 'CVDICT_Reverse']:
        c = conn.execute("SELECT COUNT(*) FROM meanings m JOIN sources s ON m.source_id = s.id WHERE s.name = ?", (src_name,)).fetchone()[0]
        print(f"  {src_name}: {c} meanings")

    # Show some reverse examples
    print("\nSample reverse lookups:")
    for test_word in ['tốt', 'xin chào', 'nước', 'ăn', 'đẹp', 'yêu', 'nhà', 'học']:
        row = conn.execute("""
            SELECT COUNT(*) FROM words w
            JOIN meanings m ON w.id = m.word_id
            JOIN sources s ON m.source_id = s.id
            WHERE w.word = ? AND s.name = 'CVDICT_Reverse'
        """, (test_word,)).fetchone()
        print(f"  '{test_word}' → {row[0]} Chinese entries")

    conn.close()

if __name__ == "__main__":
    main()
