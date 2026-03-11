import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Users, Hash, PenTool, Type, Keyboard, Layers, MessageCircle, Activity } from 'lucide-react';

const practiceModules = [
    // Tone Listen
    { id: 'tones-1', title: 'Tones: Level & Rising', icon: <Music size={24} className="practice-icon" />, level: 'Beginner', link: '/practice/tones-1' },
    { id: 'tones-2', title: 'Tones: + Falling', icon: <Music size={24} className="practice-icon" />, level: 'Beginner', link: '/practice/tones-2' },
    { id: 'tones-3', title: 'Tones: + Dipping', icon: <Music size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/tones-3' },
    { id: 'tones-4', title: 'Tones: All 6', icon: <Music size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/tones-4' },
    // Pitch Training
    { id: 'pitch-1', title: 'Pitch: Easy Tones', icon: <Activity size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/pitch-1' },
    { id: 'pitch-2', title: 'Pitch: Hard Tones', icon: <Activity size={24} className="practice-icon" />, level: 'Advanced', link: '/practice/pitch-2' },
    // Tone Marks
    { id: 'tonemarks-basic', title: 'Tone Marks: Basics', icon: <PenTool size={24} className="practice-icon" />, level: 'Beginner', link: '/practice/tonemarks-basic' },
    { id: 'tonemarks-special', title: 'Tone Marks: Special', icon: <PenTool size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/tonemarks-special' },
    { id: 'tonemarks-master', title: 'Tone Marks: Master', icon: <PenTool size={24} className="practice-icon" />, level: 'Advanced', link: '/practice/tonemarks-master' },
    // Vowels
    { id: 'vowels-single-1', title: 'Vowels: Basics', icon: <Type size={24} className="practice-icon" />, level: 'Beginner', link: '/practice/vowels-single-1' },
    { id: 'vowels-single-2', title: 'Vowels: Special', icon: <Type size={24} className="practice-icon" />, level: 'Beginner', link: '/practice/vowels-single-2' },
    { id: 'vowels-diph-1', title: 'Vowels: Centering', icon: <Type size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/vowels-diph-1' },
    { id: 'vowels-diph-2', title: 'Vowels: Gliding', icon: <Type size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/vowels-diph-2' },
    { id: 'vowels-diph-3', title: 'Vowels: Advanced', icon: <Type size={24} className="practice-icon" />, level: 'Advanced', link: '/practice/vowels-diph-3' },
    // Numbers
    { id: 'numbers-1', title: 'Numbers: 0-10', icon: <Hash size={24} className="practice-icon" />, level: 'Beginner', link: '/practice/numbers-1' },
    { id: 'numbers-2', title: 'Numbers: Compounds', icon: <Hash size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/numbers-2' },
    { id: 'numbers-3', title: 'Numbers: Challenge', icon: <Hash size={24} className="practice-icon" />, level: 'Advanced', link: '/practice/numbers-3' },
    // Other
    // Pronouns
    { id: 'pronouns-1', title: 'Pronouns: Core', icon: <Users size={24} className="practice-icon" />, level: 'Beginner', link: '/practice/pronouns-1' },
    { id: 'pronouns-2', title: 'Pronouns: Extended', icon: <Users size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/pronouns-2' },
    // TELEX
    { id: 'telex-1', title: 'TELEX: Tone Keys', icon: <Keyboard size={24} className="practice-icon" />, level: 'Beginner', link: '/practice/telex-1' },
    { id: 'telex-2', title: 'TELEX: Vowel Mods', icon: <Keyboard size={24} className="practice-icon" />, level: 'Beginner', link: '/practice/telex-2' },
    { id: 'telex-3', title: 'TELEX: Full Challenge', icon: <Keyboard size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/telex-3' },
    // Teen Code
    { id: 'teencode-1', title: 'Teen Code: Basics', icon: <MessageCircle size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/teencode-1' },
    { id: 'teencode-2', title: 'Teen Code: People', icon: <MessageCircle size={24} className="practice-icon" />, level: 'Intermediate', link: '/practice/teencode-2' },
    { id: 'teencode-3', title: 'Teen Code: Life', icon: <MessageCircle size={24} className="practice-icon" />, level: 'Advanced', link: '/practice/teencode-3' },
];

const PracticeTab = () => {
    return (
        <div style={{ padding: 'var(--spacing-4)', paddingBottom: '100px' }}>
            <div className="practice-grid">
                {practiceModules.map((mod, idx) => (
                    <Link
                        key={idx}
                        to={mod.link}
                        className="practice-card"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {mod.icon}
                        <h3 style={{ fontSize: 16, margin: 0, marginTop: 12 }}>{mod.title}</h3>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{mod.level}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PracticeTab;
