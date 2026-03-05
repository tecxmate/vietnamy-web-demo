/**
 * dtw.js — Pitch contour comparison for Vietnamese tone practice.
 *
 * Two scoring methods:
 * 1. Shape-normalized DTW — removes absolute pitch offset, compares contour shapes
 * 2. Pearson correlation  — measures how well the shapes track each other (0–100)
 *
 * Combined into a single score with diagnostic feedback.
 */

import { normalizeShape } from './toneCalibration';

/**
 * Compute the DTW distance between two 1D numeric arrays.
 * @param {number[]} a — First series
 * @param {number[]} b — Second series
 * @returns {number}   — DTW distance (lower = more similar)
 */
export function dtwDistance(a, b) {
    const n = a.length;
    const m = b.length;

    if (n === 0 || m === 0) return Infinity;

    let prev = new Float32Array(m + 1).fill(Infinity);
    let curr = new Float32Array(m + 1).fill(Infinity);
    prev[0] = 0;

    for (let i = 1; i <= n; i++) {
        curr[0] = Infinity;
        for (let j = 1; j <= m; j++) {
            const cost = Math.abs(a[i - 1] - b[j - 1]);
            curr[j] = cost + Math.min(prev[j], curr[j - 1], prev[j - 1]);
        }
        [prev, curr] = [curr, prev];
        curr.fill(Infinity);
    }

    return prev[m];
}


/**
 * Normalize a contour to have a consistent number of points.
 * Uses linear interpolation to resample to `targetLen` points.
 */
export function resampleContour(contour, targetLen = 20) {
    if (contour.length === 0) return new Array(targetLen).fill(0);
    if (contour.length === 1) return new Array(targetLen).fill(contour[0]);

    const result = [];
    for (let i = 0; i < targetLen; i++) {
        const pos = (i / (targetLen - 1)) * (contour.length - 1);
        const lo = Math.floor(pos);
        const hi = Math.min(lo + 1, contour.length - 1);
        const frac = pos - lo;
        result.push(contour[lo] * (1 - frac) + contour[hi] * frac);
    }
    return result;
}


/**
 * Pearson correlation coefficient between two equal-length arrays.
 * Returns -1 to +1. Higher = shapes match better.
 */
export function pearsonCorrelation(a, b) {
    const n = a.length;
    if (n < 3) return 0;

    let sumA = 0, sumB = 0;
    for (let i = 0; i < n; i++) { sumA += a[i]; sumB += b[i]; }
    const meanA = sumA / n;
    const meanB = sumB / n;

    let num = 0, denA = 0, denB = 0;
    for (let i = 0; i < n; i++) {
        const da = a[i] - meanA;
        const db = b[i] - meanB;
        num += da * db;
        denA += da * da;
        denB += db * db;
    }

    const den = Math.sqrt(denA * denB);
    if (den === 0) return 0;
    return num / den;
}


/**
 * Shape-normalized DTW score. Removes mean from both contours before
 * comparing, so only the pitch *shape* matters — not the absolute level.
 * @param {number[]} userContour — User's raw semitone contour
 * @param {number[]} refContour  — Reference contour
 * @returns {number}              — 0 to 100
 */
export function shapeDtwScore(userContour, refContour) {
    const resampled = resampleContour(userContour, refContour.length);
    const userNorm = normalizeShape(resampled);
    const refNorm = normalizeShape(refContour);

    const dist = dtwDistance(userNorm, refNorm);
    const avgDist = dist / refContour.length;
    const maxReasonable = 4; // tighter since shapes are now centered
    return Math.max(0, Math.min(100, Math.round((1 - avgDist / maxReasonable) * 100)));
}


/**
 * Combined score using both DTW shape match and Pearson correlation.
 * Correlation rewards matching the overall direction/shape even if
 * the exact distances are off. DTW rewards precise contour matching.
 *
 * @param {number[]} userContour — User's raw semitone contour
 * @param {number[]} refContour  — Reference contour (normalized or raw)
 * @returns {number}              — 0 to 100
 */
export function combinedScore(userContour, refContour) {
    const resampled = resampleContour(userContour, refContour.length);
    const userNorm = normalizeShape(resampled);
    const refNorm = normalizeShape(refContour);

    // DTW component (0–100)
    const dtwDist = dtwDistance(userNorm, refNorm);
    const avgDist = dtwDist / refContour.length;
    const dtwPart = Math.max(0, Math.min(100, (1 - avgDist / 4) * 100));

    // Check if both contours are essentially flat (low variance).
    // This handles ngang (level tone) correctly — Pearson correlation
    // breaks down when variance ≈ 0 (returns 0 for two flat lines).
    const userVar = userNorm.reduce((s, v) => s + v * v, 0) / userNorm.length;
    const refVar = refNorm.reduce((s, v) => s + v * v, 0) / refNorm.length;
    const FLAT_THRESHOLD = 0.3; // variance below this = effectively flat

    if (userVar < FLAT_THRESHOLD && refVar < FLAT_THRESHOLD) {
        // Both flat — DTW alone is the right metric, correlation is meaningless
        return Math.max(0, Math.min(100, Math.round(dtwPart)));
    }

    // Correlation component (0–100)
    const r = pearsonCorrelation(userNorm, refNorm);

    // If only ONE side is flat but the other isn't, correlation will be ~0
    // which correctly penalizes (e.g. user is flat but ref should rise)
    const corrPart = Math.max(0, Math.min(100, (r + 0.2) / 1.2 * 100));

    // Weighted blend: 40% DTW (precision) + 60% correlation (shape)
    const score = Math.round(dtwPart * 0.4 + corrPart * 0.6);
    return Math.max(0, Math.min(100, score));
}


/**
 * Score against multiple reference contours (calibrated samples).
 * Returns the BEST match — if any sample is close, you're doing it right.
 * This accounts for natural variation in how a tone is produced.
 *
 * @param {number[]} userContour       — User's raw semitone contour
 * @param {number[][]} refContours     — Array of reference contours
 * @returns {{ score: number, bestIdx: number }}
 */
export function bestOfScore(userContour, refContours) {
    if (refContours.length === 0) return { score: 0, bestIdx: -1 };

    let best = 0;
    let bestIdx = 0;
    for (let i = 0; i < refContours.length; i++) {
        const s = combinedScore(userContour, refContours[i]);
        if (s > best) { best = s; bestIdx = i; }
    }
    return { score: best, bestIdx };
}


/**
 * The main scoring function. Uses calibrated samples if available,
 * falls back to the default contour. Always shape-normalized.
 *
 * @param {number[]} userContour     — User's raw semitone contour
 * @param {number[]} defaultContour  — Hardcoded reference from toneContours.js
 * @param {number[][] | null} calibratedSamples — Recorded native speaker samples
 * @returns {number} — 0 to 100
 */
export function dtwScore(userContour, defaultContour, calibratedSamples = null) {
    if (calibratedSamples && calibratedSamples.length > 0) {
        // Score against each calibrated sample AND the averaged mean
        const { score } = bestOfScore(userContour, calibratedSamples);
        return score;
    }
    // Fall back to shape-normalized comparison with default contour
    return combinedScore(userContour, defaultContour);
}


/**
 * Generate diagnostic feedback based on shape-normalized comparison.
 */
export function diagnose(userContour, refContour) {
    if (userContour.length < 3) {
        return { message: 'Too short', detail: 'Hold the sound a bit longer so we can analyze your pitch.' };
    }

    const resampled = resampleContour(userContour, refContour.length);
    const userNorm = normalizeShape(resampled);
    const refNorm = normalizeShape(refContour);
    const n = userNorm.length;

    // Variance check — is the reference essentially flat (level tone)?
    const refVar = refNorm.reduce((s, v) => s + v * v, 0) / n;
    const userVar = userNorm.reduce((s, v) => s + v * v, 0) / n;
    const isRefFlat = refVar < 0.3;

    // Slope analysis on normalized shapes
    const userSlope = userNorm[n - 1] - userNorm[0];
    const refSlope = refNorm[n - 1] - refNorm[0];

    // Check mid-point dip (for Hỏi / Ngã tones)
    const midIdx = Math.floor(n / 2);
    const userMidDip = userNorm[midIdx] - (userNorm[0] + userNorm[n - 1]) / 2;
    const refMidDip = refNorm[midIdx] - (refNorm[0] + refNorm[n - 1]) / 2;

    const score = combinedScore(userContour, refContour);

    if (score >= 85) {
        return { message: 'Excellent! 🎯', detail: 'Your tone contour matches the target very closely.' };
    }

    if (score >= 70) {
        return { message: 'Good shape! 💪', detail: 'The contour is right — just refine the details.' };
    }

    // For flat/level reference tones: diagnose differently
    if (isRefFlat) {
        if (userVar > 1.5) {
            return { message: 'Too much movement 〰️', detail: 'This is a level tone — try keeping your pitch steady and flat.' };
        }
        if (Math.abs(userSlope) > 1.5) {
            return { message: 'Should be flat ➡️', detail: 'This tone should stay level. Try not to rise or fall.' };
        }
        return { message: 'Almost level 💪', detail: 'Keep your pitch as steady as possible throughout.' };
    }

    // Direction mismatch
    if (refSlope > 1.5 && userSlope < -0.5) {
        return { message: 'Wrong direction ↗️', detail: 'This tone should rise, but your pitch fell. Try going up at the end.' };
    }
    if (refSlope < -1.5 && userSlope > 0.5) {
        return { message: 'Wrong direction ↘️', detail: 'This tone should fall, but your pitch rose. Try letting your voice drop.' };
    }

    // Flat when should curve (only for non-flat reference tones)
    if (Math.abs(refSlope) > 2 && Math.abs(userSlope) < 0.5) {
        return { message: 'Too flat 〰️', detail: 'Your pitch stayed too level. Try exaggerating the rise or fall.' };
    }

    // Missing dip (Hỏi / Ngã)
    if (refMidDip < -1 && userMidDip > -0.3) {
        return { message: 'Missing the dip ⤵️', detail: 'This tone dips in the middle. Try dropping your voice, then rising.' };
    }

    // Correlation tells us overall shape match
    const r = pearsonCorrelation(userNorm, refNorm);
    if (r < 0) {
        return { message: 'Different shape 🔄', detail: 'The pitch pattern is quite different from the target. Listen to the example and try again.' };
    }

    return { message: 'Keep practicing 🔄', detail: 'Try listening to the reference and matching the shape more closely.' };
}
