# Vietnamy Education

A mobile-first Vietnamese language learning web app built with React + Vite. Teaches Vietnamese to English and Chinese speakers through interactive lessons, spaced repetition, a multi-source dictionary, grammar drills, and gamification.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 6, Vite 7 |
| Backend | Express.js, SQLite (better-sqlite3) |
| Styling | CSS variables, mobile-first, dark/light mode |
| Icons | Lucide React |
| Chinese support | OpenCC-JS (simplified/traditional conversion) |

## Getting Started

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Run frontend + backend concurrently
npm run dev:all

# Or run separately:
npm run dev          # Frontend — localhost:5173
npm run dev:server   # Backend  — localhost:3001
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run dev:server` | Start Express API server (port 3001) |
| `npm run dev:all` | Run both concurrently |
| `npm run build` | Production build (Vite + server deps) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
  context/          # React Context (UserContext, DongContext, LanguageContext)
  components/
    Tabs/           # Main tab views (Home, Roadmap, Practice, Dictionary, Community)
    Onboarding/     # First-launch setup wizard
  pages/
    Practice/       # Practice modules (tones, pronouns, numbers, flashcards, etc.)
    Admin/          # Content management editors
    Grammar/        # Grammar list and detail views
  lib/              # Business logic (db, SRS, vocab library, grammar, i18n)
  data/             # Static content (lessons, vocab, grammar, articles, tones)
  utils/            # Utilities (TTS, pitch detection, fuzzy matching, pronoun logic)
  hooks/            # Custom React hooks
server/
  server.js         # Express API (dictionary search, suggest, TTS proxy)
  databases/        # SQLite dictionary databases (not in git)
  scripts/          # Data import and generation pipelines
docs/               # Project documentation (PRD, handoff guide, user flows)
```

## Core Features

- **Lesson Engine** — Interactive exercises (multiple choice, listen & tap, reorder words, speaking) with a 5-heart system
- **Roadmap** — Duolingo-style skill tree with unlock prerequisites
- **Dictionary** — Multi-source fuzzy search with diacritics handling, IPA, examples, and compound word decomposition
- **Spaced Repetition** — SM-2 inspired flashcard system (1/3/7/14/30 day intervals)
- **Gamification** — Virtual currency, daily streaks, stage unlocking
- **Practice Modules** — Tones, pitch training, pronouns, numbers, vowels, TELEX typing, teen code
- **Admin CMS** — Visual editors for lessons, roadmap, grammar, articles, vocabulary
- **Bilingual UI** — English and Chinese interface toggle

## Deployment

The app includes a Dockerfile for containerized deployment:

```bash
docker build -t vietnamy .
docker run -p 8080:8080 vietnamy
```

In production, Express serves both the API and the built frontend from `/dist`.

## Documentation

See `docs/PROJECT_HANDOFF.md` for detailed architecture, data structures, and instructions on adapting this app for other language pairs.

## Credits

Developed by [TECXMATE.COM](https://tecxmate.com)
