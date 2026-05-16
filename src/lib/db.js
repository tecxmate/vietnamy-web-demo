// A mock database using localStorage to simulate a backend for the 100-levels proposal.

import { INIT_DATA } from './content/initialData';

const DB_KEY = 'vnme_mock_db_v24'; // v24: unified_db.json as primary source
let dbCache = null;

// ── Vocab prerequisite validator ──
// Walks all path_nodes in unit → node_index order and checks that every node's
// vocab_requires items have been covered by preceding nodes' vocab_introduces.
// Returns an array of error objects. Empty array = all good.
export const validateVocabPrerequisites = () => {
    const db = getDB();
    const units = [...db.units].sort((a, b) => a.unit_index - b.unit_index);
    const cumulativeVocab = new Set();
    const errors = [];

    for (const unit of units) {
        const unitNodes = db.path_nodes
            .filter(n => n.unit_id === unit.id)
            .sort((a, b) => a.node_index - b.node_index);

        for (const node of unitNodes) {
            // First, add this node's introduced vocab
            (node.vocab_introduces || []).forEach(id => cumulativeVocab.add(id));

            // Then check this node's required vocab
            for (const reqId of (node.vocab_requires || [])) {
                if (!cumulativeVocab.has(reqId)) {
                    const item = db.items.find(i => i.id === reqId);
                    errors.push({
                        node_id: node.id,
                        unit_id: node.unit_id,
                        label: node.label || node.lesson_id || node.id,
                        missing_item: reqId,
                        missing_word: item ? item.vi_text : '(unknown)',
                        message: `Node "${node.label || node.id}" requires "${item ? item.vi_text : reqId}" but it hasn't been introduced yet`
                    });
                }
            }
        }
    }
    return errors;
};

// Initialize DB — always overwrite units and path_nodes from INIT_DATA
// (items, lessons, lesson_blueprints, exercises are preserved from localStorage)
const CURRICULUM_VERSION = 13; // v13: declarative LESSON_DEFS for Unit 1
const initDB = () => {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
        localStorage.setItem(DB_KEY, JSON.stringify(INIT_DATA));
        localStorage.setItem(DB_KEY + '_cv', String(CURRICULUM_VERSION));
        return JSON.parse(localStorage.getItem(DB_KEY));
    }
    const storedVersion = parseInt(localStorage.getItem(DB_KEY + '_cv') || '1', 10);
    if (storedVersion < CURRICULUM_VERSION) {
        // Overwrite units + path_nodes but keep user-edited content (items, exercises, etc.)
        const existing = JSON.parse(raw);
        existing.units = INIT_DATA.units;
        existing.path_nodes = INIT_DATA.path_nodes;
        existing.scenes = INIT_DATA.scenes;
        existing.scene_locations = INIT_DATA.scene_locations;
        localStorage.setItem(DB_KEY, JSON.stringify(existing));
        localStorage.setItem(DB_KEY + '_cv', String(CURRICULUM_VERSION));
        return existing;
    }
    return JSON.parse(raw);
};

export const getDB = () => {
    if (!dbCache) {
        dbCache = initDB();
    }
    return dbCache;
};

const saveDB = (data) => {
    dbCache = data;
    localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- Units API ---
// Maps the new db.units format to what the UI is expecting
export const getUnits = () => {
    const db = getDB();
    return db.units.map((u, index) => ({
        id: u.id,
        order_index: u.unit_index || (index + 1),
        title: u.title,
        subtitle: "", // or mapped if added
        themeColor: "#10B981", // or map if added
        unlockCondition: "free"
    })).sort((a, b) => a.order_index - b.order_index);
};

export const addUnit = (unitData) => {
    const db = getDB();
    const newUnit = {
        id: `unit_${Date.now()}`,
        unit_index: db.units.length + 1,
        ...unitData
    };
    db.units.push(newUnit);
    saveDB(db);
    return newUnit; // returning raw for now
};

// --- Nodes API ---
export const getNodesForUnit = (unitId) => {
    const db = getDB();
    const nodes = db.path_nodes || db.nodes || [];
    return nodes
        .filter(n => n.unit_id === unitId)
        .map(n => {
            // Find lesson title if it's a lesson
            let label = n.label || "";
            if (n.node_type === 'lesson' && n.lesson_id) {
                const lesson = (db.lessons || []).find(l => l.id === n.lesson_id);
                if (lesson) label = lesson.title;
            }
            return {
                id: n.id,
                unit_id: n.unit_id,
                order_index: n.node_index || n.order_index || 0,
                type: n.node_type || n.type,
                label: n.label || label,
                content_ref_id: n.lesson_id || n.content_ref_id,
                practice_route: n.practice_route || null,
                skill_content: n.skill_content || null,
                module_type: n.module_type || null,
                test_scope: n.test_scope || null,
                source_node_id: n.source_node_id || null,
                status: n.status || 'locked'
            };
        })
        .sort((a, b) => a.order_index - b.order_index);
};

export const addNode = (nodeData) => {
    const db = getDB();
    const unitNodes = getNodesForUnit(nodeData.unit_id);

    const newNode = {
        id: `node_${Date.now()}`,
        node_index: unitNodes.length + 1,
        status: 'locked',
        ...nodeData
    };

    if (!db.path_nodes) { db.path_nodes = []; }
    db.path_nodes.push(newNode);
    saveDB(db);
    return newNode;
};

export const updateNode = (nodeId, updates) => {
    const db = getDB();
    const nodes = db.path_nodes || [];
    const idx = nodes.findIndex(n => n.id === nodeId);
    if (idx >= 0) {
        Object.assign(nodes[idx], updates);
        saveDB(db);
    }
};

export const deleteNode = (nodeId) => {
    const db = getDB();
    db.path_nodes = (db.path_nodes || []).filter(n => n.id !== nodeId);
    saveDB(db);
};

export const updateUnit = (unitId, updates) => {
    const db = getDB();
    const idx = db.units.findIndex(u => u.id === unitId);
    if (idx >= 0) {
        Object.assign(db.units[idx], updates);
        saveDB(db);
    }
};

export const deleteUnit = (unitId) => {
    const db = getDB();
    db.units = db.units.filter(u => u.id !== unitId);
    db.path_nodes = (db.path_nodes || []).filter(n => n.unit_id !== unitId);
    saveDB(db);
};

// --- Get node by ID ---
export const getNodeById = (nodeId) => {
    const db = getDB();
    return (db.path_nodes || []).find(n => n.id === nodeId) || null;
};

// --- Get next node in the roadmap after the given node ---
export const getNextNode = (nodeId) => {
    const db = getDB();
    const currentNode = (db.path_nodes || []).find(n => n.id === nodeId);
    if (!currentNode) return null;

    // Get all nodes in the same unit, sorted by index
    const unitNodes = (db.path_nodes || [])
        .filter(n => n.unit_id === currentNode.unit_id)
        .sort((a, b) => (a.node_index || 0) - (b.node_index || 0));

    const currentIdx = unitNodes.findIndex(n => n.id === nodeId);
    if (currentIdx >= 0 && currentIdx < unitNodes.length - 1) {
        return unitNodes[currentIdx + 1];
    }

    // If last in unit, find first node of next unit
    const currentUnit = db.units.find(u => u.id === currentNode.unit_id);
    if (!currentUnit) return null;
    const nextUnit = db.units
        .sort((a, b) => (a.unit_index || 0) - (b.unit_index || 0))
        .find(u => (u.unit_index || 0) > (currentUnit.unit_index || 0));
    if (!nextUnit) return null;

    const nextUnitNodes = (db.path_nodes || [])
        .filter(n => n.unit_id === nextUnit.id)
        .sort((a, b) => (a.node_index || 0) - (b.node_index || 0));
    return nextUnitNodes[0] || null;
};

// --- Build route for a node (mirrors RoadmapTab.navigateNode) ---
export const getNodeRoute = (node) => {
    if (!node) return '/';
    const type = node.node_type || node.type;
    if (type === 'lesson') return `/lesson/${node.lesson_id || node.content_ref_id}`;
    if (type === 'test') return `/test/${node.id}`;
    if (type === 'scene') return `/scene/${node.scene_id}`;
    if (type === 'skill') {
        if (node.skill_content?.type === 'grammar_lesson') return `/grammar-lesson/${node.id}`;
        if (node.skill_content?.route) return `${node.skill_content.route}?nodeId=${node.id}`;
        if (node.practice_route) return `${node.practice_route}?nodeId=${node.id}`;
    }
    return '/';
};

// --- Exercise Generation (auto-generate from items) ---
import { generateExercises } from './exerciseGenerator';
import { getImageForWord } from '../utils/vocabImageLookup';
import { getDueItemIds } from './srs';
import { getWeakItems as _getWeakItems, extractItemIds as _extractItemIds } from './wordGrades';
import modules from '../data/lessons.json';

// Session-level cache so exercises aren't regenerated on every render
const exerciseCache = new Map();

// Get the user's profile for template substitution
const getUserProfile = () => {
    try {
        const raw = localStorage.getItem('vnme_user_profile');
        if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return {};
};

// Default values for known placeholders. Fallback used when profile has no value.
const PLACEHOLDER_DEFAULTS = {
    NAME: { vi: 'Bạn', en: 'me' },
    ROLE: { vi: 'sinh viên', en: 'student' },
};

// Substitute {NAME}, {ROLE}, etc. into a template string.
// Any unresolved {XXX} placeholder is stripped (along with leading "a "/"an "/"the ")
// so a missing variable never leaks raw braces to the UI.
const substituteTemplate = (text, lang = 'vi') => {
    if (!text) return text;
    const profile = getUserProfile();
    const values = {
        NAME: profile.name || PLACEHOLDER_DEFAULTS.NAME[lang],
        ROLE: profile.role || profile.occupation || PLACEHOLDER_DEFAULTS.ROLE[lang],
    };
    let out = text.replace(/\{([A-Z_]+)\}/g, (match, key) => {
        if (values[key]) return values[key];
        const def = PLACEHOLDER_DEFAULTS[key];
        if (def) return def[lang] || def.en || '';
        return '\0PLACEHOLDER\0'; // marker to strip cleanly with surrounding article
    });
    // Strip leftover markers along with English articles ("I am a {X}" → "I am").
    out = out.replace(/\b(a|an|the)\s+\0PLACEHOLDER\0/gi, '').replace(/\0PLACEHOLDER\0/g, '');
    return out.replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
};

// Resolve lesson items with their translations into full objects
const resolveItems = (db, itemIds) => {
    return itemIds.map(itemId => {
        const item = (db.items || []).find(i => i.id === itemId);
        const translation = (db.translations || []).find(t => t.item_id === itemId && t.lang === 'en');
        if (!item || !translation) return null;
        return {
            id: item.id,
            vi_text: substituteTemplate(item.vi_text, 'vi'),
            vi_text_no_diacritics: item.vi_text_no_diacritics ? substituteTemplate(item.vi_text_no_diacritics, 'vi') : null,
            en_text: substituteTemplate(translation.text, 'en'),
            audio_key: item.audio_key,
            item_type: item.item_type
        };
    }).filter(Boolean);
};

// Compute all items introduced up to and including the given lesson.
// Uses unit_index + node_index for canonical curriculum ordering.
const getKnownVocabulary = (lessonId) => {
    const db = getDB();
    const targetNode = (db.path_nodes || []).find(n => n.lesson_id === lessonId);
    if (!targetNode) return { knownItemIds: new Set(), knownItems: [] };

    const targetUnit = (db.units || []).find(u => u.id === targetNode.unit_id);
    if (!targetUnit) return { knownItemIds: new Set(), knownItems: [] };

    // Get all lesson nodes sorted by curriculum order
    const allLessonNodes = (db.path_nodes || [])
        .filter(n => n.node_type === 'lesson' && n.lesson_id)
        .map(n => {
            const unit = (db.units || []).find(u => u.id === n.unit_id);
            return { ...n, _unitIndex: unit ? (unit.unit_index ?? 999) : 999 };
        })
        .sort((a, b) => a._unitIndex - b._unitIndex || (a.node_index || 0) - (b.node_index || 0));

    const knownItemIds = new Set();
    for (const node of allLessonNodes) {
        const bp = (db.lesson_blueprints || []).find(b => b.lesson_id === node.lesson_id);
        if (bp) {
            (bp.introduced_items || []).forEach(id => knownItemIds.add(id));
        }
        if (node.lesson_id === lessonId) break;
    }

    const knownItems = resolveItems(db, [...knownItemIds]);
    return { knownItemIds, knownItems };
};

// Get distractor pool: items from earlier lessons (curriculum-aware)
const getDistractorPool = (db, lessonId) => {
    const { knownItems } = getKnownVocabulary(lessonId);
    const blueprint = (db.lesson_blueprints || []).find(b => b.lesson_id === lessonId);
    const currentItemIds = new Set(blueprint?.introduced_items || []);
    // Exclude current lesson's own items (they're already in the main items list)
    return knownItems.filter(item => !currentItemIds.has(item.id));
};

// Max total items per lesson (new + review combined)
const MAX_LESSON_ITEMS = 8;
// Number of new words introduced per session (Duolingo-style progressive introduction)
const ITEMS_PER_SESSION = 2;

// Main function: generate exercises for a lesson from its blueprint items
// session parameter (0-3) varies the exercise mix across repeat sessions
export const getExercisesGenerated = (lessonId, session = 0) => {
    // Cache key includes today's date so SRS review items refresh daily
    const today = new Date().toISOString().slice(0, 10);
    const cacheKey = `${lessonId}_s${session}_${today}`;
    if (exerciseCache.has(cacheKey)) return exerciseCache.get(cacheKey);

    const db = getDB();
    const blueprint = (db.lesson_blueprints || []).find(bp => bp.lesson_id === lessonId);
    if (!blueprint) return [];

    const allBlueprintItems = resolveItems(db, blueprint.introduced_items || []);
    if (allBlueprintItems.length === 0) return [];

    // Progressive introduction: each session introduces 1-2 new words
    // Session 0: items[0:2], Session 1: items[2:4], etc.
    const newStart = session * ITEMS_PER_SESSION;
    const sessionNewItems = allBlueprintItems.slice(newStart, newStart + ITEMS_PER_SESSION);
    const previouslyIntroduced = allBlueprintItems.slice(0, newStart);

    // If session exceeds blueprint items, treat as pure review session
    const newItems = sessionNewItems.length > 0 ? sessionNewItems : [];
    let reviewFromLesson = previouslyIntroduced;

    // Sessions 2-3: prioritize items the learner got wrong
    if (session >= 2 && reviewFromLesson.length > 0) {
        const weakOrder = _getWeakItems(reviewFromLesson.map(i => i.id));
        const byId = new Map(reviewFromLesson.map(i => [i.id, i]));
        reviewFromLesson = weakOrder.map(id => byId.get(id)).filter(Boolean);
    }

    // SRS review items: only inject items the user has actually studied
    const blueprintItemIds = new Set(blueprint.introduced_items || []);
    const { knownItemIds } = getKnownVocabulary(lessonId);
    const dueIds = getDueItemIds().filter(id => !blueprintItemIds.has(id) && knownItemIds.has(id));
    const srsSlots = Math.max(0, MAX_LESSON_ITEMS - newItems.length - reviewFromLesson.length);
    const srsReviewItems = resolveItems(db, dueIds.slice(0, srsSlots));

    // Combined pool: new items first, then lesson review, then SRS review
    const allItems = [...newItems, ...reviewFromLesson, ...srsReviewItems];
    if (allItems.length === 0) return [];

    const distractorPool = getDistractorPool(db, lessonId);

    // Build image map for picture_choice exercises
    const imageMap = {};
    allItems.forEach(item => {
        const imgData = getImageForWord(item.vi_text);
        if (imgData) {
            imageMap[item.vi_text.toLowerCase()] = imgData;
        } else if (item.emoji) {
            imageMap[item.vi_text.toLowerCase()] = { image: null, emoji: item.emoji };
        }
    });

    // Build word hints map for tappable translations
    const wordHints = {};
    allItems.forEach(item => {
        wordHints[item.vi_text.toLowerCase()] = item.en_text;
    });

    const exercises = generateExercises(lessonId, allItems, distractorPool, imageMap, session);

    // Attach wordHints to each exercise for tappable translations in the UI
    exercises.forEach(ex => { ex.wordHints = wordHints; });

    exerciseCache.set(cacheKey, exercises);
    return exercises;
};

// Clear exercise cache (call when DB content changes, e.g. after CMS save)
export const clearExerciseCache = () => exerciseCache.clear();

// --- Get all lesson exercises for a unit (for unit tests) ---
// Prioritizes exercises targeting weak items (from wordGrades) so the unit test
// adapts to what the learner struggles with most.
export const getExercisesForUnit = (unitId) => {
    const db = getDB();
    const unitNodes = (db.path_nodes || []).filter(n => n.unit_id === unitId && n.node_type === 'lesson');
    const lessonIds = unitNodes.map(n => n.lesson_id).filter(Boolean);
    const allExercises = [];
    for (const lid of lessonIds) {
        allExercises.push(...getExercisesGenerated(lid));
    }

    // Prioritize exercises that test weak items (from wordGrades)
    const allItemIds = [...new Set(allExercises.flatMap(ex => _extractItemIds(ex, db)))];
    if (allItemIds.length > 0) {
        const weakIds = new Set(_getWeakItems(allItemIds));
        allExercises.sort((a, b) => {
            const aWeak = _extractItemIds(a, db).some(id => weakIds.has(id)) ? 0 : 1;
            const bWeak = _extractItemIds(b, db).some(id => weakIds.has(id)) ? 0 : 1;
            if (aWeak !== bWeak) return aWeak - bWeak;
            return Math.random() - 0.5;
        });
    }

    return allExercises;
};

// --- Get exercises for a single module-scoped test node ---
export const getExercisesForNode = (nodeId) => {
    const db = getDB();
    const node = (db.path_nodes || []).find(n => n.id === nodeId);
    if (!node) return [];

    // If it's a module-scoped test, get exercises from the source node's lesson
    if (node.test_scope === 'module' && node.source_node_id) {
        const sourceNode = (db.path_nodes || []).find(n => n.id === node.source_node_id);
        if (sourceNode?.lesson_id) {
            return getExercisesGenerated(sourceNode.lesson_id);
        }
    }

    // For lesson nodes directly
    if (node.lesson_id) {
        return getExercisesGenerated(node.lesson_id);
    }

    return [];
};

// --- Node lookup by lessonId ---
export const getNodeByLessonId = (lessonId) => {
    const db = getDB();
    const nodes = db.path_nodes || [];
    return nodes.find(n => n.lesson_id === lessonId) || null;
};

// --- Dynamic node status based on completed nodes ---
// Get the unit test node ID for the previous unit (for cross-unit gating)
const getPreviousUnitTestId = (unitId) => {
    const db = getDB();
    const units = (db.units || []).sort((a, b) => (a.unit_index || 0) - (b.unit_index || 0));
    const idx = units.findIndex(u => u.id === unitId);
    if (idx <= 0) return null; // Unit 1 or not found — no prerequisite
    const prevUnitId = units[idx - 1].id;
    const prevTest = (db.path_nodes || []).find(n => n.unit_id === prevUnitId && n.test_scope === 'unit');
    return prevTest?.id || null;
};

export const getNodesForUnitWithProgress = (unitId, completedNodeIds) => {
    const db = getDB();
    const nodes = db.path_nodes || [];
    const unitNodes = nodes.filter(n => n.unit_id === unitId);

    // Sort by node_index — this IS the unlock order
    const sorted = unitNodes.sort((a, b) => (a.node_index || 0) - (b.node_index || 0));

    return sorted.map((n, i) => {
        // Auto-derive unlock status from sequential node_index order
        let status;
        if (completedNodeIds.has(n.id)) {
            status = 'completed';
        } else if (i === 0) {
            // First node in unit: gated by previous unit's test
            const prevTestId = getPreviousUnitTestId(unitId);
            status = (!prevTestId || completedNodeIds.has(prevTestId)) ? 'active' : 'locked';
        } else {
            // All other nodes: require previous node (by index) to be completed
            status = completedNodeIds.has(sorted[i - 1].id) ? 'active' : 'locked';
        }

        let label = n.label || '';
        if (n.node_type === 'lesson' && n.lesson_id) {
            const lesson = (db.lessons || []).find(l => l.id === n.lesson_id);
            if (lesson) label = lesson.title;
        }

        return {
            id: n.id,
            unit_id: n.unit_id,
            order_index: n.node_index || n.order_index || 0,
            type: n.node_type || n.type,
            label,
            content_ref_id: n.lesson_id || n.content_ref_id,
            practice_route: n.practice_route || null,
            skill_content: n.skill_content || null,
            module_type: n.module_type || null,
            test_scope: n.test_scope || null,
            source_node_id: n.source_node_id || null,
            scene_id: n.scene_id || null,
            difficulty: n.difficulty || null,
            cefr_level: n.cefr_level || null,
            vocab_introduces: n.vocab_introduces || null,
            vocab_requires: n.vocab_requires || null,
            status
        };
    });
};

// --- Get lesson blueprint for word summary ---
// session parameter controls which words are shown in the intro (progressive introduction)
export const getLessonBlueprint = (lessonId, session = 0) => {
    const db = getDB();
    const blueprint = (db.lesson_blueprints || []).find(bp => bp.lesson_id === lessonId);
    if (!blueprint) return null;

    // Check if we have rich content in lessons.json (mapping lesson_001 -> id: 1)
    const moduleId = parseInt(lessonId.replace('lesson_', ''));
    const moduleData = modules.find(m => m.id === moduleId);

    // Only show this session's new words in the intro screen
    const allItemIds = blueprint.introduced_items || [];
    const newStart = session * ITEMS_PER_SESSION;
    const sessionItemIds = allItemIds.slice(newStart, newStart + ITEMS_PER_SESSION);

    const words = sessionItemIds.map(itemId => {
        const item = (db.items || []).find(i => i.id === itemId);
        const translation = (db.translations || []).find(t => t.item_id === itemId && t.lang === 'en');
        if (item && translation) {
            return { id: item.id, vietnamese: substituteTemplate(item.vi_text, 'vi'), english: substituteTemplate(translation.text, 'en') };
        }
        return null;
    }).filter(Boolean);

    return {
        lessonId,
        title: moduleData?.title || blueprint.title || 'Lesson',
        goal: moduleData?.goal || blueprint.goal || '',
        focus: blueprint.focus,
        words,
        dialogue: moduleData?.dialogue || null,
        patterns: moduleData?.patterns || null,
        pronunciation_focus: moduleData?.pronunciation_focus || null
    };
};

// --- CMS Helper Functions ---

// Practice modules are now in the Library tab, not in the roadmap
export const getAvailableSkillRoutes = () => [];

export const reindexUnitNodes = (unitId) => {
    const db = getDB();
    const unitNodes = (db.path_nodes || [])
        .filter(n => n.unit_id === unitId)
        .sort((a, b) => (a.node_index || 0) - (b.node_index || 0));
    unitNodes.forEach((n, i) => { n.node_index = i + 1; });
    saveDB(db);
};

export const addNodeWithQuiz = (nodeData) => {
    const db = getDB();
    const unitNodes = (db.path_nodes || []).filter(n => n.unit_id === nodeData.unit_id);
    const maxIndex = unitNodes.reduce((max, n) => Math.max(max, n.node_index || 0), 0);

    const newNode = {
        id: `node_${Date.now()}`,
        course_id: 'course_vi_en_v1',
        node_index: maxIndex + 1,
        status: 'locked',
        ...nodeData
    };

    if (!db.path_nodes) db.path_nodes = [];
    db.path_nodes.push(newNode);

    // Auto-create mini-test for lesson nodes
    if (nodeData.node_type === 'lesson') {
        const quizNode = {
            id: `node_mt_${Date.now()}`,
            course_id: 'course_vi_en_v1',
            unit_id: nodeData.unit_id,
            node_index: maxIndex + 2,
            node_type: 'test',
            module_type: nodeData.module_type || 'orange',
            label: `${nodeData.label || 'Lesson'} Quiz`,
            test_scope: 'module',
            source_node_id: newNode.id
        };
        db.path_nodes.push(quizNode);
    }

    saveDB(db);
    reindexUnitNodes(nodeData.unit_id);
    return newNode;
};

export const deleteNodeWithQuiz = (nodeId) => {
    const db = getDB();
    const node = (db.path_nodes || []).find(n => n.id === nodeId);
    if (!node) return;
    const unitId = node.unit_id;
    db.path_nodes = (db.path_nodes || []).filter(n =>
        n.id !== nodeId && n.source_node_id !== nodeId
    );
    saveDB(db);
    reindexUnitNodes(unitId);
};

export const moveNodeWithQuiz = (unitId, nodeId, direction) => {
    const db = getDB();
    const unitNodes = (db.path_nodes || [])
        .filter(n => n.unit_id === unitId)
        .sort((a, b) => (a.node_index || 0) - (b.node_index || 0));

    const node = unitNodes.find(n => n.id === nodeId);
    if (!node) return;

    // Collect the node and its mini-test as a "group"
    const isQuiz = node.test_scope === 'module' && node.source_node_id;
    if (isQuiz) return; // Don't move quiz nodes directly

    const group = [node];
    const quiz = unitNodes.find(n => n.source_node_id === nodeId && n.test_scope === 'module');
    if (quiz) group.push(quiz);

    // Find the adjacent group to swap with
    const groupIds = new Set(group.map(n => n.id));
    const nonGroupNodes = unitNodes.filter(n => !groupIds.has(n.id));

    // Find current position among top-level nodes (non-quiz nodes)
    const topLevel = unitNodes.filter(n => !(n.test_scope === 'module' && n.source_node_id));
    const topIdx = topLevel.findIndex(n => n.id === nodeId);
    const swapIdx = topIdx + direction;
    if (swapIdx < 0 || swapIdx >= topLevel.length) return;

    const swapNode = topLevel[swapIdx];
    const swapGroup = [swapNode];
    const swapQuiz = unitNodes.find(n => n.source_node_id === swapNode.id && n.test_scope === 'module');
    if (swapQuiz) swapGroup.push(swapQuiz);

    // Rebuild order: swap the two groups in place
    const ordered = [];
    for (const tl of topLevel) {
        let target = tl;
        if (tl.id === nodeId) target = swapNode;
        else if (tl.id === swapNode.id) target = node;

        ordered.push(target);
        const tQuiz = unitNodes.find(n => n.source_node_id === target.id && n.test_scope === 'module');
        if (tQuiz) ordered.push(tQuiz);
    }

    ordered.forEach((n, i) => { n.node_index = i + 1; });
    saveDB(db);
};

// --- Vocab Items API ---
export const getItems = () => {
    const db = getDB();
    return (db.items || []).map(item => {
        const translation = (db.translations || []).find(t => t.item_id === item.id && t.lang === 'en');
        return { ...item, en: translation ? translation.text : '' };
    });
};

// --- Lesson Content API ---
export const getLessonContent = (contentRefId) => {
    const db = getDB();

    // First try the old generic format in case it was created via CMS
    if (db.lessonContent) {
        const found = db.lessonContent.find(c => c.id === contentRefId);
        if (found) return found;
    }

    // Support the new format
    const lesson = (db.lessons || []).find(l => l.id === contentRefId);
    if (!lesson) return null;

    // Map items/translations into simple sentences for the UI to consume
    const exercisesForLesson = (db.exercises || []).filter(ex => ex.lesson_id === lesson.id);

    // Let's create sentences loosely from blueprints or exercises
    const blueprint = (db.lesson_blueprints || []).find(bp => bp.lesson_id === lesson.id);
    const sentences = [];

    if (blueprint && blueprint.introduced_items) {
        blueprint.introduced_items.forEach(itemId => {
            const item = (db.items || []).find(i => i.id === itemId);
            const translation = (db.translations || []).find(t => t.item_id === itemId && t.lang === 'en');
            if (item && translation) {
                sentences.push({
                    vietnamese: item.vi_text,
                    english: translation.text
                });
            }
        });
    }

    return {
        id: lesson.id,
        goal: lesson.title,
        sentences: sentences
    };
};

export const saveLessonContent = (contentData) => {
    const db = getDB();

    // 1. Update Lesson Metadata
    const lessonIndex = db.lessons.findIndex(l => l.id === contentData.id);
    if (lessonIndex >= 0) {
        db.lessons[lessonIndex].title = contentData.goal || db.lessons[lessonIndex].title;
    }

    // 2. Update items and translations from sentences
    const sentences = contentData.sentences || [];
    const blueprint = (db.lesson_blueprints || []).find(bp => bp.lesson_id === contentData.id);

    if (sentences.length > 0) {
        // Create or update items/translations for each sentence
        const newItemIds = [];
        sentences.forEach((s, idx) => {
            const itemId = `it_cms_${contentData.id}_${idx}`;
            const isMultiWord = s.vietnamese.split(/\s+/).length >= 3;
            const itemType = isMultiWord ? 'sentence' : 'word';

            // Upsert item
            const existingIdx = (db.items || []).findIndex(i => i.id === itemId);
            const item = {
                id: itemId,
                item_type: itemType,
                vi_text: s.vietnamese,
                vi_text_no_diacritics: s.vietnamese.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
                audio_key: `a_${itemId}`,
                dialect: 'both'
            };
            if (existingIdx >= 0) db.items[existingIdx] = item;
            else db.items.push(item);

            // Upsert translation
            const transIdx = (db.translations || []).findIndex(t => t.item_id === itemId && t.lang === 'en');
            const trans = { item_id: itemId, lang: 'en', text: s.english };
            if (transIdx >= 0) db.translations[transIdx] = trans;
            else db.translations.push(trans);

            newItemIds.push(itemId);
        });

        // Update or create blueprint
        if (blueprint) {
            blueprint.introduced_items = newItemIds;
        } else {
            if (!db.lesson_blueprints) db.lesson_blueprints = [];
            db.lesson_blueprints.push({
                lesson_id: contentData.id,
                focus: [],
                introduced_items: newItemIds
            });
        }
    }

    // 3. Clear exercise cache so next load regenerates
    clearExerciseCache();

    // 4. Fallback for old lessonContent array
    if (!db.lessonContent) db.lessonContent = [];
    const index = db.lessonContent.findIndex(c => c.id === contentData.id);
    if (index >= 0) db.lessonContent[index] = contentData;
    else db.lessonContent.push(contentData);

    saveDB(db);
    return contentData;
};
