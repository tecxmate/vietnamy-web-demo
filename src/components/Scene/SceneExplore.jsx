import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import speak from '../../utils/speak';

const SceneExplore = ({ config, scene, onComplete, isComplete }) => {
    const [tappedItems, setTappedItems] = useState(new Set());
    const [activePopup, setActivePopup] = useState(null);
    const [showGrammar, setShowGrammar] = useState(false);

    const minTaps = config.min_taps || 3;
    const hotspots = config.hotspots || [];

    useEffect(() => {
        if (tappedItems.size >= minTaps && !isComplete) {
            onComplete();
        }
    }, [tappedItems.size, minTaps, isComplete]);

    const handleTap = (hotspot) => {
        setActivePopup(activePopup?.id === hotspot.id ? null : hotspot);
        setTappedItems(prev => new Set([...prev, hotspot.id]));
        speak(hotspot.label);
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            {/* Scene header */}
            <div style={{ padding: '16px 20px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--primary-color)', marginBottom: 4 }}>
                    {scene.setting?.background_emoji} {scene.title}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {config.instruction}
                </p>
            </div>

            {/* Grammar card */}
            {config.show_grammar_card && scene.grammar_card && (
                <div style={{ margin: '8px 20px', padding: 0 }}>
                    <button
                        onClick={() => setShowGrammar(!showGrammar)}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 14px', borderRadius: 'var(--radius-md)',
                            backgroundColor: 'rgba(255, 183, 3, 0.08)', border: '1px solid rgba(255, 183, 3, 0.2)',
                            color: 'var(--primary-color)', fontSize: 13, fontWeight: 700,
                            cursor: 'pointer', justifyContent: 'space-between'
                        }}
                    >
                        <span><Eye size={14} style={{ marginRight: 6, verticalAlign: -2 }} />{scene.grammar_card.title}</span>
                        <span style={{ fontSize: 11, opacity: 0.7 }}>{showGrammar ? 'HIDE' : 'VIEW'}</span>
                    </button>
                    {showGrammar && (
                        <div style={{
                            marginTop: 6, padding: '12px 14px', borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)',
                            fontSize: 14, lineHeight: 1.6
                        }}>
                            <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: 'var(--primary-color)', marginBottom: 8 }}>
                                {scene.grammar_card.structure}
                            </div>
                            <div style={{ color: 'var(--text-main)', marginBottom: 4 }}>
                                "{scene.grammar_card.example}"
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                                {scene.grammar_card.translation}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Progress indicator */}
            <div style={{ padding: '4px 20px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, backgroundColor: 'var(--surface-color-light)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                        width: `${Math.min(100, (tappedItems.size / minTaps) * 100)}%`,
                        height: '100%', backgroundColor: 'var(--success-color)',
                        borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease'
                    }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, minWidth: 40, textAlign: 'right' }}>
                    {tappedItems.size}/{minTaps}
                </span>
            </div>

            {/* Menu / Hotspot grid */}
            <div style={{ flex: 1, padding: '0 16px 16px', overflow: 'auto' }}>
                <div style={{
                    backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)',
                    border: '2px solid var(--border-color)', overflow: 'hidden'
                }}>
                    {/* Menu header */}
                    <div style={{
                        padding: '14px 16px', textAlign: 'center',
                        borderBottom: '1px solid var(--border-color)',
                        background: 'linear-gradient(180deg, rgba(255,183,3,0.08) 0%, transparent 100%)'
                    }}>
                        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)' }}>
                            THỰC ĐƠN
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>MENU</div>
                    </div>

                    {/* Grid of items */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                        {hotspots.map((hs, idx) => {
                            const isTapped = tappedItems.has(hs.id);
                            const isActive = activePopup?.id === hs.id;
                            return (
                                <button
                                    key={hs.id}
                                    onClick={() => handleTap(hs)}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        padding: isActive ? '14px 10px' : '20px 12px', gap: isActive ? 4 : 8, cursor: 'pointer',
                                        backgroundColor: isActive ? 'rgba(255,183,3,0.1)' : 'transparent',
                                        border: 'none', borderRight: idx % 2 === 0 ? '1px solid var(--border-color)' : 'none',
                                        borderBottom: idx < hotspots.length - 2 ? '1px solid var(--border-color)' : 'none',
                                        transition: 'all 0.15s ease', position: 'relative',
                                        color: 'var(--text-main)'
                                    }}
                                >
                                    <span style={{ fontSize: isActive ? 28 : 36, transition: 'font-size 0.15s ease' }}>{hs.emoji}</span>
                                    <span style={{
                                        fontSize: 15, fontWeight: 700,
                                        color: isActive ? 'var(--primary-color)' : isTapped ? 'var(--primary-color)' : 'var(--text-main)'
                                    }}>
                                        {hs.label}
                                    </span>
                                    {/* Expanded info when active */}
                                    {isActive ? (
                                        <>
                                            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                                                {hs.translation}
                                            </span>
                                            {hs.pronunciation_note && (
                                                <span style={{ fontSize: 11, color: 'var(--secondary-color)', fontStyle: 'italic' }}>
                                                    /{hs.pronunciation_note}/
                                                </span>
                                            )}
                                            {hs.price && (
                                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hs.price}</span>
                                            )}
                                        </>
                                    ) : (
                                        hs.price && (
                                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hs.price}</span>
                                        )
                                    )}
                                    {isTapped && !isActive && (
                                        <div style={{
                                            position: 'absolute', top: 8, right: 8,
                                            width: 18, height: 18, borderRadius: 'var(--radius-full)',
                                            backgroundColor: 'var(--success-color)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 11, color: 'white', fontWeight: 800
                                        }}>✓</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SceneExplore;
