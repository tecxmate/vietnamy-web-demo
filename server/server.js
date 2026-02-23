import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3001;
const DB_PATH_EN = join(__dirname, 'databases', 'vn_en_dictionary.db');
const DB_PATH_ZH = join(__dirname, 'databases', 'vn_zh_dictionary.db');

app.use(cors());

// Connect to SQLite Databases
const dbEn = new Database(DB_PATH_EN, { fileMustExist: true });
const dbZh = new Database(DB_PATH_ZH, { fileMustExist: true });

// ---------------------------------------------------------------------------
// Normalize Vietnamese text to ASCII (strip diacritics)
// ---------------------------------------------------------------------------
function normalizeVi(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd');
}

// ---------------------------------------------------------------------------
// Build in-memory normalized→[actualWord] index at startup
// ---------------------------------------------------------------------------
function buildWordIndex(db, hasMetrics) {
    let rows;
    if (hasMetrics) {
        rows = db.prepare(`
            SELECT w.word, wm.subt_freq 
            FROM words w 
            LEFT JOIN word_metrics wm ON w.id = wm.word_id
            WHERE EXISTS (SELECT 1 FROM meanings m WHERE m.word_id = w.id)
        `).all();
    } else {
        rows = db.prepare(`
            SELECT word FROM words w
            WHERE EXISTS (SELECT 1 FROM meanings m WHERE m.word_id = w.id)
        `).all();
    }

    const index = new Map(); // normalizedForm → Set of actual words
    const freqMap = new Map(); // word -> subt_freq

    for (const row of rows) {
        const word = row.word;
        const freq = row.subt_freq || 0;
        const norm = normalizeVi(word);

        if (!index.has(norm)) index.set(norm, []);
        index.get(norm).push(word);

        if (freq > 0) {
            freqMap.set(word, Math.max(freq, freqMap.get(word) || 0));
        }
    }
    return { index, freqMap };
}

console.log('Building word indexes...');
const dataEn = buildWordIndex(dbEn, true);
const dataZh = buildWordIndex(dbZh, false);
const indexEn = dataEn.index;
const indexZh = dataZh.index;
const combinedFreqMap = new Map([...dataZh.freqMap, ...dataEn.freqMap]); // EN overrides ZH if both exist
console.log(`Indexes ready — EN: ${indexEn.size}, ZH: ${indexZh.size} normalized keys`);

// ---------------------------------------------------------------------------
// /api/suggest?q=khong   → returns up to 8 fuzzy-matched words
// ---------------------------------------------------------------------------
app.get('/api/suggest', (req, res) => {
    const query = (req.query.q || '').trim();
    if (query.length < 2) return res.json([]);

    const normQuery = normalizeVi(query);

    // Collect all candidates: words whose normalized form starts with normQuery
    // and whose actual text differs from the raw query typed
    const candidates = [];

    for (const index of [indexEn, indexZh]) {
        for (const [norm, words] of index) {
            if (norm.startsWith(normQuery)) {
                for (const w of words) {
                    if (w.toLowerCase() !== query.toLowerCase()) {
                        candidates.push(w);
                    }
                }
            }
            if (candidates.length >= 50) break;
        }
    }

    // Sort: single-word matches first (no spaces), then multi-word phrases
    // Within each group, sort by subtitle frequency (highest first), then shorter words first
    candidates.sort((a, b) => {
        const aMulti = a.includes(' ') ? 1 : 0;
        const bMulti = b.includes(' ') ? 1 : 0;
        if (aMulti !== bMulti) return aMulti - bMulti;

        const freqA = combinedFreqMap.get(a) || 0;
        const freqB = combinedFreqMap.get(b) || 0;
        if (freqA !== freqB) return freqB - freqA;

        return a.length - b.length;
    });

    // Deduplicate and take top 8
    const seen = new Set();
    const result = [];
    for (const w of candidates) {
        if (!seen.has(w)) {
            seen.add(w);
            result.push(w);
            if (result.length >= 8) break;
        }
    }

    res.json(result);
});

// ---------------------------------------------------------------------------
// /api/search?q=word&lang=en|zh
// ---------------------------------------------------------------------------
app.get('/api/search', (req, res) => {
    const query = req.query.q;
    const lang = req.query.lang || 'en';
    if (!query) return res.json([]);

    const db = lang === 'zh' ? dbZh : dbEn;

    try {
        let sql = `
            SELECT w.word, s.name as source_name, m.id as meaning_id, m.part_of_speech, m.meaning_text
            FROM words w
            JOIN meanings m ON w.id = m.word_id
            JOIN sources s ON m.source_id = s.id
            WHERE w.word = ? COLLATE NOCASE
        `;

        if (lang === 'en') {
            sql = `
                SELECT 
                    w.word, s.name as source_name, m.id as meaning_id, m.part_of_speech, m.meaning_text,
                    wm.subt_freq, wm.mi, p.ipa
                FROM words w
                LEFT JOIN word_metrics wm ON w.id = wm.word_id
                LEFT JOIN pronunciations p ON w.id = p.word_id
                JOIN meanings m ON w.id = m.word_id
                JOIN sources s ON m.source_id = s.id
                WHERE w.word = ? COLLATE NOCASE
            `;
        }

        const stmt = db.prepare(sql);

        const results = stmt.all(query);

        if (results.length === 0) {
            return res.json({ word: query, results: [] });
        }

        const grouped = {};
        for (const r of results) {
            if (!grouped[r.source_name]) {
                grouped[r.source_name] = {
                    source_name: r.source_name,
                    meanings: [],
                    metrics: {
                        subt_freq: r.subt_freq,
                        mi: r.mi,
                        ipa: r.ipa
                    }
                };
            }

            const exStmt = db.prepare(
                'SELECT vietnamese_text, english_text FROM examples WHERE meaning_id = ?'
            );
            const examples = exStmt.all(r.meaning_id);

            grouped[r.source_name].meanings.push({
                part_of_speech: r.part_of_speech,
                meaning_text: r.meaning_text,
                examples,
            });
        }

        res.json({ word: query, structured: true, data: Object.values(grouped) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Dictionary API running on http://localhost:${PORT}`);
});
