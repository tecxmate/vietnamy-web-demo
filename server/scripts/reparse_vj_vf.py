"""
Re-parse JaViDic_VJ and mtBab_VF StarDict dictionaries with proper structured
meanings and examples, replacing the previous flat text dump.
"""
import sqlite3
import struct
import gzip
import re

DB_PATH = "/Users/niko/antigravity/vnme-app/server/databases/vn_en_dictionary.db"

VJ_IDX = "/tmp/vj_extract/var/mobile/Library/Dictionary/JavidicVJ/JaViDic_Vietnamese_Japanese.idx"
VJ_DICT = "/tmp/vj_extract/var/mobile/Library/Dictionary/JavidicVJ/JaViDic_Vietnamese_Japanese.dict.dz"

VF_IDX = "/Users/niko/antigravity/vnme-data/raw/vi-others-data/mtBab_VF/mtBab_VF2.idx"
VF_DICT = "/Users/niko/antigravity/vnme-data/raw/vi-others-data/mtBab_VF/mtBab_VF2.dict.dz"


def parse_stardict(idx_path, dict_path):
    with open(idx_path, 'rb') as f:
        idx_data = f.read()
    if dict_path.endswith('.dz'):
        with gzip.open(dict_path, 'rb') as f:
            dict_data = f.read()
    else:
        with open(dict_path, 'rb') as f:
            dict_data = f.read()
    entries = []
    pos = 0
    while pos < len(idx_data):
        null_pos = idx_data.index(b'\x00', pos)
        word = idx_data[pos:null_pos].decode('utf-8', errors='replace')
        offset, size = struct.unpack('>II', idx_data[null_pos+1:null_pos+9])
        definition = dict_data[offset:offset+size].decode('utf-8', errors='replace')
        entries.append((word, definition))
        pos = null_pos + 9
    return entries


# ---------------------------------------------------------------------------
# VJ Parser: Vietnamese-Japanese
# Structure:
#   POS row: <FONT color=#0066ff>&nbsp;{pos}</FONT>
#   Meaning row (indent 13): hiragana - 「kanji」 optionally - [HAN VIET]
#   Example row (indent 26): Vietnamese (red) :&nbsp; Japanese (gray)
# ---------------------------------------------------------------------------
def parse_vj_entry(html):
    """Parse VJ HTML into list of {pos, meaning_text, examples: [{vi, ja}]}."""
    results = []

    # Split into table blocks
    tables = re.findall(r'<TABLE[^>]*>(.*?)</TABLE>', html, re.DOTALL | re.IGNORECASE)

    current_pos = None
    current_meaning = None

    for table in tables:
        # Check for POS marker (blue text)
        pos_match = re.search(r'color=#0066ff[^>]*>\s*&nbsp;\s*(\w+)', table, re.IGNORECASE)
        if pos_match:
            current_pos = pos_match.group(1).strip()
            continue

        # Check for meaning row (indent 13, image 505D7147)
        if 'width=13' in table or '505D7147' in table:
            # Extract the Japanese text
            fonts = re.findall(r'<FONT[^>]*>(.*?)</FONT>', table, re.DOTALL | re.IGNORECASE)
            text_parts = []
            for f in fonts:
                clean = f.replace('&nbsp;', '').strip()
                if clean and clean != '-':
                    text_parts.append(clean)

            meaning_text = ' '.join(text_parts).strip()
            # Clean up: "おぼえる  「覚える」" -> "おぼえる -「覚える」"
            meaning_text = re.sub(r'\s+', ' ', meaning_text).strip()
            if meaning_text:
                if current_meaning:
                    results.append(current_meaning)
                current_meaning = {
                    'pos': current_pos,
                    'meaning_text': meaning_text,
                    'examples': [],
                }
            continue

        # Check for example row (indent 26, image 4D8522A2)
        if ('width=26' in table or '4D8522A2' in table) and current_meaning:
            # Vietnamese in red (Tahoma font), Japanese in gray (MS PMincho font)
            vi_match = re.search(r'color=#ff0000[^>]*>\s*&nbsp;\s*(.*?)</FONT>', table, re.DOTALL | re.IGNORECASE)
            # Match specifically MS PMincho font for Japanese (skip the colon Tahoma font)
            ja_match = re.search(r'face="MS PMincho"[^>]*>(.*?)</FONT>', table, re.DOTALL | re.IGNORECASE)

            vi_text = re.sub(r'<[^>]+>', '', vi_match.group(1)).strip() if vi_match else None
            ja_text = re.sub(r'<[^>]+>', '', ja_match.group(1)).strip() if ja_match else None

            if vi_text or ja_text:
                current_meaning['examples'].append({
                    'vi': vi_text or '',
                    'ja': ja_text or '',
                })

    if current_meaning:
        results.append(current_meaning)

    return results


# ---------------------------------------------------------------------------
# VF Parser: Vietnamese-French
# Structure:
#   Main meaning row: id=mn_T_cv_id → French definition text
#   Example Vietnamese: id=mh_T_cv_id → red text
#   Example French: id=mh_n_T_cv_id → gray text
#   Proverb/idiom: id=tn_T_cv_id
# ---------------------------------------------------------------------------
def parse_vf_entry(html):
    """Parse VF HTML into list of {pos, meaning_text, examples: [{vi, fr}]}."""
    results = []
    current_meaning = None
    pending_vi = None

    def extract_text(h):
        return re.sub(r'<[^>]+>', '', h).replace('&nbsp;', ' ').strip()

    def extract_colored(h, color):
        match = re.search(rf'color={color}[^>]*>(.*?)</FONT>', h, re.DOTALL | re.IGNORECASE)
        if match:
            return re.sub(r'<[^>]+>', '', match.group(1)).replace('&nbsp;', ' ').strip()
        return None

    # Use re.finditer on TR tags with id attributes
    for m in re.finditer(r'<TR\s+id=(\w+)[^>]*>(.*?)</TR>', html, re.DOTALL | re.IGNORECASE):
        row_id = m.group(1)
        row_html = m.group(2)

        if row_id == 'mn_T_cv_id':
            if current_meaning:
                results.append(current_meaning)
            text = extract_text(row_html)
            text = re.sub(r'^\s*\S+\.png\s*', '', text).strip()
            current_meaning = {'pos': None, 'meaning_text': text, 'examples': []}
            pending_vi = None

        elif row_id == 'mh_T_cv_id' and current_meaning:
            pending_vi = extract_colored(row_html, '#FF0000') or extract_text(row_html)

        elif row_id == 'mh_n_T_cv_id' and current_meaning:
            fr = extract_colored(row_html, '#7E7E7E') or extract_text(row_html)
            if pending_vi or fr:
                current_meaning['examples'].append({'vi': pending_vi or '', 'fr': fr or ''})
            pending_vi = None

        elif row_id == 'tn_T_cv_id' and current_meaning:
            pending_vi = extract_colored(row_html, '#FF0000') or extract_text(row_html)

        elif row_id == 'tn_n_T_cv_id' and current_meaning:
            fr = extract_colored(row_html, '#7E7E7E') or extract_text(row_html)
            if pending_vi or fr:
                current_meaning['examples'].append({'vi': pending_vi or '', 'fr': fr or ''})
            pending_vi = None

    if current_meaning:
        results.append(current_meaning)

    return results


def main():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL")

    # Build word lookup
    word_lookup = {}
    for row in conn.execute("SELECT id, word FROM words"):
        word_lookup[row[1].lower()] = row[0]

    # ---- Process VJ ----
    vj_source = conn.execute("SELECT id FROM sources WHERE name = 'JaViDic_VJ'").fetchone()
    if not vj_source:
        print("ERROR: JaViDic_VJ source not found")
        return
    vj_source_id = vj_source[0]

    # Delete old flat meanings and their examples
    print("Deleting old VJ meanings...")
    old_meaning_ids = [r[0] for r in conn.execute(
        "SELECT id FROM meanings WHERE source_id = ?", (vj_source_id,)
    ).fetchall()]
    if old_meaning_ids:
        # Batch delete examples
        conn.execute(f"DELETE FROM examples WHERE meaning_id IN (SELECT id FROM meanings WHERE source_id = ?)", (vj_source_id,))
        conn.execute("DELETE FROM meanings WHERE source_id = ?", (vj_source_id,))
    conn.commit()
    print(f"  Deleted {len(old_meaning_ids)} old meanings")

    # Parse and insert structured VJ
    print("Parsing VJ entries...")
    vj_entries = parse_stardict(VJ_IDX, VJ_DICT)
    vj_meanings = 0
    vj_examples = 0

    for word, html in vj_entries:
        word = word.strip()
        if not word or len(word) > 200:
            continue

        word_key = word.lower()
        if word_key not in word_lookup:
            continue  # Word already exists from previous integration

        word_id = word_lookup[word_key]
        parsed = parse_vj_entry(html)

        for m in parsed:
            if not m['meaning_text']:
                continue

            cur = conn.execute(
                "INSERT INTO meanings (word_id, source_id, part_of_speech, meaning_text) VALUES (?, ?, ?, ?)",
                (word_id, vj_source_id, m['pos'], m['meaning_text'])
            )
            meaning_id = cur.lastrowid
            vj_meanings += 1

            for ex in m['examples']:
                vi = ex.get('vi', '')
                ja = ex.get('ja', '')
                if vi or ja:
                    conn.execute(
                        "INSERT INTO examples (meaning_id, vietnamese_text, english_text) VALUES (?, ?, ?)",
                        (meaning_id, vi, ja)  # Store Japanese in english_text column
                    )
                    vj_examples += 1

    conn.commit()
    print(f"  VJ: {vj_meanings} meanings, {vj_examples} examples")

    # ---- Process VF ----
    vf_source = conn.execute("SELECT id FROM sources WHERE name = 'mtBab_VF'").fetchone()
    if not vf_source:
        print("ERROR: mtBab_VF source not found")
        return
    vf_source_id = vf_source[0]

    print("Deleting old VF meanings...")
    old_vf = conn.execute("SELECT COUNT(*) FROM meanings WHERE source_id = ?", (vf_source_id,)).fetchone()[0]
    conn.execute(f"DELETE FROM examples WHERE meaning_id IN (SELECT id FROM meanings WHERE source_id = ?)", (vf_source_id,))
    conn.execute("DELETE FROM meanings WHERE source_id = ?", (vf_source_id,))
    conn.commit()
    print(f"  Deleted {old_vf} old meanings")

    print("Parsing VF entries...")
    vf_entries = parse_stardict(VF_IDX, VF_DICT)
    vf_meanings = 0
    vf_examples = 0

    for word, html in vf_entries:
        word = word.strip()
        if not word or len(word) > 200:
            continue

        word_key = word.lower()
        if word_key not in word_lookup:
            continue

        word_id = word_lookup[word_key]
        parsed = parse_vf_entry(html)

        for m in parsed:
            if not m['meaning_text']:
                continue

            cur = conn.execute(
                "INSERT INTO meanings (word_id, source_id, part_of_speech, meaning_text) VALUES (?, ?, ?, ?)",
                (word_id, vf_source_id, m['pos'], m['meaning_text'])
            )
            meaning_id = cur.lastrowid
            vf_meanings += 1

            for ex in m['examples']:
                vi = ex.get('vi', '')
                fr = ex.get('fr', '')
                if vi or fr:
                    conn.execute(
                        "INSERT INTO examples (meaning_id, vietnamese_text, english_text) VALUES (?, ?, ?)",
                        (meaning_id, vi, fr)  # Store French in english_text column
                    )
                    vf_examples += 1

    conn.commit()
    print(f"  VF: {vf_meanings} meanings, {vf_examples} examples")

    # Summary
    print(f"\n{'='*50}")
    print(f"VJ total: {vj_meanings} meanings, {vj_examples} examples")
    print(f"VF total: {vf_meanings} meanings, {vf_examples} examples")

    conn.close()


if __name__ == "__main__":
    main()
