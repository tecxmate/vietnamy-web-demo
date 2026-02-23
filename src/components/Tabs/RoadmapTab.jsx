import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Check, Lock, BookOpen } from 'lucide-react';
import { getUnits, getNodesForUnitWithProgress } from '../../lib/db';
import { getDueItems } from '../../lib/srs';
import { useDong } from '../../context/DongContext';

const RoadmapTab = () => {
    const navigate = useNavigate();
    const { completedNodes } = useDong();
    const [units, setUnits] = useState([]);
    const [nodesMap, setNodesMap] = useState({});
    const [dueCount, setDueCount] = useState(0);

    useEffect(() => {
        const fetchedUnits = getUnits();
        setUnits(fetchedUnits);

        const map = {};
        fetchedUnits.forEach(unit => {
            map[unit.id] = getNodesForUnitWithProgress(unit.id, completedNodes);
        });
        setNodesMap(map);
        setDueCount(getDueItems().length);
    }, [completedNodes]);

    const getOffset = (index) => {
        const cycle = index % 4;
        switch (cycle) {
            case 0: return 0;
            case 1: return -40;
            case 2: return -60;
            case 3: return -40;
            default: return 0;
        }
    };

    const handleNodeClick = (node) => {
        if (node.status === 'active') {
            navigate(`/lesson/${node.content_ref_id}`);
        }
    };

    const handleContinueClick = () => {
        for (const unit of units) {
            const nodes = nodesMap[unit.id] || [];
            const activeNode = nodes.find(n => n.status === 'active');
            if (activeNode) {
                navigate(`/lesson/${activeNode.content_ref_id}`);
                return;
            }
        }
    };

    return (
        <div>
            {dueCount > 0 && (
                <button
                    onClick={() => navigate('/practice/vocab')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        width: 'calc(100% - 32px)', margin: '16px auto',
                        padding: '12px 16px', borderRadius: 12,
                        backgroundColor: 'rgba(28, 176, 246, 0.1)',
                        border: '1px solid rgba(28, 176, 246, 0.3)',
                        color: '#1CB0F6', fontWeight: 700, fontSize: 14,
                        cursor: 'pointer',
                    }}
                >
                    <BookOpen size={20} />
                    <span>{dueCount} word{dueCount > 1 ? 's' : ''} to review</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>Tap to review</span>
                </button>
            )}
            {units.map((unit) => (
                <div key={unit.id} style={{ marginBottom: 64 }}>
                    <div style={{ backgroundColor: 'var(--surface-color)', padding: 'var(--spacing-4)', position: 'sticky', top: 0, zIndex: 5, borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ margin: 0, fontSize: 18 }}>Unit {unit.order_index}: {unit.title}</h2>
                    </div>

                    <div className="path-container relative">
                        {(nodesMap[unit.id] || []).map((node, index) => {
                            const isFirstNodeInUnit = node.label !== '' && node.type === 'lesson';
                            return (
                                <React.Fragment key={node.id}>
                                    {isFirstNodeInUnit && index !== 0 && (
                                        <div style={{ width: '100%', height: 1, backgroundColor: 'var(--border-color)', margin: '32px 0' }} />
                                    )}

                                    <div
                                        className={`path-node ${node.status}`}
                                        style={{ transform: `translateX(${getOffset(index)}px)` }}
                                        onClick={() => handleNodeClick(node)}
                                    >
                                        {node.status === 'completed' && <Check size={32} strokeWidth={3} />}
                                        {node.status === 'locked' && node.type === 'checkpoint' && <Star size={32} color="var(--text-muted)" />}
                                        {node.status === 'locked' && node.type !== 'checkpoint' && <Lock size={24} />}
                                        {node.status === 'active' && <Star size={32} color="#1A1A1A" fill="#1A1A1A" />}

                                        {node.status === 'active' && (
                                            <div style={{
                                                position: 'absolute',
                                                top: -38,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                whiteSpace: 'nowrap',
                                                backgroundColor: 'white',
                                                color: 'var(--primary-color)',
                                                padding: '6px 16px',
                                                borderRadius: 12,
                                                fontSize: 16,
                                                fontWeight: 800,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 4px 0 #E0E0E0',
                                                animation: 'bounce 2s infinite',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                zIndex: 10
                                            }}>
                                                START
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: -8,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    width: 0,
                                                    height: 0,
                                                    borderLeft: '8px solid transparent',
                                                    borderRight: '8px solid transparent',
                                                    borderTop: '8px solid white'
                                                }} />
                                            </div>
                                        )}
                                    </div>

                                    {node.label && node.type !== 'lesson' && (
                                        <div style={{ transform: `translateX(${getOffset(index)}px)`, marginTop: -8, marginBottom: 16, fontSize: 14, fontWeight: 700, color: 'var(--text-muted)' }}>
                                            {node.label}
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            ))}

            <div style={{
                position: 'fixed',
                bottom: 110,
                left: 24,
                right: 24,
                zIndex: 100,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <button
                    className="primary w-full shadow-lg"
                    style={{
                        maxWidth: 400,
                        fontSize: 18,
                        padding: '18px 24px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        borderRadius: 16,
                        boxShadow: '0 8px 0 #DCAE45, 0 8px 20px rgba(0,0,0,0.2)'
                    }}
                    onClick={handleContinueClick}
                >
                    CONTINUE
                </button>
            </div>

            <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
        </div>
    );
};

export default RoadmapTab;
