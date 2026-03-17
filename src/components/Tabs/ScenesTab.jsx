import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ChevronRight, Sparkles, Lock, Check, Theater } from 'lucide-react';
import { getDB } from '../../lib/db';
import { useDong } from '../../context/DongContext';
import speak from '../../utils/speak';

const DIFFICULTY = {
    beginner:     { label: 'Beginner',     color: '#58CC02', dark: '#46A302' },
    elementary:   { label: 'Elementary',    color: '#1CB0F6', dark: '#0D8ECF' },
    intermediate: { label: 'Intermediate',  color: '#CE82FF', dark: '#7C3AED' },
    advanced:     { label: 'Advanced',      color: '#FF4B4B', dark: '#B91C1C' },
};

const ScenesTab = () => {
    const navigate = useNavigate();
    const { completedNodes } = useDong();
    const [expandedLocation, setExpandedLocation] = useState(null);

    const { locations, scenes } = useMemo(() => {
        const db = getDB();
        return {
            locations: db.scene_locations || [],
            scenes: db.scenes || [],
        };
    }, []);

    const getLocationScenes = (locationId) => {
        return scenes.filter(s => s.location_id === locationId);
    };

    const isSceneCompleted = (sceneId) => {
        const db = getDB();
        const allNodes = (db.path_nodes || []).flatMap(phase => phase.nodes || []);
        const sceneNode = allNodes.find(n => n.scene_id === sceneId);
        return sceneNode ? completedNodes.has(sceneNode.id) : false;
    };

    const getLocationProgress = (locationId) => {
        const locScenes = getLocationScenes(locationId);
        if (locScenes.length === 0) return 0;
        const completed = locScenes.filter(s => isSceneCompleted(s.id)).length;
        return completed / locScenes.length;
    };

    const handleSceneTap = (scene) => {
        speak(scene.title_vi || '');
        navigate(`/scene/${scene.id}`);
    };

    const toggleLocation = (locId) => {
        setExpandedLocation(expandedLocation === locId ? null : locId);
    };

    return (
        <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            backgroundColor: 'var(--bg-color)', overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{ padding: '20px 20px 12px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Sparkles size={20} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                            Scenes
                        </h1>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                            Learn Vietnamese through real-life scenarios
                        </p>
                    </div>
                </div>
            </div>

            {/* Scrollable locations list */}
            <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 24px' }}>
                {locations.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '48px 24px',
                        color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
                        <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-main)', marginBottom: 8 }}>
                            Coming soon!
                        </div>
                        Explore Vietnamese neighborhoods and practice ordering, shopping, and chatting with locals.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {locations.map((loc) => {
                            const locScenes = getLocationScenes(loc.id);
                            const progress = getLocationProgress(loc.id);
                            const isExpanded = expandedLocation === loc.id;
                            const completedCount = locScenes.filter(s => isSceneCompleted(s.id)).length;

                            return (
                                <div key={loc.id} style={{
                                    borderRadius: 'var(--radius-lg)',
                                    backgroundColor: 'var(--surface-color)',
                                    border: '2px solid var(--border-color)',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease',
                                }}>
                                    {/* Location header */}
                                    <button
                                        onClick={() => toggleLocation(loc.id)}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                                            padding: '16px', cursor: 'pointer',
                                            border: 'none', backgroundColor: 'transparent',
                                            color: 'var(--text-main)', textAlign: 'left'
                                        }}
                                    >
                                        <div style={{
                                            width: 56, height: 56, borderRadius: 'var(--radius-md)',
                                            background: loc.gradient || 'linear-gradient(135deg, #1a1208 0%, #2d1f0e 100%)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 28, flexShrink: 0,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                        }}>
                                            {loc.emoji}
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                                <span style={{ fontSize: 16, fontWeight: 800 }}>{loc.name}</span>
                                                {loc.locked && <Lock size={14} color="var(--text-muted)" />}
                                            </div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                                                <MapPin size={11} style={{ verticalAlign: -1, marginRight: 3 }} />
                                                {loc.name_vi}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{
                                                    flex: 1, height: 4, backgroundColor: 'var(--surface-color-light)',
                                                    borderRadius: 'var(--radius-full)', overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${progress * 100}%`, height: '100%',
                                                        backgroundColor: progress === 1 ? 'var(--success-color)' : 'var(--primary-color)',
                                                        borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease'
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                    {completedCount}/{locScenes.length}
                                                </span>
                                            </div>
                                        </div>

                                        <ChevronRight
                                            size={18}
                                            color="var(--text-muted)"
                                            style={{
                                                flexShrink: 0,
                                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s ease'
                                            }}
                                        />
                                    </button>

                                    {/* Expanded scene cards — 3D roadmap style */}
                                    {isExpanded && (
                                        <div style={{
                                            padding: '0 12px 14px',
                                            display: 'flex', flexDirection: 'column', gap: 10
                                        }}>
                                            {locScenes.map((scene) => {
                                                const completed = isSceneCompleted(scene.id);
                                                const diff = DIFFICULTY[scene.difficulty] || DIFFICULTY.beginner;
                                                const nodeColor = diff.color;
                                                const nodeDark = diff.dark;
                                                const nodeBg = nodeColor + '1F'; // ~12% opacity

                                                return (
                                                    <div
                                                        key={scene.id}
                                                        onClick={() => handleSceneTap(scene)}
                                                        style={{
                                                            display: 'flex', alignItems: 'stretch',
                                                            width: '100%',
                                                            borderRadius: 16,
                                                            border: `2px solid ${nodeColor}`,
                                                            boxShadow: completed
                                                                ? `0 3px 0 ${nodeDark}`
                                                                : `0 4px 0 ${nodeDark}`,
                                                            overflow: 'hidden',
                                                            cursor: 'pointer',
                                                            transition: 'transform 0.1s',
                                                        }}
                                                    >
                                                        {/* Main card content */}
                                                        <div style={{
                                                            flex: 1, minWidth: 0,
                                                            display: 'flex', flexDirection: 'column',
                                                            backgroundColor: nodeBg,
                                                        }}>
                                                            <div style={{
                                                                display: 'flex', alignItems: 'center', gap: 14,
                                                                padding: '12px 16px'
                                                            }}>
                                                                {/* Circle icon — matches roadmap style */}
                                                                <div style={{
                                                                    width: 44, height: 44, borderRadius: '50%',
                                                                    flexShrink: 0,
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    backgroundColor: nodeColor,
                                                                    color: '#fff',
                                                                }}>
                                                                    {completed
                                                                        ? <Check size={22} strokeWidth={3} />
                                                                        : <Theater size={22} fill="#fff" />
                                                                    }
                                                                </div>

                                                                {/* Labels */}
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div style={{
                                                                        fontWeight: 700, fontSize: 15,
                                                                        color: 'var(--text-main)',
                                                                        whiteSpace: 'nowrap', overflow: 'hidden',
                                                                        textOverflow: 'ellipsis'
                                                                    }}>
                                                                        {scene.setting?.background_emoji || '🎭'} {scene.title}
                                                                    </div>
                                                                    <div style={{
                                                                        fontSize: 12, color: nodeColor,
                                                                        fontWeight: 600, marginTop: 2,
                                                                        display: 'flex', alignItems: 'center', gap: 6
                                                                    }}>
                                                                        <span>{diff.label}</span>
                                                                        {scene.characters && (
                                                                            <span style={{ fontSize: 13 }}>
                                                                                {scene.characters
                                                                                    .filter(c => c.id !== 'player')
                                                                                    .map(c => c.emoji)
                                                                                    .join(' ')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Right side action hint */}
                                                                {completed ? (
                                                                    <div style={{
                                                                        width: 28, height: 28, borderRadius: '50%',
                                                                        backgroundColor: nodeColor,
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        flexShrink: 0
                                                                    }}>
                                                                        <Star size={14} color="white" fill="white" />
                                                                    </div>
                                                                ) : (
                                                                    <div style={{
                                                                        fontSize: 12, fontWeight: 800, color: nodeColor,
                                                                        textTransform: 'uppercase', letterSpacing: '0.5px',
                                                                        flexShrink: 0
                                                                    }}>
                                                                        START
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScenesTab;
