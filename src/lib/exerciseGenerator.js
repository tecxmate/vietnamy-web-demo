// Exercise Generator — auto-produces Duolingo-style exercises from lesson items
// Input: lesson items (words/sentences with translations) + distractor pool
// Output: progressive exercise sequence

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickDistractors(item, pool, count, field = 'en_text') {
    const candidates = pool.filter(p => p.id !== item.id && p[field] !== item[field]);
    const shuffled = shuffleArray(candidates);
    return shuffled.slice(0, count).map(c => c[field]);
}

function isSentence(item) {
    return item.id.startsWith('it_s_') || item.id.startsWith('it_p_') ||
        (item.vi_text && item.vi_text.split(' ').length >= 3);
}

// Phase 1: Match pairs — batch of items shown together
function generateMatchPairs(lessonId, batch, exIndex) {
    return {
        id: `${lessonId}_gen_${exIndex}`,
        lesson_id: lessonId,
        exercise_type: 'match_pairs',
        prompt: {
            instruction: 'Match the pairs',
            pairs: batch.map(item => ({
                vi_text: item.vi_text,
                en_text: item.en_text
            }))
        }
    };
}

// Phase 2: MCQ — translate in one direction
function generateMCQ(lessonId, item, pool, direction, exIndex) {
    if (direction === 'to_en') {
        const distractors = pickDistractors(item, pool, 2, 'en_text');
        const choices = shuffleArray([item.en_text, ...distractors]);
        return {
            id: `${lessonId}_gen_${exIndex}`,
            lesson_id: lessonId,
            exercise_type: 'mcq_translate_to_en',
            prompt: {
                instruction: 'Translate to English',
                source_text_vi: item.vi_text,
                choices_en: choices,
                answer_en: item.en_text
            }
        };
    } else {
        const distractors = pickDistractors(item, pool, 2, 'vi_text');
        const choices = shuffleArray([item.vi_text, ...distractors]);
        return {
            id: `${lessonId}_gen_${exIndex}`,
            lesson_id: lessonId,
            exercise_type: 'mcq_translate_to_vi',
            prompt: {
                instruction: 'Translate to Vietnamese',
                source_text_en: item.en_text,
                choices_vi: choices,
                answer_vi: item.vi_text
            }
        };
    }
}

// Listen & choose
function generateListenChoose(lessonId, item, pool, exIndex) {
    const distractors = pickDistractors(item, pool, 2, 'vi_text');
    const choices = shuffleArray([item.vi_text, ...distractors]);
    return {
        id: `${lessonId}_gen_${exIndex}`,
        lesson_id: lessonId,
        exercise_type: 'listen_choose',
        prompt: {
            instruction: 'Listen and choose',
            audio_item_id: item.id,
            audio_text: item.vi_text,
            choices_vi: choices,
            answer_vi: item.vi_text
        }
    };
}

// Reorder words — scramble sentence tokens
function generateReorder(lessonId, item, exIndex) {
    const tokens = item.vi_text.replace(/([.!?,])/g, ' $1').split(/\s+/).filter(t => t);
    if (tokens.length < 2) return null;
    let scrambled = shuffleArray(tokens);
    // Ensure scrambled differs from answer
    let attempts = 0;
    while (scrambled.join(' ') === tokens.join(' ') && attempts < 10) {
        scrambled = shuffleArray(tokens);
        attempts++;
    }
    return {
        id: `${lessonId}_gen_${exIndex}`,
        lesson_id: lessonId,
        exercise_type: 'reorder_words',
        prompt: {
            instruction: 'Put the words in order',
            target_vi: item.vi_text,
            source_text_en: item.en_text,
            tokens: scrambled,
            answer_tokens: tokens
        }
    };
}

// Fill in the blank — remove a word from a sentence, offer MCQ choices
function generateFillBlank(lessonId, sentenceItem, pool, exIndex) {
    const words = sentenceItem.vi_text.split(/\s+/).filter(t => t);
    if (words.length < 2) return null;

    // Pick a content word to blank out (skip punctuation-only tokens, prefer middle words)
    const candidates = words
        .map((w, i) => ({ word: w, index: i }))
        .filter(({ word }) => word.length > 1 && !/^[.!?,]+$/.test(word));

    if (candidates.length === 0) return null;

    const target = candidates[Math.floor(Math.random() * candidates.length)];
    const blanked = words.map((w, i) => i === target.index ? '____' : w).join(' ');

    // Generate distractors from other Vietnamese words in pool
    const otherWords = pool
        .filter(p => p.id !== sentenceItem.id)
        .flatMap(p => p.vi_text.split(/\s+/).filter(t => t.length > 1))
        .filter(w => w !== target.word);
    const uniqueDistractors = [...new Set(otherWords)];
    const distractorChoices = shuffleArray(uniqueDistractors).slice(0, 2);
    const choices = shuffleArray([target.word, ...distractorChoices]);

    return {
        id: `${lessonId}_gen_${exIndex}`,
        lesson_id: lessonId,
        exercise_type: 'fill_blank',
        prompt: {
            instruction: 'Fill in the blank',
            template_vi: blanked,
            source_text_en: sentenceItem.en_text,
            choices_vi: choices,
            answer_vi: target.word
        }
    };
}

/**
 * Main generator: takes lesson items and produces a progressive exercise sequence.
 * @param {string} lessonId
 * @param {Array<{id, vi_text, en_text, audio_key, item_type}>} items - lesson's introduced items
 * @param {Array} distractorPool - items from sibling lessons for wrong answers
 * @returns {Array} exercises
 */
export function generateExercises(lessonId, items, distractorPool) {
    if (!items || items.length === 0) return [];

    const allPool = [...items, ...distractorPool];
    const exercises = [];
    let exIndex = 0;

    // Split items into words and sentences
    const wordItems = items.filter(i => !isSentence(i));
    const sentenceItems = items.filter(i => isSentence(i));

    // --- Phase 1: Match Pairs (batches of 3-5) ---
    const batchSize = Math.min(5, Math.max(3, wordItems.length));
    for (let i = 0; i < wordItems.length; i += batchSize) {
        const batch = wordItems.slice(i, i + batchSize);
        if (batch.length >= 2) {
            exercises.push(generateMatchPairs(lessonId, batch, exIndex++));
        }
    }

    // --- Phase 2: Recognition MCQ (vi → en) ---
    const recognitionItems = shuffleArray(wordItems).slice(0, Math.min(4, wordItems.length));
    for (const item of recognitionItems) {
        exercises.push(generateMCQ(lessonId, item, allPool, 'to_en', exIndex++));
    }

    // --- Phase 3: Listen & Choose (for items with audio potential) ---
    const listenItems = shuffleArray(wordItems).slice(0, Math.min(2, wordItems.length));
    for (const item of listenItems) {
        exercises.push(generateListenChoose(lessonId, item, allPool, exIndex++));
    }

    // --- Phase 4: Production MCQ (en → vi) ---
    const productionItems = shuffleArray(wordItems).slice(0, Math.min(3, wordItems.length));
    for (const item of productionItems) {
        exercises.push(generateMCQ(lessonId, item, allPool, 'to_vi', exIndex++));
    }

    // --- Phase 5: Reorder Words (sentences only) ---
    for (const item of sentenceItems) {
        const ex = generateReorder(lessonId, item, exIndex);
        if (ex) { exercises.push(ex); exIndex++; }
    }

    // --- Phase 6: Fill in the Blank (sentences only) ---
    for (const item of sentenceItems) {
        const ex = generateFillBlank(lessonId, item, allPool, exIndex);
        if (ex) { exercises.push(ex); exIndex++; }
    }

    return exercises;
}
