import React, { useState, useEffect, useCallback, useRef } from 'react';

const segmentCache = new Map();
const DOUBLE_TAP_MS = 300;

const TappableVietnamese = ({ text, onWordTap, bold }) => {
    const [segments, setSegments] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const lastTapRef = useRef({ time: 0, idx: -1 });

    useEffect(() => {
        if (!text) return;

        if (segmentCache.has(text)) {
            setSegments(segmentCache.get(text));
            return;
        }

        let cancelled = false;
        fetch(`/api/segment?text=${encodeURIComponent(text)}`)
            .then(r => r.json())
            .then(data => {
                if (!cancelled && data.segments) {
                    segmentCache.set(text, data.segments);
                    setSegments(data.segments);
                }
            })
            .catch(() => {
                if (!cancelled) setSegments(null);
            });

        return () => { cancelled = true; };
    }, [text]);

    // Clear selection when segments change
    useEffect(() => { setSelected(new Set()); }, [segments]);

    // --- Click handler: single tap = popup, double tap = enter selection mode ---
    const handleTap = useCallback((idx, e) => {
        e.stopPropagation();
        if (!segments) return;

        const now = Date.now();
        const last = lastTapRef.current;

        // If in selection mode, taps extend or reset
        if (selected.size > 0) {
            lastTapRef.current = { time: 0, idx: -1 };
            const min = Math.min(...selected);
            const max = Math.max(...selected);

            if (idx >= min - 1 && idx <= max + 1) {
                // Extend selection
                setSelected(prev => {
                    const next = new Set(prev);
                    next.add(idx);
                    const newMin = Math.min(...next);
                    const newMax = Math.max(...next);
                    for (let i = newMin; i <= newMax; i++) {
                        if (!segments[i].punct) next.add(i);
                    }
                    return next;
                });
                return;
            }

            // Not adjacent — exit selection mode, show single-word popup
            setSelected(new Set());
            const rect = e.currentTarget.getBoundingClientRect();
            onWordTap(segments[idx].text, rect, false);
            return;
        }

        // Check for double tap on the same word
        if (now - last.time < DOUBLE_TAP_MS && last.idx === idx) {
            // Double tap — enter selection mode
            lastTapRef.current = { time: 0, idx: -1 };
            if (navigator.vibrate) navigator.vibrate(30);
            setSelected(new Set([idx]));
            return;
        }

        // Single tap — show popup for this word
        lastTapRef.current = { time: now, idx };
        const rect = e.currentTarget.getBoundingClientRect();
        onWordTap(segments[idx].text, rect, false);
    }, [segments, selected, onWordTap]);

    // When selection changes to 2+ words, fire the phrase popup
    useEffect(() => {
        if (!segments || selected.size < 2) return;

        const sorted = [...selected].sort((a, b) => a - b);
        const phrase = sorted.map(i => segments[i].text).join(' ');

        // Compute bounding rect spanning all selected words
        const els = sorted
            .map(i => document.querySelector(`[data-tw-id="${text}-${i}"]`))
            .filter(Boolean);

        if (els.length > 0) {
            const first = els[0].getBoundingClientRect();
            const last = els[els.length - 1].getBoundingClientRect();
            const combinedRect = {
                left: Math.min(first.left, last.left),
                right: Math.max(first.right, last.right),
                top: Math.min(first.top, last.top),
                bottom: Math.max(first.bottom, last.bottom),
                width: Math.max(first.right, last.right) - Math.min(first.left, last.left),
                height: Math.max(first.bottom, last.bottom) - Math.min(first.top, last.top),
            };
            onWordTap(phrase, combinedRect, true);
        }
    }, [selected, segments, text, onWordTap]);

    // Clear selection on outside tap
    useEffect(() => {
        if (selected.size === 0) return;
        const handler = () => setSelected(new Set());
        const t = setTimeout(() => document.addEventListener('click', handler, { once: true }), 100);
        return () => { clearTimeout(t); document.removeEventListener('click', handler); };
    }, [selected]);

    if (!segments) {
        return bold ? <b>{text}</b> : <>{text}</>;
    }

    return (
        <>
            {segments.map((seg, i) => {
                if (seg.punct) {
                    return <span key={i}>{seg.text}</span>;
                }
                const isSelected = selected.has(i);
                return (
                    <span key={i}>
                        {seg.leading || ''}
                        <span
                            data-tw-id={`${text}-${i}`}
                            className={`tappable-word${isSelected ? ' tappable-word--selected' : ''}`}
                            onClick={(e) => handleTap(i, e)}
                            style={bold ? { fontWeight: 700 } : undefined}
                        >
                            {seg.text}
                        </span>
                        {seg.trailing || ''}
                        {i < segments.length - 1 && !seg.trailing?.endsWith(' ') ? ' ' : ''}
                    </span>
                );
            })}
        </>
    );
};

export default TappableVietnamese;
