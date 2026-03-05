import React, { useState, useEffect } from 'react';

const segmentCache = new Map();

const TappableVietnamese = ({ text, onWordTap, bold }) => {
    const [segments, setSegments] = useState(null);

    useEffect(() => {
        if (!text) return;

        // Check cache
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
                // On error, fall back to plain text
                if (!cancelled) setSegments(null);
            });

        return () => { cancelled = true; };
    }, [text]);

    const handleTap = (word, e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        onWordTap(word, rect);
    };

    // While loading or on error, show plain text
    if (!segments) {
        return bold ? <b>{text}</b> : <>{text}</>;
    }

    return (
        <>
            {segments.map((seg, i) => {
                if (seg.punct) {
                    return <span key={i}>{seg.text}</span>;
                }
                return (
                    <span key={i}>
                        {seg.leading || ''}
                        <span
                            className="tappable-word"
                            onClick={(e) => handleTap(seg.text, e)}
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
