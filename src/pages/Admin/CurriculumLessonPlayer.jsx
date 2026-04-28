import React, { useEffect, useMemo, useState } from 'react';
import { Volume2, X, ChevronRight, Check, RotateCcw } from 'lucide-react';
import speak from '../../utils/speak';

/**
 * Self-contained lesson player for the study_import preview.
 * Generates exercises on the fly from a lesson's words/sentences/matches.
 * Does NOT write progress, hearts, XP, or SRS state — pure preview.
 */

const TYPES = {
    MCQ: 'mcq',
    LISTEN: 'listen',
    MATCH: 'match',
    FILL: 'fill',
};

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickDistractors(pool, correct, n = 3) {
    const candidates = pool.filter(x => x !== correct && x);
    return shuffle(candidates).slice(0, n);
}

function buildExercises(lesson) {
    const exercises = [];
    const wordTrPool = lesson.words.map(w => w.translation).filter(Boolean);
    const wordViPool = lesson.words.map(w => w.vi);

    // 1. MCQ vi → translation, one per word with a translation
    lesson.words.forEach(w => {
        if (!w.translation) return;
        const distractors = pickDistractors(wordTrPool, w.translation, 3);
        if (distractors.length < 2) return; // not enough variety
        exercises.push({
            type: TYPES.MCQ,
            prompt: w.vi,
            promptIpa: w.ipa,
            answer: w.translation,
            options: shuffle([w.translation, ...distractors]),
            playable: w.vi,
        });
    });

    // 2. Listen: TTS plays vi, pick translation
    lesson.words.slice(0, 6).forEach(w => {
        if (!w.translation) return;
        const distractors = pickDistractors(wordTrPool, w.translation, 3);
        if (distractors.length < 2) return;
        exercises.push({
            type: TYPES.LISTEN,
            prompt: w.vi,
            answer: w.translation,
            options: shuffle([w.translation, ...distractors]),
            playable: w.vi,
        });
    });

    // 3. Match-pairs: build from lesson.matches OR from first 5 vocab pairs
    const matchSource = lesson.matches.length >= 4
        ? lesson.matches.map(m => ({ a: m.text, b: m.target }))
        : lesson.words.filter(w => w.translation).slice(0, 5).map(w => ({ a: w.vi, b: w.translation }));
    if (matchSource.length >= 3) {
        exercises.push({
            type: TYPES.MATCH,
            pairs: matchSource.slice(0, 5),
        });
    }

    // 4. Fill-blank from sentences: blank one Vietnamese word, choose from options
    lesson.sentences.slice(0, 4).forEach(s => {
        if (!s.translation) return;
        const tokens = s.vi.split(/\s+/);
        if (tokens.length < 3) return;
        // Pick a content word (not the first or last, prefer length > 2)
        const candidateIdx = tokens
            .map((t, i) => ({ t, i }))
            .filter(x => x.i > 0 && x.i < tokens.length - 1 && x.t.replace(/[.,!?]/g, '').length > 1);
        if (candidateIdx.length === 0) return;
        const pick = candidateIdx[Math.floor(Math.random() * candidateIdx.length)];
        const target = pick.t.replace(/[.,!?]/g, '');
        const distractors = pickDistractors(wordViPool.filter(v => v !== target), target, 3);
        if (distractors.length < 2) return;
        const blanked = tokens.map((t, i) => i === pick.i ? '___' : t).join(' ');
        exercises.push({
            type: TYPES.FILL,
            prompt: blanked,
            translation: s.translation,
            answer: target,
            options: shuffle([target, ...distractors]),
            playable: s.vi,
        });
    });

    return shuffle(exercises);
}

export default function CurriculumLessonPlayer({ lesson, onClose }) {
    const exercises = useMemo(() => buildExercises(lesson), [lesson]);
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [picked, setPicked] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [done, setDone] = useState(false);
    const ex = exercises[idx];

    useEffect(() => {
        // Auto-play vi when a listen exercise opens
        if (ex?.type === TYPES.LISTEN && !revealed) {
            const t = setTimeout(() => speak(ex.playable), 300);
            return () => clearTimeout(t);
        }
    }, [idx, ex, revealed]);

    if (exercises.length === 0) {
        return (
            <Overlay onClose={onClose}>
                <div style={{ padding: 32, textAlign: 'center' }}>
                    <h2>Not enough content</h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        This lesson has too few words/sentences/translations to generate exercises.
                    </p>
                    <button onClick={onClose} style={btnPrimary}>Close</button>
                </div>
            </Overlay>
        );
    }

    if (done) {
        return (
            <Overlay onClose={onClose}>
                <div style={{ padding: 32, textAlign: 'center' }}>
                    <h2 style={{ fontSize: 28, margin: 0 }}>Done — {score}/{exercises.length}</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
                        {Math.round(score / exercises.length * 100)}% correct on "{lesson.lesson_title}"
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                        <button onClick={() => { setIdx(0); setScore(0); setPicked(null); setRevealed(false); setDone(false); }} style={btnGhost}>
                            <RotateCcw size={16} /> Replay
                        </button>
                        <button onClick={onClose} style={btnPrimary}>Close</button>
                    </div>
                </div>
            </Overlay>
        );
    }

    const handlePick = (option) => {
        if (revealed) return;
        setPicked(option);
        setRevealed(true);
        if (option === ex.answer) setScore(s => s + 1);
    };

    const handleNext = () => {
        if (idx + 1 >= exercises.length) {
            setDone(true);
        } else {
            setIdx(i => i + 1);
            setPicked(null);
            setRevealed(false);
        }
    };

    const handleMatchComplete = (correct) => {
        if (correct) setScore(s => s + 1);
        setRevealed(true);
    };

    return (
        <Overlay onClose={onClose}>
            {/* Progress bar */}
            <div style={{ height: 6, background: 'var(--border-color)', borderRadius: 3, margin: '16px 24px 0' }}>
                <div style={{ height: '100%', width: `${(idx / exercises.length) * 100}%`, background: 'var(--primary-color)', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 24px', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>{lesson.lesson_title}</span>
                <span>{idx + 1} / {exercises.length} · score {score}</span>
            </div>

            <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>
                {ex.type === TYPES.MCQ && <MCQView ex={ex} picked={picked} revealed={revealed} onPick={handlePick} />}
                {ex.type === TYPES.LISTEN && <ListenView ex={ex} picked={picked} revealed={revealed} onPick={handlePick} />}
                {ex.type === TYPES.FILL && <FillView ex={ex} picked={picked} revealed={revealed} onPick={handlePick} />}
                {ex.type === TYPES.MATCH && <MatchView ex={ex} revealed={revealed} onComplete={handleMatchComplete} />}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid var(--border-color)', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                {revealed ? (
                    <>
                        <div style={{ fontSize: 13, fontWeight: 700, color: (ex.type === TYPES.MATCH ? 'var(--text-main)' : (picked === ex.answer ? '#10B981' : '#F26B5A')) }}>
                            {ex.type === TYPES.MATCH
                                ? 'Match complete'
                                : picked === ex.answer
                                    ? '✓ Correct'
                                    : `✗ Answer: ${ex.answer}`}
                        </div>
                        <button onClick={handleNext} style={btnPrimary}>
                            {idx + 1 >= exercises.length ? 'Finish' : 'Next'} <ChevronRight size={16} />
                        </button>
                    </>
                ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Pick an answer to continue</div>
                )}
            </div>
        </Overlay>
    );
}

// ─── Views ──────────────────────────────────────────────────────────────

function MCQView({ ex, picked, revealed, onPick }) {
    return (
        <>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>What does this mean?</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <h2 style={{ fontSize: 36, margin: 0 }}>{ex.prompt}</h2>
                <button onClick={() => speak(ex.playable)} style={iconBtn}><Volume2 size={20} /></button>
            </div>
            {ex.promptIpa && <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{ex.promptIpa}</div>}
            <Options options={ex.options} answer={ex.answer} picked={picked} revealed={revealed} onPick={onPick} />
        </>
    );
}

function ListenView({ ex, picked, revealed, onPick }) {
    return (
        <>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>What did you hear?</div>
            <button onClick={() => speak(ex.playable)} style={{ ...iconBtn, fontSize: 18, padding: 32, marginBottom: 24, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <Volume2 size={32} /> Play again
            </button>
            <Options options={ex.options} answer={ex.answer} picked={picked} revealed={revealed} onPick={onPick} />
            {revealed && <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700, textAlign: 'center' }}>{ex.prompt}</div>}
        </>
    );
}

function FillView({ ex, picked, revealed, onPick }) {
    return (
        <>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Fill the blank</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <h2 style={{ fontSize: 24, margin: 0, lineHeight: 1.4 }}>{ex.prompt}</h2>
                <button onClick={() => speak(ex.playable)} style={iconBtn}><Volume2 size={18} /></button>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, fontStyle: 'italic' }}>{ex.translation}</div>
            <Options options={ex.options} answer={ex.answer} picked={picked} revealed={revealed} onPick={onPick} />
        </>
    );
}

function MatchView({ ex, revealed, onComplete }) {
    const [leftSelected, setLeftSelected] = useState(null);
    const [matched, setMatched] = useState({}); // { leftIdx: rightIdx }
    const [wrongFlash, setWrongFlash] = useState(null);
    const left = ex.pairs.map((p, i) => ({ idx: i, text: p.a }));
    const right = useMemo(() => shuffle(ex.pairs.map((p, i) => ({ idx: i, text: p.b }))), [ex]);
    const matchedSet = new Set(Object.keys(matched).map(Number));
    const matchedRightSet = new Set(Object.values(matched));

    useEffect(() => {
        if (Object.keys(matched).length === ex.pairs.length && !revealed) {
            // All correct match attempts succeeded → declare correct
            onComplete(true);
        }
    }, [matched, ex.pairs.length, revealed, onComplete]);

    const handleLeft = (i) => { if (revealed || matchedSet.has(i)) return; setLeftSelected(i); };
    const handleRight = (i) => {
        if (revealed || matchedRightSet.has(i)) return;
        if (leftSelected === null) return;
        if (leftSelected === i) {
            setMatched(m => ({ ...m, [leftSelected]: i }));
            setLeftSelected(null);
        } else {
            setWrongFlash(i);
            setTimeout(() => setWrongFlash(null), 400);
            setLeftSelected(null);
        }
    };

    return (
        <>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Match the pairs</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {left.map(item => (
                        <button
                            key={`L${item.idx}`}
                            onClick={() => handleLeft(item.idx)}
                            disabled={matchedSet.has(item.idx)}
                            style={{
                                ...matchBtn,
                                opacity: matchedSet.has(item.idx) ? 0.4 : 1,
                                background: leftSelected === item.idx ? 'rgba(242,107,90,0.15)' : 'var(--surface-color)',
                                borderColor: leftSelected === item.idx ? 'var(--primary-color)' : 'var(--border-color)',
                            }}
                        >
                            {item.text}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {right.map(item => (
                        <button
                            key={`R${item.idx}`}
                            onClick={() => handleRight(item.idx)}
                            disabled={matchedRightSet.has(item.idx)}
                            style={{
                                ...matchBtn,
                                opacity: matchedRightSet.has(item.idx) ? 0.4 : 1,
                                background: wrongFlash === item.idx ? 'rgba(242,107,90,0.3)' : 'var(--surface-color)',
                                borderColor: wrongFlash === item.idx ? '#F26B5A' : 'var(--border-color)',
                            }}
                        >
                            {item.text}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

function Options({ options, answer, picked, revealed, onPick }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.map((opt, i) => {
                const isPicked = picked === opt;
                const isAnswer = revealed && opt === answer;
                const isWrong = revealed && isPicked && opt !== answer;
                return (
                    <button
                        key={i}
                        onClick={() => onPick(opt)}
                        disabled={revealed}
                        style={{
                            padding: '14px 16px',
                            textAlign: 'left',
                            border: '2px solid',
                            borderColor: isAnswer ? '#10B981' : isWrong ? '#F26B5A' : isPicked ? 'var(--primary-color)' : 'var(--border-color)',
                            background: isAnswer ? 'rgba(16,185,129,0.1)' : isWrong ? 'rgba(242,107,90,0.1)' : 'var(--surface-color)',
                            color: 'var(--text-main)',
                            borderRadius: 8,
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: revealed ? 'default' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}
                    >
                        <span>{opt}</span>
                        {isAnswer && <Check size={16} style={{ color: '#10B981' }} />}
                    </button>
                );
            })}
        </div>
    );
}

function Overlay({ children, onClose }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
            <div style={{
                background: 'var(--bg-color)', color: 'var(--text-main)',
                width: 'min(560px, 100%)', height: 'min(720px, 100%)',
                borderRadius: 12, display: 'flex', flexDirection: 'column',
                position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none',
                    cursor: 'pointer', color: 'var(--text-muted)', padding: 8, zIndex: 1,
                }}>
                    <X size={20} />
                </button>
                {children}
            </div>
        </div>
    );
}

const btnPrimary = { padding: '10px 20px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 };
const btnGhost = { padding: '10px 20px', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 };
const iconBtn = { background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8 };
const matchBtn = { padding: '12px 14px', borderRadius: 8, border: '2px solid', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--text-main)' };
