# IP Registration Brief — Vietnamy (VNME App)

**Audience:** External IP counsel preparing copyright and trademark filings in Vietnam.
**Prepared:** 2026-05-12
**Status:** Working brief — to be reviewed and supplemented by counsel.

---

## 1. Executive Summary

**Vietnamy** (working code name **VNME**) is a mobile-first Vietnamese language learning application. It is a multi-component software product comprising (a) a Progressive Web App frontend, (b) a Node.js/Express backend, (c) nine proprietary Vietnamese↔foreign-language SQLite dictionary databases, (d) a structured curriculum of original lesson content, and (e) original UI/UX design, branding, and audio/visual assets.

We intend to register, in Vietnam:

1. **Copyright** over the software (source code + UI) and the original written/curricular content, treated as a literary work under the 2026 IP Law amendments.
2. **Trademark** over the product name **"Vietnamy"** and its associated logo, in **Nice Class 9** (downloadable mobile/computer software) and **Nice Class 41** (educational services, language instruction).

The product is currently a working build on the `feat/study-import-curriculum` branch and is preparing for an MVP launch (see PRD §3). Filing now secures priority before public launch.

---

## 2. Product Description (For Counsel)

### 2.1 What the product is

A cross-platform (web/PWA today; native iOS/Android on the roadmap) gamified learning application that teaches Vietnamese to speakers of nine other languages. The core product surfaces are:

- **Onboarding** — captures native language, learner motivation, dialect (North/South), and daily goal.
- **Roadmap** — a Duolingo-style skill tree of ~60 lesson nodes across 6 units, with prerequisite unlock logic, hearts/streaks, and per-lesson sessions.
- **Lesson Engine** — interactive exercises (multiple choice, listen-and-tap, speaking-repeat, word reorder, dictation, etc.) driven by a 4-session per lesson loop ending in a graded test.
- **Practice Modules** — standalone trainers: Tones & Tone Marks, Numbers, Vowels, Pronouns (kinship simulation), TELEX Typing, Pitch, **Teen Code** (Vietnamese internet slang).
- **Dictionary** — a bidirectional Vietnamese-to-foreign-language lookup tool supporting **nine interface languages**: English, Chinese (Traditional), Japanese, French, Russian, German, Norwegian, Spanish, Italian. Each pair is backed by a separate proprietary SQLite database (~100MB+ in aggregate).
- **Library / SRS** — flashcards on a 1→3→7→14→30-day spaced repetition schedule, custom decks, saved-word lists.
- **Admin CMS** — internal editors (lesson builder, grammar editor, article editor, vocabulary/tone/kinship editors, curriculum mapper) for non-technical content management.
- **Gamification** — XP, daily streaks, "₫" (đồng) virtual coins, 5-heart energy mechanic, achievements, leaderboards.

### 2.2 Technical components (subject matter of the copyright filing)

| Component | Description | Form to submit |
|---|---|---|
| Frontend source code | React 19 + Vite, React Router v6, Context API state, ESM JavaScript/JSX (no TypeScript). | Printed listing + digital archive (USB/upload) |
| Backend source code | Node.js / Express server; dictionary indexing and API; TTS/translation proxy. | Printed listing + digital archive |
| Dictionary databases (9) | `vn_en_dictionary.db`, `vn_zh_dictionary.db`, `vn_ja_dictionary.db`, `vn_fr_dictionary.db`, `vn_ru_dictionary.db`, `vn_de_dictionary.db`, `vn_no_dictionary.db`, `vn_es_dictionary.db`, `vn_it_dictionary.db`. Schema: `words`, `meanings`, `sources`, `examples`, `word_metrics`, `pronunciations`. | Database schema documentation + sample data export. **See §6 on third-party source attribution.** |
| Curriculum content | Original lesson blueprints, vocabulary items, grammar explanations, tone words, kinship term taxonomy, articles. Spec at `docs/curr/LESSON_DATA_SPEC.md`. | Printed lesson manuals + JSON content export |
| UI/UX design | Mobile-first (480px) responsive design, dark/light mode, branded screens. | Screenshot manual (all primary screens) |
| Audio assets | TTS-generated and pre-recorded Vietnamese audio for vocabulary and exercises. **See §7 on AI-generated content disclosure.** | Audio sample inventory |

### 2.3 Original literary/educational content

In addition to the code, the following original written content is part of the work and should be enumerated in the copyright application:

- The structured curriculum (6 units, ~60 path nodes, lesson blueprints — see `src/data/` and `docs/curr/`).
- The Teen Code module — 24+ rules covering Vietnamese internet/SMS slang.
- The Kinship Terms module — taxonomy of Vietnamese family-address pronouns (ông, bà, chú, cô, anh, chị, etc.).
- The Tones & Tone Marks training material.
- Original grammar explanations and example sentences.
- The product PRD and marketing/positioning copy (`docs/prd/`, `docs/mkt/`).

---

## 3. Brand & Trademark Subject Matter

### 3.1 Marks to register

| Mark | Type | Use |
|---|---|---|
| **Vietnamy** | Word mark | Primary product name and brand. |
| **VNME** | Word mark (secondary) | Used in code, internal documents, and as short brand handle. May be filed defensively. |
| Vietnamy logo | Figurative/combined mark | Final logo file to be supplied separately (target dimensions 2cm × 2cm – 8cm × 8cm per IP Vietnam spec). |
| "₫ đồng" gamification token | Probably *not* trademarkable (uses the existing Vietnamese currency symbol); flag for counsel. | — |

### 3.2 Nice Classification

Counsel to confirm the goods/services description, but the working scope is:

- **Class 9** — Downloadable mobile application software; computer software for language learning; computer software for educational gamification; downloadable electronic dictionaries.
- **Class 41** — Education services; language instruction; providing online non-downloadable educational content; arranging and conducting educational courses; gamified learning services.

Consider also (counsel's judgement):

- **Class 38** — for community / messaging features (leaderboards, friend feeds) if those become a meaningful surface.
- **Class 42** — for SaaS/API offerings if the dictionary becomes a B2B product.

### 3.3 Search recommendation

Counsel should run a clearance search on IP Vietnam's online database for "Vietnamy", "VNME", and similar transliterations (e.g., "Viet Namy", "Việt Nam-y") in Classes 9 and 41 before filing.

---

## 4. Ownership & Authorship Chain

This section is critical for the **Statement of Honesty** and any **Assignment of Rights** documents the COV requires.

- **Primary author/developer:** [Founder name — to be filled in by counsel] (Vietnamese national; founder of the project).
- **Co-authors / contributors:** [List employees, contractors, and any external collaborators with their contribution scope.]
- **Work-for-hire instruments:** Counsel should request and review:
  - Labour contracts for any employees with copyrightable contributions.
  - Independent contractor agreements containing IP assignment clauses.
  - Open-source license inventory (the project uses React, Vite, Express, lucide-react icons, better-sqlite3, etc. — all permissive licenses; counsel should confirm none are AGPL/GPL).

**Action item:** Before filing, the founder will sign a Statement of Honesty affirming independent creation, and any contributor whose contribution is not already covered by a written assignment will sign one.

---

## 5. Corporate Structure & Filing Logistics

- **Founder is based between Hanoi and Taipei.** Per the user's note, a regional firm with offices in both cities is preferred.
- **Filing entity:** To be confirmed — likely a Vietnamese-registered company. If filed as a foreign entity, a **Power of Attorney** to the local IP agent is required, since the 2026 e-filing portal mandates a certified digital signature from a licensed local agent for non-residents.
- **Required identification documents:**
  - Founder: passport copy.
  - Company (if applicable): Business Registration Certificate copy.

---

## 6. Third-Party Data in the Dictionary (Important)

Some of the bilingual dictionary databases were seeded from or cross-referenced against publicly available lexicographic sources. **Before filing the copyright registration for the databases**, counsel should review:

- The provenance of each of the nine `vn_*_dictionary.db` databases.
- Whether any source had a license that restricts redistribution or requires attribution.
- Whether the value we add (curation, IPA, audio, Han-Viet roots, example sentences, indexing schema, search/fuzzy-matching layer) is sufficient to claim copyright in a **compilation** even where individual entries are not original.

This is the area of highest legal risk in the copyright filing and should be triaged first. If any database has unclear provenance, we can file copyright over (a) the software that operates the dictionary and (b) the original additions (IPA, examples, audio) without claiming the underlying word lists.

---

## 7. AI-Generated Content Disclosure (2026 Law Compliance)

The 2026 IP Law amendment requires "significant human intervention" for AI-generated content to be eligible for copyright. The product uses AI in the following places — counsel should advise on whether each constitutes sufficient human intervention or whether disclosure/exclusion is needed:

| AI use | Description | Human-intervention notes |
|---|---|---|
| TTS audio (Google Translate proxy) | Vietnamese audio for vocabulary and exercises is generated via a Google TTS proxy with browser `speechSynthesis` as fallback. | Selection of words, dialect choice, and review of output is human. Audio is functional, not a creative work — likely outside copyright claim. |
| OCR translation (Tesseract.js) | On-device OCR for user photo translation. | Library is third-party open-source; not part of our claim. |
| ASR speech feedback (Web Speech API; later AWS/Azure) | Tone recognition during speaking exercises. | Third-party model; not part of our claim. |
| Phase-2 cloud AI feedback | Roadmap feature only, not in MVP. | Defer — re-disclose when shipped. |
| Lesson content authoring | All lesson blueprints, vocabulary lists, grammar explanations, and Teen Code/Kinship modules were authored by the team. Some example sentences may have been drafted with LLM assistance and then edited. | We will document the prompting/editing workflow for any LLM-assisted content per the 2026 "significant human intervention" requirement. |

**Action item:** The team will prepare a one-page "AI Use & Human Intervention" memo to accompany the copyright filing, documenting which assets are AI-touched and what the human editorial workflow was.

---

## 8. Related Compliance Notes (Out of Scope for IP, but Adjacent)

The lawyer should be aware that the same product will also need to comply with Vietnam's data-protection regime (Decree 13/2023/ND-CP, the 2026 PDPL, and the Law on Cybersecurity). The privacy/T&C work and the IP work share several primitives (entity name, founder identity, POA scope) — we may be able to bundle the engagement. See `docs/terms/vietnam-law.txt` for the data-protection summary already drafted.

The product currently uses **localStorage only** (no user account system, no server-side personal data store), which materially simplifies the data-protection posture for v1. This does **not** affect the IP filing, but counsel should note it when scoping a combined engagement.

---

## 9. Proposed Filing Plan & Timeline

| # | Step | Owner | Target |
|---|---|---|---|
| 1 | Engage local IP agent (Hanoi + Taipei firm). | Founder | Week 0 |
| 2 | Sign Power of Attorney for IP agent (digital signature). | Founder + Agent | Week 1 |
| 3 | Run trademark clearance search (Vietnamy, VNME, logo) in Classes 9 + 41. | Agent | Week 1 |
| 4 | File trademark application(s) — establishes priority date. *(Grant timeline: 12–18 months.)* | Agent | Week 2 |
| 5 | Finalize copyright dossier: source code package, screenshot manual, content inventory, AI-use memo, contributor assignments, Statement of Honesty. | Founder + Counsel | Weeks 2–4 |
| 6 | Triage dictionary database provenance (see §6). | Founder + Counsel | Weeks 2–3 |
| 7 | File copyright application via IP Vietnam online portal. *(Grant timeline: 15–30 business days.)* | Agent | Week 4 |
| 8 | Receive copyright certificate. | — | Week 8–10 |
| 9 | Track trademark prosecution; respond to office actions. | Agent | Months 3–18 |

---

## 10. Open Questions for Counsel

1. Should we file the trademark in the founder's personal name initially and assign to the operating company later, or wait until the Vietnamese entity is registered?
2. Is **"Vietnamy"** (which is phonetically close to **"Việt Nam"**, the country name) registrable, or will the examiner object on descriptiveness / national-name grounds? If at risk, what stylized/figurative form maximizes registrability?
3. Do we need separate copyright filings for each of the 9 dictionary databases, or can they be filed as one compilation work?
4. For Madrid Protocol — should we file an international trademark application designating other key markets (US, Taiwan, Japan, Korea, EU) off the Vietnamese base, given the diaspora-focused go-to-market?
5. Any practical reason to file the Vietnamese-language brand "**Vietnamy**" alongside a Vietnamese-script variant (e.g., "**Việt Nam-y**" or a localized form)?

---

## 11. Document Inventory We Can Provide Immediately

On request, the founder can deliver to counsel:

- This brief.
- The full PRD (`docs/prd/PRD.md` — 438 lines, current as of March 2026).
- Backend PRD (`docs/prd/PRD-executive-backend.md`).
- Curriculum specification (`docs/curr/LESSON_DATA_SPEC.md`, `docs/curr/curriculum-state-and-plan.md`, `docs/curr/scene-engine-spec.md`).
- Database schema (`docs/database_schema.md`).
- Marketing positioning (`docs/mkt/`).
- Existing privacy & terms drafts (`docs/terms/`).
- A signed Git history of the repository (proves authorship timeline).
- A screenshot manual of all primary product surfaces.
- A packaged source-code archive (excluding the dictionary `.db` files until §6 is triaged).

---

*This brief is an internal working document prepared by the founder for transmission to outside counsel. Nothing in it constitutes a legal opinion. All assertions about the product, authorship, and AI use are subject to verification before submission to IP Vietnam.*
