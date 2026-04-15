# Plan: Split Lessons & Optimize Unit 1 Structure

## Problem

Unit 1 currently teaches ~18 words across 2 lessons + 2 grammar units. Duolingo teaches 3-4 words per module with 4 iterations each. Our lessons teach 7 words each — nearly 2x the ideal.

The 4-iteration system already exists (learners repeat each module 4 times), but each iteration covers too many words, diluting focus.

## Current Unit 1 Flow (12 nodes)

```
L001 (7 words) → Q001 → G1 → P0 → S1 → P1 → P2 → L002 (7 words) → Q002 → G2 → S2 → Unit Test
```

## Proposed Unit 1 Flow (16 nodes)

Split each lesson into two smaller lessons (3-4 words each). Add a micro-lesson before each grammar unit to pre-teach words the grammar needs.

```
L001a (3 words: xin chào, chào, tạm biệt)
  → Q001a (quiz)
  → P0 (Tones: Introduction)
L001b (4 words: cảm ơn, không, tôi, bạn)
  → Q001b (quiz)
  → G1 (Grammar: I+You — now only uses chào, cảm ơn, tôi, bạn ✓)
  → S1 (Tones: Level & Rising)
  → P1 (Vowels: Core 12)
  → P2 (Tone Marks: Basic)
L002a (3 words: tên, là, gì)
  → Q002a (quiz)
  → G2 (Grammar: Subject+là — now only uses tôi, bạn, tên, là, gì ✓)
L002b (4 words: rất, vui, gặp, được)
  → Q002b (quiz)
  → S2 (Vowels: Special)
  → Unit Test
```

## Implementation Steps

### Step 1: Split lesson_001 → lesson_001a + lesson_001b

**lesson_001a** — "Say Hello" (3 words)
- Items: xin chào, chào, tạm biệt
- Focus: greeting and farewell only
- Exercises: hear → recognize → produce for just these 3 words

**lesson_001b** — "Thank You" (4 words)
- Items: cảm ơn, không, tôi, bạn
- Focus: basic politeness + first pronouns
- Prerequisite: lesson_001a completed

### Step 2: Split lesson_002 → lesson_002a + lesson_002b

**lesson_002a** — "What's Your Name?" (3 words)
- Items: tên, là, gì (+ pattern: tôi tên là / bạn tên là gì?)
- Focus: self-introduction question/answer
- Prerequisite: lesson_001b completed

**lesson_002b** — "Nice to Meet You" (4 words)
- Items: rất, vui, gặp, được (+ sentence: Rất vui được gặp bạn)
- Focus: responding to introductions
- Prerequisite: lesson_002a completed

### Step 3: Update path_nodes

- Split p1_L001 → p1_L001a + p1_L001b
- Split p1_L002 → p1_L002a + p1_L002b
- Add 2 new quiz nodes (Q001a, Q001b → replace Q001; Q002a, Q002b → replace Q002)
- Update all unlock_rules in the chain
- Reindex node_index values
- Bump DB_KEY and CURRICULUM_VERSION

### Step 4: Update lesson_blueprints

- Create 4 new blueprint entries with smaller item arrays
- Remove old lesson_001 and lesson_002 blueprints
- Each blueprint should have 6-8 exercises (not 12+) to match the smaller word count

### Step 5: Update exercise generation

- exerciseGenerator.js may need adjustment if it assumes a minimum item count
- Verify that 3-word lessons generate enough variety across 4 iterations

### Step 6: Apply same pattern to Units 2-9

Once Unit 1 proves the pattern works, audit and split lessons in later units:
- Unit 2: lesson_003 (6 words) → split
- Unit 3: lesson_005 (7 words), lesson_006 (5 words) → split lesson_005
- Continue for all units with >4 words per lesson

## Risks

- **Exercise variety**: With only 3 words, 4 iterations of 6 exercises each = 24 exercises from 3 words. May feel repetitive.
  - Mitigation: Vary exercise types across iterations (iter 1: MCQ, iter 2: listen, iter 3: type, iter 4: mixed)
  - The weak-item system already handles this by surfacing different exercise types

- **Unit length**: Unit 1 grows from 12 → 16 nodes. May feel longer on the roadmap.
  - Mitigation: Each node is faster (3-4 words vs 7), so total time is similar

- **Migration**: Existing users with progress on lesson_001/002 need migration
  - Mitigation: DB_KEY bump resets curriculum; existing progress maps via NODE_ID_MIGRATION

## Files Modified

1. `src/lib/db.js` — lesson_blueprints (4 new, 2 removed), path_nodes (4 new nodes, 2 removed)
2. `src/lib/exerciseGenerator.js` — verify minimum item count handling
3. `src/data/grammar_modules.json` — already done (grammar examples fixed)

## Success Criteria

- Each lesson teaches exactly 3-4 words
- Grammar units use ONLY words from preceding lessons
- 4 iterations × 3-4 words = learner sees each word 6-8 times minimum
- Unit 1 completion time stays ~30-40 minutes total
- Roadmap doesn't feel overwhelming (16 nodes is fine with the filter chips)
