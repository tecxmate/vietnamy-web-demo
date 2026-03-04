import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, CheckCircle, Navigation } from 'lucide-react';
import './AppTutorial.css';

// ─── Tutorial step definitions ────────────────────────────────────────────────
// Each step:
//   tab         — which tab the user must be on
//   targetId    — DOM element id to spotlight (null = no spotlight, center tooltip)
//   targetClass — fallback querySelector if no id (first match)
//   position    — tooltip placement: 'top' | 'bottom' | 'center'
//   emoji       — badge emoji
//   badge       — badge label
//   title       — tooltip headline
//   desc        — tooltip body
//   tabLabel    — if defined, shown as "switching to X" hint

const STEPS = [
    {
        tab: 'home',
        targetClass: '.demo-banner',
        position: 'bottom',
        emoji: '👋',
        badge: 'Welcome',
        title: 'Your Vietnamy Home',
        desc: "Stay up-to-date, join our community, and request features here. We're building this with you!",
    },
    {
        tab: 'home',
        targetClass: '.home-dict-search',
        position: 'bottom',
        emoji: '🔍',
        badge: 'Quick Search',
        title: 'Instant Dictionary Access',
        desc: 'Type or speak any word in Vietnamese, English, or your native language — get instant definitions right from home.',
    },
    {
        tab: 'home',
        targetClass: '.home-streak-card',
        position: 'bottom',
        emoji: '🔥',
        badge: 'Progress',
        title: 'Your Daily Streak & Stats',
        desc: 'Track your learning streak, total words studied, and lessons completed. Keep the flame alive every day!',
    },
    {
        tab: 'home',
        targetClass: '.home-actions',
        position: 'top',
        emoji: '▶️',
        badge: 'Quick Actions',
        title: 'Jump Right Back In',
        desc: 'Continue your active lesson or review flashcards that are due. One tap to keep learning.',
    },
    {
        tab: 'study',
        targetId: 'roadmap-continue-btn',
        position: 'center',
        emoji: '🗺️',
        badge: 'Study Roadmap',
        title: 'Your Learning Path',
        desc: 'Lessons, grammar skills, and quizzes laid out step-by-step. Tap CONTINUE to pick up where you left off.',
        tabLabel: 'Study',
    },
    {
        tab: 'dictionary',
        targetId: 'dict-search-input',
        position: 'bottom',
        emoji: '📖',
        badge: 'Dictionary',
        title: 'Full Power Dictionary',
        desc: 'Search Vietnamese ↔ 9 global languages with tone marks, frequency badges, audio pronunciation, and Google Translate fallback.',
        tabLabel: 'Dictionary',
    },
    {
        tab: 'library',
        targetId: 'library-tag-bar',
        position: 'top',
        emoji: '📚',
        badge: 'Reading Library',
        title: 'Real Articles & Readings',
        desc: 'Immerse yourself in authentic Vietnamese content. Tap any word to look it up instantly without losing your place.',
        tabLabel: 'Library',
    },
    {
        tab: 'home',
        targetClass: '.bottom-nav',
        position: 'top',
        emoji: '🧭',
        badge: 'Navigation',
        title: "You're All Set!",
        desc: 'Use the bottom bar to switch between Home, Roadmap, Dictionary, Library, and Community anytime.',
        tabLabel: 'Home',
    },
];

// ─── Helper: get the .app-container's bounding rect ────────────────────────
function getContainerRect() {
    const el = document.querySelector('.app-container');
    return el ? el.getBoundingClientRect() : { top: 0, left: 0, width: 0, height: 0 };
}

// ─── Helper: get bounding rect for a step, relative to the .app-container ────
function getRect(step) {
    let el = null;
    if (step.targetId) el = document.getElementById(step.targetId);
    if (!el && step.targetClass) el = document.querySelector(step.targetClass);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const c = getContainerRect();
    return {
        top: r.top - c.top,
        left: r.left - c.left,
        width: r.width,
        height: r.height,
    };
}

const PAD = 8; // spotlight padding around element

// ─── AppTutorial component ────────────────────────────────────────────────────
const AppTutorial = ({ activeTab, setActiveTab, onComplete }) => {
    const [stepIdx, setStepIdx] = useState(0);
    const [rect, setRect] = useState(null);
    const [exiting, setExiting] = useState(false);
    const [switching, setSwitching] = useState(false);
    const tooltipRef = useRef(null);
    const rafRef = useRef(null);

    const step = STEPS[stepIdx];
    const isLast = stepIdx === STEPS.length - 1;

    // ── Switch tab if needed, then update rect ──────────────────────────────
    const applyStep = useCallback((idx) => {
        const s = STEPS[idx];
        if (!s) return;
        if (activeTab !== s.tab) {
            setSwitching(true);
            setActiveTab(s.tab);
        }
    }, [activeTab, setActiveTab]);

    // Re-measure rect whenever tab settles or step changes.
    // Uses a retry loop (up to 1.5 s) so we wait for the element to appear
    // AND for any layout shift (e.g. Roadmap data loading) to finish.
    useEffect(() => {
        let attempts = 0;
        const MAX_ATTEMPTS = 20;   // 20 × 80 ms = 1.6 s max
        const INTERVAL = 80;
        let lastTop = null;
        let stableCount = 0;
        const STABLE_NEEDED = 2; // rect must be the same for 2 consecutive checks

        const tryMeasure = () => {
            const s = STEPS[stepIdx];
            if (!s || activeTab !== s.tab) return;

            const r = getRect(s);
            attempts++;

            if (!r) {
                // Element not in DOM yet — keep retrying
                if (attempts < MAX_ATTEMPTS) {
                    rafRef.current = setTimeout(tryMeasure, INTERVAL);
                } else {
                    // Give up, show tooltip without spotlight
                    setSwitching(false);
                    setRect(null);
                }
                return;
            }

            // Check for layout stability (top position unchanged)
            if (r.top === lastTop) {
                stableCount++;
            } else {
                stableCount = 0;
                lastTop = r.top;
            }

            if (stableCount >= STABLE_NEEDED) {
                // Position has settled — lock it in
                setSwitching(false);
                setRect(r);
            } else if (attempts < MAX_ATTEMPTS) {
                // Keep measuring until stable
                rafRef.current = setTimeout(tryMeasure, INTERVAL);
            } else {
                setSwitching(false);
                setRect(r);
            }
        };

        // Initial delay: longer for steps that require a tab switch
        const step = STEPS[stepIdx];
        const needsSwitch = step && activeTab !== step.tab;
        rafRef.current = setTimeout(tryMeasure, needsSwitch ? 200 : 80);

        return () => clearTimeout(rafRef.current);
    }, [stepIdx, activeTab]);


    // ── Navigation ──────────────────────────────────────────────────────────
    const goNext = () => {
        if (isLast) {
            finish();
            return;
        }
        const nextIdx = stepIdx + 1;
        setStepIdx(nextIdx);
        applyStep(nextIdx);
    };

    const finish = useCallback(() => {
        setExiting(true);
        setTimeout(() => {
            localStorage.setItem('vnme_tutorial_completed', 'true');
            onComplete();
        }, 350);
    }, [onComplete]);

    // Tooltip is always a bottom sheet — never overlaps the spotlight

    // ── Compute tooltip position — always above or below the spotlight ───────
    const TOOLTIP_H = 240; // estimated tooltip height
    const GAP = 12;        // gap between spotlight edge and tooltip

    const getTooltipStyle = () => {
        if (!rect) {
            // No element found — center in bottom third
            return { position: 'absolute', bottom: '12px', left: '12px', right: '12px' };
        }

        const containerEl = document.querySelector('.app-container');
        const containerH = containerEl ? containerEl.clientHeight : 600;

        const spotTop = rect.top - PAD;
        const spotBot = rect.top + rect.height + PAD;

        const spaceBelow = containerH - spotBot - GAP;
        const spaceAbove = spotTop - GAP;

        if (spaceBelow >= TOOLTIP_H) {
            // Enough room below — place tooltip under spotlight
            return { position: 'absolute', top: spotBot + GAP, left: '12px', right: '12px' };
        } else if (spaceAbove >= TOOLTIP_H) {
            // Enough room above — place tooltip above spotlight
            return { position: 'absolute', bottom: containerH - spotTop + GAP, left: '12px', right: '12px' };
        } else {
            // Not enough room either side — prefer below, nudge spotlight up in spotlight style
            const top = Math.max(spotBot + GAP, 0);
            return { position: 'absolute', top, left: '12px', right: '12px' };
        }
    };

    const tooltipStyle = getTooltipStyle();
    const spotlightStyle = rect
        ? {
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
        }
        : {
            // No matching element — hide the ring but keep the dark backdrop
            top: 0, left: 0, width: 0, height: 0,
            boxShadow: '0 0 0 9999px rgba(10,10,18,0.82)',
            borderRadius: 0,
        };

    return (
        <div
            className="tutorial-overlay"
            style={{
                opacity: exiting ? 0 : 1,
                transition: 'opacity 0.35s ease',
                pointerEvents: exiting ? 'none' : undefined,
            }}
        >
            {/* Clickable backdrop — tapping outside does nothing (intentional) */}
            <div className="tutorial-backdrop" onClick={(e) => e.stopPropagation()} />

            {/* Spotlight ring */}
            {!switching && (
                <div className="tutorial-spotlight" style={spotlightStyle} />
            )}

            {/* Tooltip card — dynamically positioned above or below the spotlight */}
            {!switching && (
                <div
                    key={`tooltip-${stepIdx}`}
                    ref={tooltipRef}
                    className="tutorial-tooltip"
                    style={tooltipStyle}
                >
                    {/* Tab switch hint */}
                    {step.tabLabel && stepIdx > 0 && STEPS[stepIdx - 1]?.tab !== step.tab && (
                        <div className="tutorial-tab-hint">
                            <Navigation size={12} />
                            Moved you to the {step.tabLabel} tab
                        </div>
                    )}

                    {/* Step badge */}
                    <div className="tutorial-step-badge">
                        <span className="tutorial-step-emoji">{step.emoji}</span>
                        {step.badge}
                    </div>

                    {/* Content */}
                    <h3 className="tutorial-title">{step.title}</h3>
                    <p className="tutorial-desc">{step.desc}</p>

                    {/* Progress dots */}
                    <div className="tutorial-progress">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`tutorial-dot ${i === stepIdx ? 'active' : i < stepIdx ? 'done' : ''}`}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="tutorial-actions">
                        <button className="tutorial-skip-btn" onClick={finish}>
                            Skip
                        </button>
                        <button
                            className={`tutorial-next-btn ${isLast ? 'finish' : ''}`}
                            onClick={goNext}
                        >
                            {isLast ? (
                                <>
                                    <CheckCircle size={17} />
                                    Let's go!
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight size={17} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Switching indicator */}
            {switching && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 140,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--surface-color, #1E1E2E)',
                        border: '1.5px solid rgba(255,183,3,0.3)',
                        borderRadius: 16,
                        padding: '14px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: '#FFB703',
                        fontWeight: 700,
                        fontSize: 14,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                        pointerEvents: 'all',
                    }}
                >
                    <Navigation size={16} />
                    Heading to {step.tabLabel || step.tab}…
                </div>
            )}
        </div>
    );
};

export default AppTutorial;
