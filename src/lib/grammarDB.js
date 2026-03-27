// Lazy-load grammar bank data (~536KB) — only needed for grammar reference/editor
let _defaultData = null;
let _loadPromise = null;

function _ensureLoaded() {
    if (_defaultData) return Promise.resolve(_defaultData);
    if (!_loadPromise) {
        _loadPromise = import('../data/vn_grammar_bank_v2.json').then(mod => {
            _defaultData = mod.default;
            return _defaultData;
        });
    }
    return _loadPromise;
}

// Start loading immediately (non-blocking)
_ensureLoaded();

const STORAGE_KEY = 'vnme_grammar_bank';

export const getGrammarItems = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed.items && Array.isArray(parsed.items)) {
                return parsed.items;
            }
        } catch { /* fall through to default */ }
    }
    return _defaultData?.items || [];
};

/** Async version — ensures data is loaded before returning */
export const loadGrammarItems = async () => {
    await _ensureLoaded();
    return getGrammarItems();
};

export const saveGrammarItems = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
};

export const resetGrammarItems = () => {
    localStorage.removeItem(STORAGE_KEY);
};
