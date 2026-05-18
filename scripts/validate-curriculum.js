#!/usr/bin/env node

import { readFileSync } from 'fs';

const path = process.argv[2] || 'src/data/unified_db.json';
const db = JSON.parse(readFileSync(path, 'utf8'));

const errors = [];
const warnings = [];

function fail(message) {
    errors.push(message);
}

function warn(message) {
    warnings.push(message);
}

function warningGroup(message) {
    if (message.includes('has no vocabulary or sentence items')) return 'lessons without items';
    if (message.includes('unknown grammar tag')) return 'unknown grammar tags';
    if (message.includes('missing topic')) return 'lessons missing topic';
    if (message.includes('legacy field')) return 'legacy fields';
    return 'other';
}

function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireArray(name) {
    if (!Array.isArray(db[name])) {
        fail(`Top-level "${name}" must be an array`);
        return [];
    }
    return db[name];
}

function indexById(name, rows) {
    const ids = new Map();
    rows.forEach((row, index) => {
        if (!isObject(row)) {
            fail(`${name}[${index}] must be an object`);
            return;
        }
        if (!row.id) {
            fail(`${name}[${index}] is missing id`);
            return;
        }
        if (ids.has(row.id)) {
            fail(`${name} has duplicate id "${row.id}" at indexes ${ids.get(row.id)} and ${index}`);
            return;
        }
        ids.set(row.id, index);
    });
    return ids;
}

function hasEnglishTranslation(row, collectionName) {
    if (!Array.isArray(row.translations) || row.translations.length === 0) {
        fail(`${collectionName} "${row.id}" must have translations[]`);
        return;
    }
    if (!row.translations.some(t => t?.lang === 'en' && t.text)) {
        fail(`${collectionName} "${row.id}" must have an English translation`);
    }
}

const units = requireArray('units');
const lessons = requireArray('lessons');
const vocabulary = requireArray('vocabulary');
const sentences = requireArray('sentences');
const grammarTags = requireArray('grammar_tags');
const conversations = requireArray('conversations');

const unitIds = indexById('units', units);
const lessonIds = indexById('lessons', lessons);
const vocabIds = indexById('vocabulary', vocabulary);
const sentenceIds = indexById('sentences', sentences);
const grammarTagIds = indexById('grammar_tags', grammarTags);
indexById('conversations', conversations);

const itemIds = new Map();
for (const [id, index] of vocabIds) itemIds.set(id, `vocabulary[${index}]`);
for (const [id, index] of sentenceIds) {
    if (itemIds.has(id)) {
        fail(`Item id "${id}" appears in both ${itemIds.get(id)} and sentences[${index}]`);
    } else {
        itemIds.set(id, `sentences[${index}]`);
    }
}

units.forEach((unit, index) => {
    if (!unit.id) return;
    if (typeof unit.order_index !== 'number') fail(`units "${unit.id}" must have numeric order_index`);
    if (!unit.title) fail(`units "${unit.id}" must have title`);
    if (unit.order !== undefined) warn(`units "${unit.id}" uses legacy field "order"; prefer order_index`);
    if (index > 0 && typeof unit.order_index === 'number' && typeof units[index - 1]?.order_index === 'number') {
        if (unit.order_index < units[index - 1].order_index) {
            warn(`units "${unit.id}" order_index is lower than previous unit`);
        }
    }
});

const nodeIds = new Map();
lessons.forEach((lesson, index) => {
    if (!lesson.id) return;
    if (!lesson.unit_id || !unitIds.has(lesson.unit_id)) {
        fail(`lesson "${lesson.id}" references missing unit_id "${lesson.unit_id}"`);
    }
    if (typeof lesson.order_index !== 'number') fail(`lesson "${lesson.id}" must have numeric order_index`);
    if (!lesson.title) fail(`lesson "${lesson.id}" must have title`);
    if (!lesson.topic) warn(`lesson "${lesson.id}" is missing topic`);
    if (!Array.isArray(lesson.focus)) warn(`lesson "${lesson.id}" should have focus[]`);
    if (!lesson.node_id) warn(`lesson "${lesson.id}" is missing node_id`);
    if (!lesson.quiz_id) warn(`lesson "${lesson.id}" is missing quiz_id`);
    for (const field of ['node_id', 'quiz_id']) {
        const value = lesson[field];
        if (!value) continue;
        if (nodeIds.has(value)) {
            fail(`Roadmap node id "${value}" is reused by lesson "${lesson.id}" and lesson "${nodeIds.get(value)}"`);
        } else {
            nodeIds.set(value, lesson.id);
        }
    }
    if (lesson.unit !== undefined) warn(`lesson "${lesson.id}" uses legacy field "unit"; prefer unit_id`);
    if (lesson.nodeId !== undefined) warn(`lesson "${lesson.id}" uses legacy field "nodeId"; prefer node_id`);
    if (lesson.quizId !== undefined) warn(`lesson "${lesson.id}" uses legacy field "quizId"; prefer quiz_id`);
    if (index > 0 && lesson.id === lessons[index - 1]?.id) fail(`lesson "${lesson.id}" appears twice in sequence`);
});

vocabulary.forEach(item => {
    if (!item.id) return;
    if (!item.lesson_id || !lessonIds.has(item.lesson_id)) {
        fail(`vocabulary "${item.id}" references missing lesson_id "${item.lesson_id}"`);
    }
    if (!item.vi_text) fail(`vocabulary "${item.id}" must have vi_text`);
    hasEnglishTranslation(item, 'vocabulary');
    if (typeof item.has_image === 'string') {
        fail(`vocabulary "${item.id}" has string has_image; expected boolean`);
    }
});

sentences.forEach(item => {
    if (!item.id) return;
    if (!item.lesson_id || !lessonIds.has(item.lesson_id)) {
        fail(`sentence "${item.id}" references missing lesson_id "${item.lesson_id}"`);
    }
    if (!item.vi_text) fail(`sentence "${item.id}" must have vi_text`);
    hasEnglishTranslation(item, 'sentence');
    if (!Array.isArray(item.grammar_tags)) warn(`sentence "${item.id}" should have grammar_tags[]`);
    (item.grammar_tags || []).forEach(tagId => {
        if (!grammarTagIds.has(tagId)) warn(`sentence "${item.id}" references unknown grammar tag "${tagId}"`);
    });
});

conversations.forEach(conversation => {
    if (!conversation.id) return;
    if (conversation.lessonId !== undefined) {
        fail(`conversation "${conversation.id}" uses legacy field "lessonId"; expected lesson_id`);
    }
    if (!conversation.lesson_id || !lessonIds.has(conversation.lesson_id)) {
        fail(`conversation "${conversation.id}" references missing lesson_id "${conversation.lesson_id}"`);
    }
    if (!Array.isArray(conversation.lines)) {
        fail(`conversation "${conversation.id}" must have lines[]`);
        return;
    }
    conversation.lines.forEach((line, index) => {
        if (!line?.vi || !line?.en) warn(`conversation "${conversation.id}" line ${index + 1} should have vi and en`);
    });
});

const lessonsWithItems = new Set([
    ...vocabulary.map(item => item.lesson_id),
    ...sentences.map(item => item.lesson_id),
]);
lessons.forEach(lesson => {
    if (!lessonsWithItems.has(lesson.id)) warn(`lesson "${lesson.id}" has no vocabulary or sentence items`);
});

console.log(`Validated ${path}`);
console.log(`Units: ${units.length}`);
console.log(`Lessons: ${lessons.length}`);
console.log(`Vocabulary: ${vocabulary.length}`);
console.log(`Sentences: ${sentences.length}`);
console.log(`Grammar tags: ${grammarTags.length}`);
console.log(`Conversations: ${conversations.length}`);

if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`);
    const grouped = new Map();
    warnings.forEach(message => {
        const group = warningGroup(message);
        if (!grouped.has(group)) grouped.set(group, []);
        grouped.get(group).push(message);
    });
    [...grouped.entries()].forEach(([group, messages]) => {
        console.log(`- ${group}: ${messages.length}`);
        messages.slice(0, 3).forEach(message => console.log(`  - ${message}`));
        if (messages.length > 3) console.log(`  - ...and ${messages.length - 3} more`);
    });
}

if (errors.length) {
    console.error(`\nErrors (${errors.length}):`);
    errors.slice(0, 100).forEach(message => console.error(`- ${message}`));
    if (errors.length > 100) console.error(`- ...and ${errors.length - 100} more`);
    process.exit(1);
}

console.log('\nNo schema errors found.');
