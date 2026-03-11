import React, { useState, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import FamilyTree from '../../components/FamilyTree';
import { FAMILY_MEMBERS } from '../../data/kinshipData';
import { calculatePronoun } from '../../utils/pronounLogic';
import { User, RefreshCcw, ArrowRight, ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PronounsPractice.css';
import SoundButton from '../../components/SoundButton';
import './PracticeShared.css';
import { playSuccess, playError } from '../../utils/sound';
import { usePracticeCompletion } from '../../hooks/usePracticeCompletion';

export default function PronounsPractice({ members: memberIds = null, title = '👥 Kinship & Pronouns', showQuiz = false }) {
    const { userProfile, updateUserProfile } = useUser();
    const { markComplete, goNext } = usePracticeCompletion();
    const [selectedMember, setSelectedMember] = useState(null);
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [mode, setMode] = useState('explore'); // explore | quiz
    const [quizState, setQuizState] = useState(null); // { questions, currentIdx, score, feedback }

    const filteredMembers = useMemo(() =>
        memberIds ? FAMILY_MEMBERS.filter(m => memberIds.includes(m.id) || m.relationType === 'self') : FAMILY_MEMBERS,
        [memberIds]
    );

    // Filter out "Self" from selectable logic targets, but allow clicking to reset
    const handleMemberSelect = (member) => {
        if (member.relationType === 'self') {
            setSelectedMember(null);
            setRevealAnswer(false);
            return;
        }

        if (selectedMember && selectedMember.id === member.id) {
            setSelectedMember(null);
            setRevealAnswer(false);
            return;
        }

        setSelectedMember(member);
        setRevealAnswer(false);
    };

    const handleProfileChange = (key, value) => {
        updateUserProfile({ [key]: value });
        setRevealAnswer(false); // Reset to encourage re-checking logic
    };

    const pronounData = selectedMember ? calculatePronoun(userProfile, selectedMember) : null;

    // Quiz mode logic
    const shuffleArray = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    const startQuiz = () => {
        const quizMembers = filteredMembers.filter(m => m.relationType !== 'self');
        const questions = shuffleArray(quizMembers).slice(0, Math.min(8, quizMembers.length)).map(member => {
            const correct = calculatePronoun(userProfile, member);
            // Generate distractors from other members' pronouns
            const allPronouns = [...new Set(
                quizMembers.map(m => calculatePronoun(userProfile, m)?.targetPronoun).filter(Boolean)
            )];
            const distractors = allPronouns.filter(p => p !== correct.targetPronoun).slice(0, 3);
            const options = shuffleArray([correct.targetPronoun, ...distractors]);
            return { member, correct, options };
        });
        setQuizState({ questions, currentIdx: 0, score: 0, feedback: null });
        setMode('quiz');
    };

    const handleQuizAnswer = (answer) => {
        const q = quizState.questions[quizState.currentIdx];
        const isCorrect = answer === q.correct.targetPronoun;
        if (isCorrect) playSuccess(); else playError();
        setQuizState(prev => ({
            ...prev,
            score: isCorrect ? prev.score + 1 : prev.score,
            feedback: { isCorrect, correct: q.correct },
        }));
        setTimeout(() => {
            if (quizState.currentIdx < quizState.questions.length - 1) {
                setQuizState(prev => ({ ...prev, currentIdx: prev.currentIdx + 1, feedback: null }));
            } else {
                markComplete();
                setMode('quiz-done');
            }
        }, 1500);
    };

    return (
        <div className="practice-layout" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="practice-header">
                <h1 className="practice-header-title">
                    <Link to="/practice" style={{ color: 'var(--text-main)', display: 'flex' }}>
                        <ArrowLeft size={24} />
                    </Link>
                    {title}
                </h1>
            </div>

            {/* Quiz Done */}
            {mode === 'quiz-done' && quizState && (
                <div className="practice-content-centered" style={{ padding: '48px 24px' }}>
                    <Trophy size={80} style={{ color: 'var(--primary-color)', marginBottom: '24px' }} />
                    <h2 className="practice-title">Quiz Complete!</h2>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)', margin: '16px 0' }}>
                        {quizState.score} / {quizState.questions.length}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                        <SoundButton className="practice-action-btn" sound="button" style={{ background: 'var(--surface-color)', border: '2px solid var(--border-color)', color: 'var(--text-main)', boxShadow: '0 4px 0 var(--border-color)' }} onClick={startQuiz}>
                            Try Again
                        </SoundButton>
                        <SoundButton className="practice-action-btn primary" onClick={goNext}>
                            Next
                        </SoundButton>
                    </div>
                </div>
            )}

            {/* Quiz Playing */}
            {mode === 'quiz' && quizState && quizState.questions[quizState.currentIdx] && (
                <div style={{ padding: '24px', maxWidth: 500, margin: '0 auto' }}>
                    <div className="pitch-progress-bar" style={{ borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
                        <div className="pitch-progress-fill" style={{ width: `${(quizState.currentIdx / quizState.questions.length) * 100}%` }} />
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 8 }}>How do you address your...</p>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            {quizState.questions[quizState.currentIdx].member.label}?
                        </div>
                    </div>

                    {quizState.feedback && (
                        <div className="practice-feedback-bar" style={{ position: 'relative', marginBottom: 16, animation: 'slideUpResult 0.3s ease-out' }}>
                            <div className={`practice-feedback-msg ${quizState.feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                                <div className={`practice-icon-circle ${quizState.feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {quizState.feedback.isCorrect ? <CheckCircle size={24} /> : <XCircle size={24} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '1.1rem' }}>{quizState.feedback.isCorrect ? 'Correct!' : `It's "${quizState.feedback.correct.targetPronoun}"`}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{quizState.feedback.correct.explanation}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {!quizState.feedback && (
                        <div className="voc-quiz-options">
                            {quizState.questions[quizState.currentIdx].options.map((opt, i) => (
                                <button key={i} className="voc-quiz-option" onClick={() => handleQuizAnswer(opt)}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Explore Mode */}
            {mode === 'explore' && <>
            <p className="practice-subtitle" style={{ textAlign: 'center', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
                Vietnamese pronouns change based on who you are talking to. Select a family member to see how to address them.
            </p>

            <div className="pronouns-content">
                <div className="profile-config-panel">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-main)' }}><User size={18} /> Your Persona</h3>
                    <div className="config-row">
                        <label>Gender:</label>
                        <div className="toggle-group">
                            <button
                                className={userProfile.gender === 'male' ? 'active' : ''}
                                onClick={() => handleProfileChange('gender', 'male')}
                            >
                                Male
                            </button>
                            <button
                                className={userProfile.gender === 'female' ? 'active' : ''}
                                onClick={() => handleProfileChange('gender', 'female')}
                            >
                                Female
                            </button>
                        </div>
                    </div>
                    <div className="config-row">
                        <label>Age: {userProfile.age}</label>
                        <input
                            type="range"
                            min="5"
                            max="80"
                            value={userProfile.age}
                            onChange={(e) => handleProfileChange('age', parseInt(e.target.value))}
                        />
                    </div>
                    <div className="persona-summary">
                        You are a <strong>{userProfile.age}</strong> year old <strong>{userProfile.gender}</strong>.
                    </div>
                </div>

                <div className="tree-section" style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                    <FamilyTree
                        familyData={filteredMembers.map(m => ({
                            ...m,
                            age: m.relationType === 'self' ? userProfile.age : Math.max(1, userProfile.age + m.ageOffset) // Ensure no negative ages
                        }))}
                        onSelectMember={handleMemberSelect}
                        selectedMemberId={selectedMember?.id}
                    />
                </div>

                <div className="interaction-panel">
                    {selectedMember ? (
                        <div className="interaction-card">
                            <h3 style={{ textAlign: 'center', color: 'var(--text-main)', marginBottom: '16px' }}>Conversation Simulation</h3>
                            <div className="scenario-desc" style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.1rem' }}>
                                You are talking to your <strong style={{ color: 'var(--primary-color)' }}>{selectedMember.label}</strong>.
                            </div>

                            {!revealAnswer ? (
                                <SoundButton className="practice-action-btn primary" onClick={() => setRevealAnswer(true)}>
                                    How do we address each other?
                                </SoundButton>
                            ) : (
                                <div className="result-display" style={{ animation: 'slideUpResult 0.3s ease-out' }}>
                                    <div className="pronoun-equation">
                                        <div className="side">
                                            <span className="p-label">You call yourself</span>
                                            <span className="p-word">{pronounData.selfPronoun}</span>
                                        </div>
                                        <ArrowRight className="arrow" />
                                        <div className="side">
                                            <span className="p-label">You call them</span>
                                            <span className="p-word">{pronounData.targetPronoun}</span>
                                        </div>
                                    </div>
                                    <div className="explanation">
                                        <strong>Why?</strong> {pronounData.explanation}
                                    </div>
                                    <SoundButton className="practice-action-btn" sound="button" style={{ background: 'var(--surface-color)', border: '2px solid var(--border-color)', color: 'var(--text-main)', boxShadow: '0 4px 0 var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%' }} onClick={() => setRevealAnswer(false)}>
                                        <RefreshCcw size={18} /> Try Another
                                    </SoundButton>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="placeholder-card">
                            <p style={{ color: 'var(--text-muted)' }}>Select a family member from the tree above to start.</p>
                        </div>
                    )}
                </div>
            </div>

            {showQuiz && (
                <div className="practice-bottom-bar" style={{ justifyContent: 'center' }}>
                    <SoundButton className="practice-action-btn primary" onClick={startQuiz}>
                        Start Quiz
                    </SoundButton>
                </div>
            )}
            </>}
        </div>
    );
}
