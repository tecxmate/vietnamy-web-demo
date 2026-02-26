import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ChevronDown, Heart, Check, X } from 'lucide-react';
import { getNodeById } from '../lib/db';
import { getGrammarItems } from '../lib/grammarDB';
import { useDong } from '../context/DongContext';
import speak from '../utils/speak';

const GrammarLesson = () => {
    const { nodeId } = useParams();
    const navigate = useNavigate();
    const dongCtx = useDong();

    const [phase, setPhase] = useState('reading'); // 'reading' | 'quiz' | 'finished'
    const [grammarItem, setGrammarItem] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [openFaq, setOpenFaq] = useState(null);

    // Quiz state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hearts, setHearts] = useState(5);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const rewardGivenRef = useRef(false);

    useEffect(() => {
        const node = getNodeById(nodeId);
        if (!node || !node.skill_content) { navigate('/'); return; }

        const { grammar_level, grammar_index } = node.skill_content;
        const items = getGrammarItems().filter(i => i.level === grammar_level);
        const item = items[grammar_index];
        if (!item) { navigate('/'); return; }
        setGrammarItem(item);

        // Load exercises for this grammar node from the DB
        const raw = localStorage.getItem('vnme_mock_db_v5');
        if (raw) {
            const db = JSON.parse(raw);
            const nodeExercises = (db.exercises || []).filter(ex => ex.lesson_id === nodeId);
            setExercises(nodeExercises);
        }
    }, [nodeId, navigate]);

    useEffect(() => {
        if (phase === 'finished' && !rewardGivenRef.current) {
            rewardGivenRef.current = true;
            dongCtx.completeNode(nodeId);
        }
    }, [phase]);

    const currentEx = exercises[currentIndex];
    const progress = exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0;

    const handleCheck = () => {
        if (!currentEx) return;
        let correct = false;
        if (currentEx.exercise_type === 'mcq_translate_to_vi') correct = selectedAnswer === currentEx.prompt.answer_vi;
        else if (currentEx.exercise_type === 'mcq_translate_to_en') correct = selectedAnswer === currentEx.prompt.answer_en;
        else if (currentEx.exercise_type === 'fill_blank') {
            const accepted = currentEx.prompt.accepted_answers_vi || [currentEx.prompt.answer_vi];
            correct = accepted.some(a => a.toLowerCase() === (selectedAnswer || '').toLowerCase());
        } else if (currentEx.exercise_type === 'diacritics_choice') correct = selectedAnswer === currentEx.prompt.answer_vi;
        else correct = selectedAnswer !== null;

        setIsCorrect(correct);
        setIsChecking(true);
        if (correct) setScore(s => s + 1);
        else setHearts(h => Math.max(0, h - 1));
    };

    const handleNext = () => {
        if (hearts === 0) { navigate('/'); return; }
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

    // Enter key shortcut
    useEffect(() => {
        const onKey = (e) => {
            if (e.key !== 'Enter') return;
            if (phase === 'quiz') {
                if (isChecking) handleNext();
                else if (canCheck()) handleCheck();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    if (!grammarItem) return null;

    const { title, pattern, example, sections, faqs, extracted_patterns, error: hasError } = grammarItem;
    const validFaqs = (faqs || []).filter(f => f.question && f.answer && f.question.length < 200);

    // --- READING PHASE ---
    if (phase === 'reading') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
                <header style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-color)' }}>
                    <ArrowLeft size={24} onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
                    <h1 style={{ margin: 0, fontSize: 18, flex: 1 }}>{title}</h1>
                </header>

                <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                    {/* Main pattern */}
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <span style={{ display: 'inline-block', padding: '8px 20px', backgroundColor: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 20, fontWeight: 700, fontSize: 16, color: '#A78BFA' }}>
                            {pattern}
                        </span>
                    </div>

                    {/* Example */}
                    {example?.vi && (
                        <div style={{ backgroundColor: 'var(--surface-color)', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>{example.vi}</p>
                                {example.en && <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>{example.en}</p>}
                            </div>
                            <button onClick={() => speak(example.vi)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8 }}>
                                <Volume2 size={20} />
                            </button>
                        </div>
                    )}

                    {/* Related patterns */}
                    {extracted_patterns && extracted_patterns.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>Related Patterns</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {extracted_patterns.map((ep, i) => (
                                    <span key={i} style={{ padding: '4px 12px', backgroundColor: 'var(--surface-color)', borderRadius: 12, fontSize: 13, color: 'var(--text-main)' }}>{ep}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sections */}
                    {sections && sections.length > 0 && !hasError && sections.map((sec, i) => (
                        <div key={i} style={{ backgroundColor: 'var(--surface-color)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                            {sec.heading && <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{sec.heading}</h3>}
                            {sec.explanation && <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>{sec.explanation}</p>}
                            {sec.pattern && (
                                <div style={{ marginBottom: 12 }}>
                                    <span style={{ padding: '4px 12px', backgroundColor: 'rgba(167,139,250,0.1)', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#A78BFA' }}>{sec.pattern}</span>
                                </div>
                            )}
                            {sec.note && <p style={{ margin: '0 0 8px', fontSize: 13, fontStyle: 'italic', color: 'var(--text-muted)' }}>{sec.note}</p>}
                            {sec.examples && sec.examples.length > 0 && sec.examples.map((ex, j) => (
                                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: j > 0 ? '1px solid var(--border-color)' : 'none' }}>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontWeight: 600 }}>{ex.vi}</span>
                                        {ex.en && <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 8 }}>— {ex.en}</span>}
                                    </div>
                                    {ex.vi && (
                                        <button onClick={() => speak(ex.vi)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                                            <Volume2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}

                    {hasError && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Detail content unavailable.</p>}

                    {/* FAQs */}
                    {validFaqs.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <h3 style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>FAQs</h3>
                            {validFaqs.map((faq, i) => (
                                <div key={i} style={{ backgroundColor: 'var(--surface-color)', borderRadius: 12, marginBottom: 8, overflow: 'hidden' }}>
                                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', color: 'var(--text-main)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                                        <span style={{ flex: 1 }}>{faq.question}</span>
                                        <ChevronDown size={16} style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                    </button>
                                    {openFaq === i && <div style={{ padding: '0 16px 12px', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{faq.answer}</div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Start Quiz button */}
                <div style={{ padding: 24, borderTop: '2px solid var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
                    {exercises.length > 0 ? (
                        <button className="primary w-full shadow-lg" style={{ fontSize: 18, backgroundColor: '#A78BFA', boxShadow: '0 4px 0 #7C3AED' }} onClick={() => setPhase('quiz')}>
                            START QUIZ ({exercises.length} questions)
                        </button>
                    ) : (
                        <button className="primary w-full shadow-lg" style={{ fontSize: 18 }} onClick={() => { dongCtx.completeNode(nodeId); navigate('/'); }}>
                            MARK AS READ
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // --- FINISHED PHASE ---
    if (phase === 'finished') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
                    <div style={{ width: 120, height: 120, backgroundColor: '#A78BFA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                        <Check size={64} color="white" strokeWidth={3} />
                    </div>
                    <h1 style={{ color: '#A78BFA', fontSize: 28, marginBottom: 8 }}>Grammar Complete!</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{score}/{exercises.length} correct</p>
                </div>
                <div style={{ padding: 24, borderTop: '2px solid var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
                    <button className="primary w-full shadow-lg" onClick={() => navigate('/')}>CONTINUE</button>
                </div>
            </div>
        );
    }

    // --- QUIZ PHASE ---
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }}>
            {/* Top bar */}
            <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <button className="ghost" onClick={() => navigate('/')} style={{ padding: 8 }}>
                    <X size={24} color="var(--text-muted)" />
                </button>
                <div style={{ flex: 1, height: 16, backgroundColor: 'var(--surface-color)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#A78BFA', transition: 'width 0.3s ease-out', borderRadius: 8 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--danger-color)', fontWeight: 700 }}>
                    <Heart size={24} fill="var(--danger-color)" /> {hearts}
                </div>
            </div>

            {/* Exercise content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {hearts === 0 ? (
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: 32, color: 'var(--danger-color)' }}>Out of Hearts!</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Keep practicing to earn more.</p>
                        </div>
                    ) : currentEx ? (
                        <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <h2 style={{ fontSize: 24, margin: 0 }}>{currentEx.prompt.instruction}</h2>

                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.2)', border: '2px solid #A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 28 }}>
                                    &#128218;
                                </div>
                                <div style={{ flex: 1, padding: 16, backgroundColor: 'var(--surface-color)', borderRadius: 16, border: '2px solid var(--border-color)', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: -10, top: 20, width: 20, height: 20, backgroundColor: 'var(--surface-color)', borderLeft: '2px solid var(--border-color)', borderBottom: '2px solid var(--border-color)', transform: 'rotate(45deg)' }} />
                                    <span style={{ fontSize: 18, position: 'relative', zIndex: 2 }}>{currentEx.prompt.source_text_en || currentEx.prompt.source_text_vi || currentEx.prompt.template_vi || "Translate this"}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {['mcq_translate_to_vi', 'mcq_translate_to_en', 'diacritics_choice'].includes(currentEx.exercise_type) &&
                                    (currentEx.prompt.choices_vi || currentEx.prompt.choices_en).map((choice, idx) => (
                                        <button
                                            key={idx}
                                            className={selectedAnswer === choice ? 'primary' : 'secondary'}
                                            style={{
                                                width: '100%', justifyContent: 'flex-start', padding: 20, fontSize: 18,
                                                borderColor: selectedAnswer === choice ? '#A78BFA' : 'var(--border-color)',
                                                backgroundColor: selectedAnswer === choice ? 'rgba(167,139,250,0.1)' : 'transparent',
                                                color: selectedAnswer === choice ? '#A78BFA' : 'var(--text-main)'
                                            }}
                                            onClick={() => !isChecking && setSelectedAnswer(choice)}
                                            disabled={isChecking}
                                        >
                                            {choice}
                                        </button>
                                    ))}

                                {currentEx.exercise_type === 'fill_blank' && (
                                    <input
                                        type="text"
                                        placeholder="Type in Vietnamese"
                                        value={selectedAnswer || ''}
                                        onChange={(e) => !isChecking && setSelectedAnswer(e.target.value)}
                                        style={{ width: '100%', padding: 20, fontSize: 20, borderRadius: 16, backgroundColor: 'var(--surface-color)', border: '2px solid var(--border-color)', color: 'var(--text-main)', marginTop: 16 }}
                                        disabled={isChecking}
                                    />
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Bottom check bar */}
            <div style={{
                padding: '24px 16px',
                borderTop: '2px solid var(--border-color)',
                backgroundColor: isChecking ? (isCorrect ? 'rgba(6, 214, 160, 0.1)' : 'rgba(239, 71, 111, 0.1)') : 'var(--surface-color)',
                transition: 'background-color 0.2s',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                {isChecking ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: isCorrect ? 'var(--success-color)' : 'var(--danger-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isCorrect ? <Check size={20} color="#1A1A1A" strokeWidth={3} /> : <X size={20} color="white" strokeWidth={3} />}
                            </div>
                            <h3 style={{ margin: 0, fontSize: 24, color: isCorrect ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                {isCorrect ? 'Nicely done!' : 'Correct solution:'}
                            </h3>
                        </div>
                        {!isCorrect && (
                            <div style={{ fontSize: 18, color: 'var(--danger-color)' }}>
                                {currentEx?.prompt?.answer_vi || currentEx?.prompt?.answer_en}
                            </div>
                        )}
                        <button
                            className="primary shadow-lg"
                            style={{
                                width: '100%', fontSize: 18,
                                backgroundColor: isCorrect ? 'var(--success-color)' : 'var(--danger-color)',
                                color: isCorrect ? '#1A1A1A' : 'white',
                                boxShadow: isCorrect ? '0 4px 0 #05A67D' : '0 4px 0 #B52F4E'
                            }}
                            onClick={handleNext}
                        >
                            CONTINUE
                        </button>
                    </div>
                ) : (
                    <button
                        className="primary shadow-lg"
                        style={{ width: '100%', fontSize: 18, opacity: canCheck() ? 1 : 0.5, backgroundColor: '#A78BFA', boxShadow: '0 4px 0 #7C3AED' }}
                        onClick={handleCheck}
                        disabled={!canCheck()}
                    >
                        CHECK
                    </button>
                )}
            </div>
        </div>
    );
};

export default GrammarLesson;
