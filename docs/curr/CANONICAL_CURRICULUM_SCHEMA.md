# Canonical Curriculum Schema

`src/data/unified_db.json` is the canonical curriculum source.

Runtime collections such as `items`, `translations`, `lesson_blueprints`, and `path_nodes` are derived by `src/lib/content/initialData.js`. They should not become a second curriculum source.

## Top Level

```json
{
  "version": "string",
  "generated": "ISO-ish timestamp string",
  "stats": {},
  "units": [],
  "lessons": [],
  "vocabulary": [],
  "sentences": [],
  "grammar_tags": [],
  "conversations": []
}
```

## Unit

```json
{
  "id": "phase_1_first_words",
  "order_index": 1,
  "title": "First Words"
}
```

Rules:
- `id` is unique.
- `order_index` is numeric and determines roadmap order.
- `title` is user-facing.

## Lesson

```json
{
  "id": "lesson_001a",
  "unit_id": "phase_1_first_words",
  "order_index": 1,
  "title": "Say Hello",
  "topic": "greetings",
  "focus": ["greetings", "farewell"],
  "difficulty": 1,
  "xp_reward": 8,
  "cefr_level": "A1.1",
  "node_id": "p1_L001a",
  "quiz_id": "p1_Q001a"
}
```

Rules:
- `unit_id` must reference `units[].id`.
- `topic` is the roadmap chip/category id.
- `node_id` creates the lesson roadmap node.
- `quiz_id` creates the module quiz roadmap node.
- `focus` is more granular than `topic`; it can hold search/filter tags.

## Vocabulary Item

```json
{
  "id": "it_w_0001",
  "lesson_id": "lesson_001a",
  "vi_text": "xin chào",
  "pos": "phrase",
  "emoji": "👋",
  "difficulty": 1,
  "frequency_rank": 2,
  "dialect": "both",
  "has_image": false,
  "translations": [
    { "lang": "en", "text": "hello", "is_primary": true }
  ]
}
```

Rules:
- `id` is globally unique across `vocabulary` and `sentences`.
- `lesson_id` must reference `lessons[].id`.
- At least one English translation is required.
- `has_image` should be boolean where possible; legacy string booleans are tolerated by the current adapter.

## Sentence Item

```json
{
  "id": "it_s_0037",
  "lesson_id": "lesson_001b",
  "vi_text": "Cảm ơn!",
  "token_count": 2,
  "difficulty": 1,
  "grammar_tags": [],
  "translations": [
    { "lang": "en", "text": "Thank you!", "is_primary": true }
  ]
}
```

Rules:
- `id` is globally unique across `vocabulary` and `sentences`.
- `lesson_id` must reference `lessons[].id`.
- At least one English translation is required.
- `grammar_tags[]` entries should reference `grammar_tags[].id` when populated.

## Grammar Tag

```json
{
  "id": "grammar_topic_marker",
  "name": "thì",
  "category": "topic",
  "description": "thì (topic-comment marker)"
}
```

Rules:
- `id` is unique.
- `category` is a broad grammar grouping.

## Conversation

```json
{
  "id": "conv_001",
  "lesson_id": "lesson_001a",
  "title": "Greeting someone",
  "context": "Casual greeting",
  "lines": [
    { "speaker": "A", "vi": "Xin chào!", "en": "Hello!" }
  ]
}
```

Rules:
- `lesson_id` must reference `lessons[].id`.
- Lines must preserve order inside `lines[]`.

## Derived Runtime Shape

`initialData.js` derives:
- `items[]` from `vocabulary[]` and `sentences[]`
- `translations[]` from item-level `translations[]`
- `lesson_blueprints[]` from lesson item membership
- `path_nodes[]` from `lesson.node_id` and `lesson.quiz_id`

If a field is needed by the UI, prefer preserving it through the adapter instead of duplicating curriculum data in another file.
