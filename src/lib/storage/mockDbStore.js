import { INIT_DATA } from '../content/initialData';

const DB_KEY = 'vnme_mock_db_v24'; // v24: unified_db.json as primary source
const CURRICULUM_VERSION = 18; // v18: remove templated {NAME}/{ROLE} phrases

let dbCache = null;

const initDB = () => {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
        localStorage.setItem(DB_KEY, JSON.stringify(INIT_DATA));
        localStorage.setItem(DB_KEY + '_cv', String(CURRICULUM_VERSION));
        return JSON.parse(localStorage.getItem(DB_KEY));
    }

    const storedVersion = parseInt(localStorage.getItem(DB_KEY + '_cv') || '1', 10);
    if (storedVersion < CURRICULUM_VERSION) {
        // Overwrite curriculum-derived collections, keep user-edited exercises.
        const existing = JSON.parse(raw);
        existing.units = INIT_DATA.units;
        existing.path_nodes = INIT_DATA.path_nodes;
        existing.lessons = INIT_DATA.lessons;
        existing.items = INIT_DATA.items;
        existing.translations = INIT_DATA.translations;
        existing.lesson_blueprints = INIT_DATA.lesson_blueprints;
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

export const saveDB = (data) => {
    dbCache = data;
    localStorage.setItem(DB_KEY, JSON.stringify(data));
};
