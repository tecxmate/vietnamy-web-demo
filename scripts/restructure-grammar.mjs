#!/usr/bin/env node
/**
 * Restructure vn_grammar_bank.json locally (no external API).
 *
 * Usage:
 *   node scripts/restructure-grammar.mjs
 *
 * Outputs: src/data/vn_grammar_bank_v2.json
 * Saves progress after each item so you can resume if interrupted.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT = resolve(__dirname, "../src/data/vn_grammar_bank.json");
const OUTPUT = resolve(__dirname, "../src/data/vn_grammar_bank_v2.json");
const PROGRESS = resolve(__dirname, "../src/data/.grammar_progress.json");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fixTypos(str) {
  if (!str) return str;
  return str
    .replace(/\bou\b/g, "you")
    .replace(/thíngs/g, "things")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** True if a word contains Vietnamese diacritic characters */
function hasVietnamese(word) {
  // Use unicode property for non-ASCII letters — avoids slow /[àáả...]/i regex
  for (let i = 0; i < word.length; i++) {
    const cp = word.charCodeAt(i);
    // Vietnamese chars are in ranges: 0x00C0-0x024F, 0x1E00-0x1EFF, plus đ/Đ
    if ((cp >= 0x00C0 && cp <= 0x024F) || (cp >= 0x1E00 && cp <= 0x1EFF)) return true;
  }
  return false;
}

/**
 * Extract Vietnamese/English example pairs from a flat text fragment.
 *
 * The text looks like:
 *   "Tôi là David I am David Anh ấy là giáo viên He is a teacher ..."
 *
 * Strategy: segment the table text at boundaries where a VI-diacritic word
 * follows an EN-ASCII word (= start of new row). Within each segment, the
 * last diacritic word is the boundary between the VI phrase and EN phrase.
 */
function extractExamplePairs(text) {
  const cleaned = text
    .replace(/\b(Vietnamese|Tiếng Việt)\s+(English|Translation)\b/gi, "")
    .replace(/\bView More Examples[:\s]*/gi, "")
    .replace(/\bFor example[:\s]*/gi, "")
    .replace(/\bExamples?[:\s]*/gi, "")
    .trim();

  // Handle "// " separator format first
  if (cleaned.includes("//")) {
    const parts = cleaned.split(/\s*\/\/\s*/);
    const pairs = [];
    for (let i = 0; i + 1 < parts.length; i += 2) {
      const vi = parts[i].trim();
      const en = parts[i + 1].trim();
      if (vi && en) pairs.push({ vi, en });
    }
    return pairs;
  }

  const words = cleaned.split(/\s+/).filter(Boolean);
  // Label each word: 'vi' if it has Vietnamese diacritics, 'en' otherwise
  const types = words.map(w => hasVietnamese(w) ? "vi" : "en");

  // Find segment boundaries: a new row starts when a 'vi' word follows an 'en' word
  const segStarts = [0];
  for (let i = 1; i < words.length; i++) {
    if (types[i] === "vi" && types[i - 1] === "en") {
      segStarts.push(i);
    }
  }
  segStarts.push(words.length); // sentinel

  const pairs = [];
  for (let s = 0; s < segStarts.length - 1; s++) {
    const ws = words.slice(segStarts[s], segStarts[s + 1]);
    const ts = types.slice(segStarts[s], segStarts[s + 1]);

    // Find the last 'vi' word in this segment — that's where the VI phrase ends
    let lastViIdx = -1;
    for (let j = ws.length - 1; j >= 0; j--) {
      if (ts[j] === "vi") { lastViIdx = j; break; }
    }
    if (lastViIdx === -1) continue; // no VI word at all — skip

    const vi = ws.slice(0, lastViIdx + 1).join(" ");
    const en = ws.slice(lastViIdx + 1).join(" ");
    if (vi && en) pairs.push({ vi, en });
  }
  return pairs;
}


/**
 * Extract pattern formula from a body text fragment.
 * Looks for "PATTERN <formula>" and returns it.
 */
function extractPattern(body) {
  const idx = body.indexOf("PATTERN ");
  if (idx === -1) return { pattern: null, cleaned: body };

  // Everything after "PATTERN " up to the next keyword or end-of-useful-content
  const after = body.slice(idx + 8);
  // Find end: next known keyword
  const stopWords = ["NOTE", "Vietnamese", "Tiếng", "View More", "For example", "Examples"];
  let endIdx = after.length;
  for (const sw of stopWords) {
    const pos = after.indexOf(sw);
    if (pos !== -1 && pos < endIdx) endIdx = pos;
  }
  const pattern = after.slice(0, endIdx).trim();
  const cleaned = body.slice(0, idx) + body.slice(idx + 8 + endIdx);
  return { pattern: pattern || null, cleaned };
}

/**
 * Extract the NOTE from body text.
 * Returns { note, cleaned }.
 */
function extractNote(body) {
  // Look for "NOTE –", "NOTE -", "NOTE:" followed by content
  const markers = ["NOTE –", "NOTE -", "NOTE:", "NOTE –"];
  for (const marker of markers) {
    const idx = body.indexOf(marker);
    if (idx === -1) continue;
    const after = body.slice(idx + marker.length).trim();
    // End at the next table header or end of string
    const stopWords = ["Vietnamese", "Tiếng", "View More", "For example", "Examples"];
    let endIdx = after.length;
    for (const sw of stopWords) {
      const pos = after.indexOf(sw);
      if (pos !== -1 && pos < endIdx) endIdx = pos;
    }
    const note = fixTypos(after.slice(0, endIdx).trim());
    const cleaned = body.slice(0, idx) + after.slice(endIdx);
    return { note, cleaned };
  }
  return { note: null, cleaned: body };
}

/**
 * Given a section body, extract pattern, note, examples, and explanation.
 * The section body text is a flat, newline-free string.
 */
function parseSection(rawBody) {
  let body = rawBody;

  const { pattern, cleaned: c1 } = extractPattern(body);
  body = c1;

  const { note, cleaned: c2 } = extractNote(body);
  body = c2;

  // Find the example table: look for "Vietnamese English" or "Examples:"
  const TABLE_START = /\b(?:(?:Vietnamese|Tiếng Việt)\s+(?:English|Translation)|Examples?:)\s*/i;
  const tableMatch = body.match(TABLE_START);

  let examples = [];
  let explanationText = body;

  if (tableMatch && tableMatch.index !== undefined) {
    explanationText = body.slice(0, tableMatch.index);
    const tableBody = body.slice(tableMatch.index + tableMatch[0].length);
    examples = extractExamplePairs(tableBody);
  } else {
    // Try to extract any "//" examples even without a table header
    const slashPairs = extractExamplePairs(body);
    if (slashPairs.length > 0) {
      examples = slashPairs;
    }
  }

  const explanation = fixTypos(
    explanationText
      .replace(/\bView More Examples[:\s]*/gi, "")
      .replace(/\bExamples?[:\s]*/gi, "")
      .trim()
  ) || null;

  return {
    pattern: pattern || null,
    note: note || null,
    examples,
    explanation,
  };
}

// ---------------------------------------------------------------------------
// Section splitting
// ---------------------------------------------------------------------------

/**
 * Split `full_text` into named sections using the known headings list
 * from `details.headings`, which provides ground-truth split points.
 */
function splitIntoSections(fullText, knownHeadings = []) {
  if (!fullText) return [];

  // Truncate at FAQ boundary
  const faqIdx = fullText.search(/\bFAQs?\b/i);
  const text = faqIdx !== -1 ? fullText.slice(0, faqIdx) : fullText;

  // Filter to section-level headings (h2), excluding FAQ
  const headingTexts = knownHeadings
    .filter((h) => !/FAQ/i.test(h.text))
    .map((h) => h.text);

  if (headingTexts.length > 0) {
    return splitByKnownHeadings(text, headingTexts);
  }

  // Fallback if no heading metadata
  return [{ heading: "CONTENT", body: text.trim() }];
}

/**
 * Split text by exact heading strings in the order they appear.
 */
function splitByKnownHeadings(text, headings) {
  const sections = [];

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const nextHeading = headings[i + 1];

    const startIdx = text.indexOf(heading);
    if (startIdx === -1) continue;

    const bodyStart = startIdx + heading.length;
    let bodyEnd = text.length;

    if (nextHeading) {
      const nextIdx = text.indexOf(nextHeading, bodyStart);
      if (nextIdx !== -1) bodyEnd = nextIdx;
    }

    const body = text.slice(bodyStart, bodyEnd).trim();
    sections.push({ heading: heading.trim(), body });
  }

  return sections;
}

// ---------------------------------------------------------------------------
// FAQ cleaning
// ---------------------------------------------------------------------------

function cleanFaqs(rawFaqs) {
  if (!Array.isArray(rawFaqs)) return [];
  return rawFaqs
    .filter(
      (f) =>
        f.answer &&
        f.question &&
        f.question.length <= 150 &&
        !f.question.includes("//")
    )
    .map((f) => ({
      question: fixTypos(f.question),
      answer: fixTypos(f.answer),
    }));
}

// ---------------------------------------------------------------------------
// top-level example
// ---------------------------------------------------------------------------

function splitExample(raw) {
  if (!raw || typeof raw !== "string") return { vi: null, en: null };
  const slashIdx = raw.indexOf("//");
  if (slashIdx !== -1) {
    return {
      vi: raw.slice(0, slashIdx).trim(),
      en: raw.slice(slashIdx + 2).trim() || null,
    };
  }
  return { vi: raw.trim(), en: null };
}

// ---------------------------------------------------------------------------
// processItem
// ---------------------------------------------------------------------------

function processItem(item, index, total) {
  console.log(`  ✓ [${index + 1}/${total}] ${item.level} — ${item.title}`);

  if (item.details?.error) {
    return {
      level: item.level,
      title: item.title,
      pattern: item.pattern || null,
      example: splitExample(item.example),
      sections: [],
      faqs: cleanFaqs(item.faqs),
      extracted_patterns: item.extracted_patterns || [],
      error: true,
    };
  }

  const fullText = item.details?.full_text || "";
  const knownHeadings = item.details?.headings || [];

  const rawSections = splitIntoSections(fullText, knownHeadings);

  const sections = rawSections.map(({ heading, body }) => {
    const { pattern, note, examples, explanation } = parseSection(body);
    return { heading, explanation, pattern, examples, note };
  });

  let extracted_patterns = item.extracted_patterns || [];
  if (!extracted_patterns.length) {
    extracted_patterns = sections.map((s) => s.pattern).filter(Boolean);
  }

  return {
    level: item.level,
    title: item.title,
    pattern: item.pattern || null,
    example: splitExample(item.example),
    sections,
    faqs: cleanFaqs(item.faqs),
    extracted_patterns,
  };
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main() {
  const bank = JSON.parse(readFileSync(INPUT, "utf-8"));
  const items = bank.items;

  let results = [];
  let startIdx = 0;
  if (existsSync(PROGRESS) && readFileSync(PROGRESS, "utf-8").trim()) {
    results = JSON.parse(readFileSync(PROGRESS, "utf-8"));
    startIdx = results.length;
    console.log(`Resuming from item ${startIdx + 1}/${items.length}...\n`);
  } else {
    console.log(`Processing ${items.length} grammar items...\n`);
  }

  for (let i = startIdx; i < items.length; i++) {
    const res = processItem(items[i], i, items.length);
    results.push(res);
    writeFileSync(PROGRESS, JSON.stringify(results, null, 2), "utf-8");
  }

  writeFileSync(OUTPUT, JSON.stringify({ items: results }, null, 2), "utf-8");
  writeFileSync(PROGRESS, "", "utf-8");
  console.log(`\nDone! Written to ${OUTPUT}`);
}

main();
