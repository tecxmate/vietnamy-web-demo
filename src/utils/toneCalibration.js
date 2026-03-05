/**
 * toneCalibration.js — Record native speaker samples to build personalized
 * reference contours for Vietnamese tone matching.
 *
 * Instead of comparing against hardcoded "ideal" curves, users (or a native
 * speaker) record 2–3 samples of each tone. These are averaged into a
 * per-tone reference that accounts for natural speech variation.
 *
 * Stored in localStorage under `vnme_tone_calibration`.
 */

import { resampleContour } from './dtw';

const STORAGE_KEY = 'vnme_tone_calibration';
const CONTOUR_LENGTH = 20;

// ─── Contour Normalization ──────────────────────────────────────────

/**
 * Zero-mean normalize a contour — removes absolute pitch offset so only
 * the shape matters. This is the key fix: two people saying the same tone
 * at different absolute pitches will produce the same normalized shape.
 * @param {number[]} contour — Raw semitone values
 * @returns {number[]}       — Zero-mean contour
 */
export function normalizeShape(contour) {
    if (contour.length === 0) return contour;
    const mean = contour.reduce((s, v) => s + v, 0) / contour.length;
    return contour.map(v => v - mean);
}

/**
 * Process a raw pitch contour from a recording into a clean, normalized
 * reference contour: resample to standard length, then zero-mean normalize.
 * @param {number[]} rawSemitones — Variable-length semitone values from recording
 * @returns {number[]}            — CONTOUR_LENGTH zero-mean-normalized values
 */
export function processContour(rawSemitones) {
    const resampled = resampleContour(rawSemitones, CONTOUR_LENGTH);
    return normalizeShape(resampled);
}

/**
 * Average multiple contours element-wise. Also computes per-point
 * standard deviation to understand natural variation.
 * @param {number[][]} contours — Array of normalized contours (same length)
 * @returns {{ mean: number[], stddev: number[] }}
 */
export function averageContours(contours) {
    if (contours.length === 0) return { mean: new Array(CONTOUR_LENGTH).fill(0), stddev: new Array(CONTOUR_LENGTH).fill(0) };
    if (contours.length === 1) return { mean: [...contours[0]], stddev: new Array(CONTOUR_LENGTH).fill(0) };

    const n = contours[0].length;
    const mean = new Array(n).fill(0);
    const stddev = new Array(n).fill(0);

    // Mean
    for (const c of contours) {
        for (let i = 0; i < n; i++) mean[i] += c[i];
    }
    for (let i = 0; i < n; i++) mean[i] /= contours.length;

    // Stddev
    for (const c of contours) {
        for (let i = 0; i < n; i++) stddev[i] += (c[i] - mean[i]) ** 2;
    }
    for (let i = 0; i < n; i++) stddev[i] = Math.sqrt(stddev[i] / contours.length);

    return { mean, stddev };
}


// ─── Storage ────────────────────────────────────────────────────────

/**
 * Load all calibration data from localStorage.
 * @returns {Object} — { [toneId]: { samples: number[][], mean: number[], stddev: number[] } }
 */
export function loadCalibration() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

/**
 * Save a new sample for a tone. Keeps up to `maxSamples` most recent.
 * Recomputes mean + stddev on every save.
 * @param {string} toneId     — e.g. 'sac', 'huyen'
 * @param {number[]} contour  — Processed (resampled + normalized) contour
 * @param {number} maxSamples — Max samples to keep per tone (default 5)
 */
export function saveToneSample(toneId, contour, maxSamples = 5) {
    const cal = loadCalibration();

    if (!cal[toneId]) {
        cal[toneId] = { samples: [], mean: [], stddev: [] };
    }

    cal[toneId].samples.push(contour);

    // Keep only the most recent
    if (cal[toneId].samples.length > maxSamples) {
        cal[toneId].samples = cal[toneId].samples.slice(-maxSamples);
    }

    // Recompute stats
    const { mean, stddev } = averageContours(cal[toneId].samples);
    cal[toneId].mean = mean;
    cal[toneId].stddev = stddev;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cal));
    return cal;
}

/**
 * Clear calibration for a specific tone or all tones.
 * @param {string|null} toneId — null clears everything
 */
export function clearCalibration(toneId = null) {
    if (!toneId) {
        localStorage.removeItem(STORAGE_KEY);
        return;
    }
    const cal = loadCalibration();
    delete cal[toneId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cal));
}

/**
 * Get the effective reference contour for a tone.
 * Returns the calibrated mean if available, otherwise null.
 * @param {string} toneId
 * @returns {{ contour: number[], stddev: number[], calibrated: boolean } | null}
 */
export function getCalibratedContour(toneId) {
    const cal = loadCalibration();
    if (cal[toneId] && cal[toneId].samples.length >= 1) {
        return {
            contour: cal[toneId].mean,
            stddev: cal[toneId].stddev,
            calibrated: true,
            sampleCount: cal[toneId].samples.length,
        };
    }
    return null;
}

/**
 * Check how many tones have been calibrated and how many samples each has.
 * @returns {{ [toneId]: number }} — sample counts
 */
export function getCalibrationStatus() {
    const cal = loadCalibration();
    const status = {};
    for (const [toneId, data] of Object.entries(cal)) {
        status[toneId] = data.samples?.length || 0;
    }
    return status;
}
