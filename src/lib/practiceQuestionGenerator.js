// Practice Question Generator — shared factories for practice sub-modules
// Generates dynamic questions from rule/data banks so each session feels fresh

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickDistractors(correctValue, pool, count) {
    const candidates = pool.filter(v => v !== correctValue);
    return shuffleArray(candidates).slice(0, count);
}

/**
 * MCQ: "What does [code] mean?" or "Which key does [effect]?"
 * @param {Object} rule - { key/code, effect/meaning, example }
 * @param {Array} allRules - full pool for distractors
 * @param {'key-from-effect'|'effect-from-key'} direction
 */
export function generateRuleMCQ(rule, allRules, direction = 'key-from-effect') {
    if (direction === 'key-from-effect') {
        // "Which key adds [effect]?"
        const distractors = pickDistractors(
            rule.key || rule.code,
            allRules.map(r => r.key || r.code),
            3
        );
        const options = shuffleArray([rule.key || rule.code, ...distractors]);
        return {
            type: 'multiple-choice',
            question: `Which key/code for: ${rule.effect || rule.meaning}?`,
            target: rule.example || rule.key || rule.code,
            options: options.map(o => ({
                label: o,
                value: o,
                isCorrect: o === (rule.key || rule.code),
            })),
        };
    } else {
        // "What does [key] do?"
        const distractors = pickDistractors(
            rule.effect || rule.meaning,
            allRules.map(r => r.effect || r.meaning),
            3
        );
        const options = shuffleArray([rule.effect || rule.meaning, ...distractors]);
        return {
            type: 'multiple-choice',
            question: `What does "${rule.key || rule.code}" do/mean?`,
            target: rule.key || rule.code,
            options: options.map(o => ({
                label: o,
                value: o,
                isCorrect: o === (rule.effect || rule.meaning),
            })),
        };
    }
}

/**
 * Construction: "Type the code for [target]"
 * @param {Object} rule - must have .answer or .key (correct input) and .target or derived target
 * @param {string} hint - optional hint text
 */
export function generateConstruction(target, answers, hint = '') {
    return {
        type: 'construction',
        question: 'Type the code for:',
        target,
        hint,
        answers: Array.isArray(answers) ? answers : [answers],
    };
}

/**
 * Decode: "Decode this message" with MCQ options
 * @param {string} encoded - the encoded text
 * @param {string} decoded - the correct decoded text
 * @param {Array<string>} distractorTexts - wrong decoded options
 */
export function generateDecode(encoded, decoded, distractorTexts) {
    const options = shuffleArray([decoded, ...distractorTexts.slice(0, 3)]);
    return {
        type: 'decode',
        question: 'Decode this:',
        target: encoded,
        answer: decoded,
        options: options.map(o => ({
            label: o,
            isCorrect: o === decoded,
        })),
    };
}

/**
 * Generate a mixed question set from a rule bank.
 * Returns `count` questions with a mix of MCQ and construction types.
 *
 * @param {Array} rules - array of rule objects (must have key/code, effect/meaning)
 * @param {Object} opts
 * @param {number} opts.count - total questions to generate (default 8)
 * @param {number} opts.constructionRatio - fraction that are construction (default 0.3)
 * @param {Function} opts.constructionMapper - (rule) => { target, answers, hint } for construction questions
 * @param {Function} opts.decodeGenerator - optional (rules) => array of decode questions
 */
export function generateMixedQuestions(rules, opts = {}) {
    const {
        count = 8,
        constructionRatio = 0.3,
        constructionMapper = null,
        decodeGenerator = null,
    } = opts;

    const questions = [];
    const shuffledRules = shuffleArray(rules);

    // Generate decode questions if provided
    let decodeQs = [];
    if (decodeGenerator) {
        decodeQs = shuffleArray(decodeGenerator(rules));
    }

    const numConstruction = Math.round(count * constructionRatio);
    const numDecode = Math.min(decodeQs.length, Math.round(count * 0.25));
    const numMCQ = count - numConstruction - numDecode;

    let ruleIdx = 0;
    const nextRule = () => {
        const rule = shuffledRules[ruleIdx % shuffledRules.length];
        ruleIdx++;
        return rule;
    };

    // MCQ questions (alternate directions)
    for (let i = 0; i < numMCQ; i++) {
        const rule = nextRule();
        const direction = i % 2 === 0 ? 'effect-from-key' : 'key-from-effect';
        questions.push(generateRuleMCQ(rule, rules, direction));
    }

    // Construction questions
    if (constructionMapper) {
        for (let i = 0; i < numConstruction; i++) {
            const rule = nextRule();
            const { target, answers, hint } = constructionMapper(rule);
            questions.push(generateConstruction(target, answers, hint));
        }
    }

    // Decode questions
    for (let i = 0; i < numDecode; i++) {
        questions.push(decodeQs[i]);
    }

    // Shuffle all and assign IDs
    return shuffleArray(questions).map((q, i) => ({ ...q, id: i + 1 }));
}
