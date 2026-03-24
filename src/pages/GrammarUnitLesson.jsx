/**
 * GrammarUnitLesson — Full lesson page for a single grammar unit.
 *
 * Three-phase flow:
 *   1. Tips  — Card carousel showing pattern, explanation, and examples
 *   2. Quiz  — 6 auto-generated exercises with 5-heart system
 *   3. Done  — Score summary, coin reward, completion
 *
 * Route: /grammar-unit/:unitId
 * Data source: grammar_modules.json via grammarModulesDB
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft, ArrowRight, Volume2, Heart, Check, X,
    BookOpenText, Trophy
} from 'lucide-react';
import { getUnit, generateExercisesForUnit } from '../lib/grammarModulesDB';
import { useDong } from '../context/DongContext';
import speak from '../utils/speak';
import { playSuccess, playError } from '../utils/sound';
import SoundButton from '../components/SoundButton';

const ACCENT = '#A78BFA'; // purple — matches roadmap node color
const EXERCISES_PER_LESSON = 6;

// ─── Tip card builders ──────────────────────────────────────────

function buildTipCards(unit, module) {
    const cards = [];

    // Card 1: Intro
    cards.push({
        type: 'intro',
        title: unit.title,
        pattern: unit.pattern,
        moduleName: module.title,
        explanation: unit.explanation,
    });

    // Card 2: Examples showcase
    if (unit.examples && unit.examples.length > 0) {
        cards.push({
            type: 'examples',
            title: 'Examples',
            examples: unit.examples.slice(0, 5),
        });
    }

    // Card 3: Note / tip (if available)
    if (unit.note) {
        cards.push({
            type: 'note',
            title: 'Good to Know',
            note: unit.note,
        });
    }

    return cards;
}

// ─── Tip Card Components ────────────────────────────────────────

function IntroCard({ card }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: 1.5, color: ACCENT,
            }}>
                {card.moduleName}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
                {card.title}
            </h2>

            {card.pattern && (
                <div style={{ textAlign: 'center' }}>
                    <span style={{
                        display: 'inline-block', padding: '10px 24px',
                        backgroundColor: 'rgba(167,139,250,0.12)', border: '2px solid rgba(167,139,250,0.3)',
                        borderRadius: 16, fontWeight: 700, fontSize: 17, color: ACCENT,
                    }}>
                        {card.pattern}
                    </span>
                </div>
            )}

            {card.explanation && (
                <p style={{
                    margin: 0, fontSize: 15, lineHeight: 1.65,
                    color: 'var(--text-main)',
                }}>
                    {card.explanation}
                </p>
            )}
        </div>
    );
}

function ExamplesCard({ card }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{
                fontSize: 16, fontWeight: 800, margin: 0,
                textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)',
            }}>
                {card.title}
            </h3>
            <div style={{
                backgroundColor: 'var(--surface-color)', borderRadius: 12,
                border: '1px solid var(--border-color)', overflow: 'hidden',
            }}>
                {card.examples.map((ex, j) => (
                    <div key={j} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '12px 16px',
                        borderTop: j > 0 ? '1px solid var(--border-color)' : 'none',
                    }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 600, fontSize: 15 }}>{ex.vi}</span>
                            {ex.en && <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 8 }}>— {ex.en}</span>}
                        </div>
                        {ex.vi && (
                            <button onClick={() => speak(ex.vi)} style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-muted)', padding: 4,
                            }}>
                                <Volume2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function NoteCard({ card }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{
                fontSize: 16, fontWeight: 800, margin: 0,
                textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)',
            }}>
                {card.title}
            </h3>
            <div style={{
                padding: '16px 20px', borderRadius: 12,
                backgroundColor: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
            }}>
                <p style={{
                    margin: 0, fontSize: 14, lineHeight: 1.6,
                    color: 'var(--text-main)', fontStyle: 'italic',
                }}>
                    {card.note}
                </p>
            </div>
        </div>
    );
}

function renderTipCard(card) {
    switch (card.type) {
        case 'intro': return <IntroCard card={card} />;
        case 'examples': return <ExamplesCard card={card} />;
        case 'note': return <NoteCard card={card} />;
        default: return null;
    }
}

// ─── Exercise Renderers ─────────────────────────────────────────

function MCQExercise({ exercise, selectedAnswer, onSelect, isChecking, isCorrect }) {
    const isMCQToEn = exercise.exercise_type === 'mcq_translate_to_en';
    const isMCQToVi = exercise.exercise_type === 'mcq_translate_to_vi';
    const isListenChoose = exercise.exercise_type === 'listen_choose';

    const prompt = exercise.prompt;
    const question = isMCQToEn ? prompt.sentence_vi :
        isMCQToVi ? prompt.sentence_en :
            isListenChoose ? prompt.audio_vi : '';
    const options = isMCQToEn ? prompt.options_en :
        isMCQToVi ? prompt.options_vi :
            isListenChoose ? prompt.options_en : [];
    const correctAnswer = isMCQToEn ? prompt.answer_en :
        isMCQToVi ? prompt.answer_vi :
            isListenChoose ? prompt.answer_en : '';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8,
                }}>
                    {isMCQToEn ? 'Translate to English' :
                        isMCQToVi ? 'Translate to Vietnamese' :
                            'Listen and choose'}
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                    {(isMCQToEn || isListenChoose) && (
                        <button onClick={() => speak(question)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: ACCENT, padding: 4,
                        }}>
                            <Volume2 size={20} />
                        </button>
                    )}
                    <span style={{
                        fontSize: 20, fontWeight: 700,
                        color: 'var(--text-main)',
                    }}>
                        {question}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {options.map((opt, i) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrectOption = opt === correctAnswer;
                    let bg = 'var(--surface-color)';
                    let borderColor = 'var(--border-color)';
                    let textColor = 'var(--text-main)';

                    if (isChecking) {
                        if (isCorrectOption) { bg = 'rgba(167,139,250,0.12)'; borderColor = ACCENT; textColor = ACCENT; }
                        else if (isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.12)'; borderColor = '#EF4444'; textColor = '#EF4444'; }
                    } else if (isSelected) {
                        bg = `${ACCENT}12`; borderColor = ACCENT;
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => !isChecking && onSelect(opt)}
                            style={{
                                padding: '14px 16px', borderRadius: 12,
                                border: `2px solid ${borderColor}`,
                                backgroundColor: bg, cursor: isChecking ? 'default' : 'pointer',
                                textAlign: 'left', fontSize: 15, fontWeight: 600,
                                color: textColor,
                            }}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function FillBlankExercise({ exercise, selectedAnswer, onSelect, isChecking, isCorrect }) {
    const { sentence_with_blank, hint_en, answer_vi } = exercise.prompt;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8,
                }}>
                    Fill in the blank
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {sentence_with_blank}
                </div>
                {hint_en && (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                        Hint: {hint_en}
                    </div>
                )}
            </div>

            <input
                type="text"
                value={selectedAnswer || ''}
                onChange={e => !isChecking && onSelect(e.target.value)}
                placeholder="Type the missing word..."
                autoFocus
                style={{
                    padding: '14px 16px', borderRadius: 12, fontSize: 16,
                    border: `2px solid ${isChecking ? (isCorrect ? ACCENT : '#EF4444') : 'var(--border-color)'}`,
                    backgroundColor: 'var(--surface-color)',
                    color: 'var(--text-main)',
                    outline: 'none', fontFamily: 'inherit',
                }}
            />

            {isChecking && !isCorrect && (
                <div style={{ fontSize: 14, color: ACCENT, fontWeight: 600 }}>
                    Correct answer: {answer_vi}
                </div>
            )}
        </div>
    );
}

function ReorderExercise({ exercise, onSelect, isChecking, isCorrect }) {
    const { words_shuffled, answer_vi, hint_en } = exercise.prompt;
    const [selectedWords, setSelectedWords] = useState([]);
    const [available, setAvailable] = useState([...words_shuffled]);

    const addWord = (word, idx) => {
        if (isChecking) return;
        const newSelected = [...selectedWords, word];
        const newAvailable = [...available];
        newAvailable.splice(idx, 1);
        setSelectedWords(newSelected);
        setAvailable(newAvailable);
        onSelect(newSelected.join(' '));
    };

    const removeWord = (word, idx) => {
        if (isChecking) return;
        const newSelected = [...selectedWords];
        newSelected.splice(idx, 1);
        setSelectedWords(newSelected);
        setAvailable([...available, word]);
        onSelect(newSelected.join(' '));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8,
                }}>
                    Arrange the words
                </div>
                {hint_en && (
                    <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{hint_en}</div>
                )}
            </div>

            {/* Selected words area */}
            <div style={{
                minHeight: 50, padding: '10px 12px', borderRadius: 12,
                border: `2px solid ${isChecking ? (isCorrect ? ACCENT : '#EF4444') : 'var(--border-color)'}`,
                backgroundColor: 'var(--surface-color)',
                display: 'flex', flexWrap: 'wrap', gap: 6,
            }}>
                {selectedWords.length === 0 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Tap words below...</span>
                )}
                {selectedWords.map((w, i) => (
                    <button key={i} onClick={() => removeWord(w, i)} style={{
                        padding: '6px 12px', borderRadius: 8,
                        backgroundColor: `${ACCENT}15`, border: `1px solid ${ACCENT}40`,
                        color: 'var(--text-main)', fontWeight: 600, fontSize: 14,
                        cursor: isChecking ? 'default' : 'pointer',
                    }}>
                        {w}
                    </button>
                ))}
            </div>

            {/* Available words */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {available.map((w, i) => (
                    <button key={i} onClick={() => addWord(w, i)} style={{
                        padding: '6px 12px', borderRadius: 8,
                        backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)',
                        color: 'var(--text-main)', fontWeight: 600, fontSize: 14,
                        cursor: isChecking ? 'default' : 'pointer',
                    }}>
                        {w}
                    </button>
                ))}
            </div>

            {isChecking && !isCorrect && (
                <div style={{ fontSize: 14, color: ACCENT, fontWeight: 600 }}>
                    Correct: {answer_vi}
                </div>
            )}
        </div>
    );
}

function renderExercise(exercise, selectedAnswer, onSelect, isChecking, isCorrect) {
    const type = exercise.exercise_type;
    if (['mcq_translate_to_en', 'mcq_translate_to_vi', 'listen_choose'].includes(type)) {
        return <MCQExercise exercise={exercise} selectedAnswer={selectedAnswer}
            onSelect={onSelect} isChecking={isChecking} isCorrect={isCorrect} />;
    }
    if (type === 'fill_blank') {
        return <FillBlankExercise exercise={exercise} selectedAnswer={selectedAnswer}
            onSelect={onSelect} isChecking={isChecking} isCorrect={isCorrect} />;
    }
    if (type === 'reorder_words') {
        return <ReorderExercise exercise={exercise} selectedAnswer={selectedAnswer}
            onSelect={onSelect} isChecking={isChecking} isCorrect={isCorrect} />;
    }
    // Fallback: render as MCQ
    return <MCQExercise exercise={exercise} selectedAnswer={selectedAnswer}
        onSelect={onSelect} isChecking={isChecking} isCorrect={isCorrect} />;
}

// ─── Main Component ─────────────────────────────────────────────

export default function GrammarUnitLesson() {
    const { unitId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const roadmapNodeId = searchParams.get('nodeId'); // path_node ID from roadmap
    const dongCtx = useDong();

    const [phase, setPhase] = useState('tips');
    const [cardIndex, setCardIndex] = useState(0);
    // Quiz state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hearts, setHearts] = useState(5);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const rewardGivenRef = useRef(false);

    // Load unit data synchronously (it's a static JSON import)
    const unitData = useMemo(() => getUnit(unitId), [unitId]);

    // Derive tip cards and exercises from unit data
    const tipCards = useMemo(() => {
        if (!unitData) return [];
        return buildTipCards(unitData.unit, unitData.module);
    }, [unitData]);

    const exercises = useMemo(() => {
        if (!unitData) return [];
        return generateExercisesForUnit(unitId, EXERCISES_PER_LESSON);
    }, [unitData, unitId]);

    // Redirect if unit not found
    useEffect(() => {
        if (!unitData) navigate('/', { state: { tab: 'study' } });
    }, [unitData, navigate]);

    // Completion reward — mark both grammar unit ID and roadmap node ID
    const markComplete = () => {
        if (roadmapNodeId) dongCtx.completeNode(roadmapNodeId, { immediate: true });
        dongCtx.completeNode(unitId, { immediate: true });
    };

    useEffect(() => {
        if (phase === 'finished' && !rewardGivenRef.current) {
            rewardGivenRef.current = true;
            markComplete();
        }
    }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

    const currentEx = exercises[currentIndex];
    const progress = exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0;

    const handleCheck = () => {
        if (!currentEx) return;
        let correct = false;

        switch (currentEx.exercise_type) {
            case 'mcq_translate_to_vi':
                correct = selectedAnswer === currentEx.prompt.answer_vi;
                break;
            case 'mcq_translate_to_en':
            case 'listen_choose':
                correct = selectedAnswer === currentEx.prompt.answer_en;
                break;
            case 'fill_blank': {
                const accepted = currentEx.prompt.accepted_answers_vi || [currentEx.prompt.answer_vi];
                correct = accepted.some(a => a.toLowerCase() === (selectedAnswer || '').toLowerCase());
                break;
            }
            case 'reorder_words':
                correct = (selectedAnswer || '').trim() === currentEx.prompt.answer_vi;
                break;
            default:
                correct = selectedAnswer !== null;
        }

        setIsCorrect(correct);
        setIsChecking(true);
        if (correct) { playSuccess(); setScore(s => s + 1); }
        else { playError(); setHearts(h => Math.max(0, h - 1)); }
    };

    const handleNext = () => {
        if (hearts === 0) { navigate('/', { state: { tab: 'study' } }); return; }
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(i => i + 1);
            setSelectedAnswer(null);
            setIsChecking(false);
            setIsCorrect(null);
        } else {
            setPhase('finished');
        }
    };

    const canCheck = () => selectedAnswer !== null && selectedAnswer !== '';

    // Keyboard nav
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Enter') {
                if (phase === 'tips') {
                    if (cardIndex < tipCards.length - 1) setCardIndex(i => i + 1);
                    else if (exercises.length > 0) setPhase('quiz');
                    else {
                        markComplete();
                        navigate('/', { state: { tab: 'study' } });
                    }
                } else if (phase === 'quiz') {
                    if (isChecking) handleNext();
                    else if (canCheck()) handleCheck();
                }
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    if (!unitData) return null;
    const { unit } = unitData;

    // ─── TIPS PHASE ─────────────────────────────────────────
    if (phase === 'tips') {
        const card = tipCards[cardIndex];
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                backgroundColor: 'var(--bg-color)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '16px 16px 12px',
                    borderBottom: '1px solid var(--border-color)',
                }}>
                    <button onClick={() => navigate(-1)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: 4,
                    }}>
                        <ArrowLeft size={22} />
                    </button>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {tipCards.map((_, i) => (
                                <div key={i} style={{
                                    flex: 1, height: 4, borderRadius: 2,
                                    backgroundColor: i <= cardIndex ? ACCENT : 'var(--border-color)',
                                }} />
                            ))}
                        </div>
                    </div>
                    <BookOpenText size={20} color={ACCENT} />
                </div>

                {/* Card content */}
                <div style={{
                    flex: 1, padding: '28px 24px',
                    overflowY: 'auto',
                }}>
                    {card && renderTipCard(card)}
                </div>

                {/* Navigation */}
                <div style={{
                    padding: '16px 24px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                    display: 'flex', gap: 12,
                    borderTop: '1px solid var(--border-color)',
                }}>
                    {cardIndex > 0 && (
                        <SoundButton
                            onClick={() => setCardIndex(i => i - 1)}
                            style={{
                                padding: '14px 20px', borderRadius: 14,
                                border: '2px solid var(--border-color)',
                                backgroundColor: 'var(--surface-color)',
                                cursor: 'pointer', color: 'var(--text-main)',
                                fontWeight: 700, fontSize: 15,
                            }}
                        >
                            <ArrowLeft size={18} />
                        </SoundButton>
                    )}
                    <SoundButton
                        onClick={() => {
                            if (cardIndex < tipCards.length - 1) setCardIndex(i => i + 1);
                            else if (exercises.length > 0) setPhase('quiz');
                            else {
                                markComplete();
                                navigate('/', { state: { tab: 'study' } });
                            }
                        }}
                        style={{
                            flex: 1, padding: '14px 20px', borderRadius: 14,
                            border: 'none', cursor: 'pointer',
                            backgroundColor: ACCENT, color: '#fff',
                            fontWeight: 800, fontSize: 16,
                            boxShadow: `0 4px 0 #7C3AED`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}
                    >
                        {cardIndex < tipCards.length - 1 ? (
                            <>NEXT <ArrowRight size={18} /></>
                        ) : exercises.length > 0 ? (
                            'START LESSON'
                        ) : (
                            'DONE'
                        )}
                    </SoundButton>
                </div>
            </div>
        );
    }

    // ─── QUIZ PHASE ─────────────────────────────────────────
    if (phase === 'quiz') {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                backgroundColor: 'var(--bg-color)',
            }}>
                {/* Header with hearts + progress */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '16px 16px 12px',
                    borderBottom: '1px solid var(--border-color)',
                }}>
                    <button onClick={() => navigate(-1)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: 4,
                    }}>
                        <X size={22} />
                    </button>

                    {/* Progress bar */}
                    <div style={{
                        flex: 1, height: 8, borderRadius: 4,
                        backgroundColor: 'var(--border-color)',
                    }}>
                        <div style={{
                            width: `${progress}%`, height: '100%',
                            backgroundColor: ACCENT, borderRadius: 4,
                            transition: 'width 0.3s ease',
                        }} />
                    </div>

                    {/* Hearts */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        color: '#EF4444', fontWeight: 800, fontSize: 14,
                    }}>
                        <Heart size={18} fill="#EF4444" />
                        {hearts}
                    </div>
                </div>

                {/* Exercise content */}
                <div style={{
                    flex: 1, padding: '24px 20px',
                    overflowY: 'auto',
                }}>
                    {currentEx && renderExercise(currentEx, selectedAnswer, setSelectedAnswer, isChecking, isCorrect)}
                </div>

                {/* Check / Next button */}
                <div style={{
                    padding: '16px 24px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                    borderTop: '1px solid var(--border-color)',
                }}>
                    {isChecking ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column', gap: 12,
                        }}>
                            <div style={{
                                padding: '12px 16px', borderRadius: 12,
                                backgroundColor: isCorrect ? 'rgba(167,139,250,0.1)' : 'rgba(239,68,68,0.1)',
                                border: `1px solid ${isCorrect ? ACCENT : '#EF4444'}40`,
                                display: 'flex', alignItems: 'center', gap: 10,
                            }}>
                                {isCorrect ? <Check size={20} color={ACCENT} strokeWidth={3} /> :
                                    <X size={20} color="#EF4444" strokeWidth={3} />}
                                <span style={{
                                    fontWeight: 700, fontSize: 15,
                                    color: isCorrect ? ACCENT : '#EF4444',
                                }}>
                                    {isCorrect ? 'Correct!' : 'Not quite'}
                                </span>
                            </div>
                            <SoundButton
                                onClick={handleNext}
                                style={{
                                    width: '100%', padding: '14px 20px', borderRadius: 14,
                                    border: 'none', cursor: 'pointer',
                                    backgroundColor: isCorrect ? ACCENT : '#EF4444',
                                    color: '#fff', fontWeight: 800, fontSize: 16,
                                    boxShadow: `0 4px 0 ${isCorrect ? '#05A67D' : '#B91C1C'}`,
                                }}
                            >
                                CONTINUE
                            </SoundButton>
                        </div>
                    ) : (
                        <SoundButton
                            onClick={handleCheck}
                            disabled={!canCheck()}
                            style={{
                                width: '100%', padding: '14px 20px', borderRadius: 14,
                                border: 'none', cursor: canCheck() ? 'pointer' : 'default',
                                backgroundColor: canCheck() ? ACCENT : 'var(--border-color)',
                                color: canCheck() ? '#fff' : 'var(--text-muted)',
                                fontWeight: 800, fontSize: 16,
                                boxShadow: canCheck() ? `0 4px 0 #05A67D` : 'none',
                            }}
                        >
                            CHECK
                        </SoundButton>
                    )}
                </div>
            </div>
        );
    }

    // ─── FINISHED PHASE ─────────────────────────────────────
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--bg-color)',
            padding: '40px 24px',
            gap: 24,
        }}>
            <div style={{
                width: 80, height: 80, borderRadius: '50%',
                backgroundColor: `${ACCENT}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Trophy size={40} color={ACCENT} fill={ACCENT} />
            </div>

            <h2 style={{
                fontSize: 24, fontWeight: 800, margin: 0,
                textAlign: 'center', color: 'var(--text-main)',
            }}>
                Lesson Complete!
            </h2>

            <div style={{
                fontSize: 15, color: 'var(--text-muted)',
                textAlign: 'center', lineHeight: 1.5,
            }}>
                <strong style={{ color: ACCENT }}>{unit.title}</strong>
                <br />
                You scored {score}/{exercises.length}
            </div>

            {/* Stats row */}
            <div style={{
                display: 'flex', gap: 16,
                justifyContent: 'center',
            }}>
                <div style={{
                    textAlign: 'center', padding: '12px 20px',
                    borderRadius: 12, backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT }}>{score}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Correct</div>
                </div>
                <div style={{
                    textAlign: 'center', padding: '12px 20px',
                    borderRadius: 12, backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#F59E0B' }}>+10</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Coins</div>
                </div>
                <div style={{
                    textAlign: 'center', padding: '12px 20px',
                    borderRadius: 12, backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#EF4444' }}>
                        {hearts}/{5}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Hearts</div>
                </div>
            </div>

            <SoundButton
                onClick={() => navigate('/', { state: { tab: 'study' } })}
                style={{
                    width: '100%', maxWidth: 320, padding: '16px 24px',
                    borderRadius: 14, border: 'none', cursor: 'pointer',
                    backgroundColor: ACCENT, color: '#fff',
                    fontWeight: 800, fontSize: 16,
                    boxShadow: `0 4px 0 #05A67D`,
                }}
            >
                CONTINUE
            </SoundButton>
        </div>
    );
}
