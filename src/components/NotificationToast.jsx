import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Target, Trophy, HeartCrack, Calendar, CircleDollarSign, Bell, X, Trash2, BookOpen, Zap, Users } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import './NotificationToast.css';

// ─── Icon resolver (no emojis) ─────────────────────────────────────────────────
function NotifIcon({ icon, color, size = 18 }) {
    const props = { size, color, strokeWidth: 2.2 };
    switch (icon) {
        case 'flame': return <Flame {...props} />;
        case 'target': return <Target {...props} />;
        case 'trophy': return <Trophy {...props} />;
        case 'heart-crack': return <HeartCrack {...props} />;
        case 'calendar': return <Calendar {...props} />;
        case 'coin': return <CircleDollarSign {...props} />;
        case 'lesson': return <BookOpen {...props} />;
        case 'streak': return <Flame {...props} />;
        case 'achievement': return <Trophy {...props} />;
        case 'join': return <Users {...props} />;
        case 'test': return <Zap {...props} />;
        default: return <Bell {...props} />;
    }
}

// ─── Relative time ─────────────────────────────────────────────────────────────
function relTime(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'Just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

// ─── Single Toast ──────────────────────────────────────────────────────────────
function Toast({ notif, onDismiss }) {
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);

    const dismiss = useCallback(() => {
        setLeaving(true);
        setTimeout(() => onDismiss(notif._uid), 320);
    }, [notif._uid, onDismiss]);

    useEffect(() => {
        const t1 = setTimeout(() => setVisible(true), 20);
        const t2 = setTimeout(() => dismiss(), 5000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [dismiss]);

    return (
        <div
            className={`notif-toast notif-toast--${notif.type}${visible ? ' notif-toast--in' : ''}${leaving ? ' notif-toast--out' : ''}`}
            style={{ borderColor: notif.border, background: `linear-gradient(135deg, ${notif.accent}, transparent)` }}
        >
            <div className="notif-icon-blob" style={{ background: notif.accent, border: `1px solid ${notif.border}` }}>
                <NotifIcon icon={notif.icon} color={notif.color} size={17} />
            </div>

            <div className="notif-content">
                <div className="notif-title">{notif.title}</div>
                <div className="notif-text">{notif.body}</div>
            </div>

            <button className="notif-dismiss" onClick={dismiss} aria-label="Dismiss">
                <X size={11} />
            </button>

            <div className="notif-accent-bar" style={{ background: notif.color }} />
        </div>
    );
}

// ─── Live Toast Stack ──────────────────────────────────────────────────────────
export function NotificationToastStack() {
    const { liveQueue, dismissToast } = useNotifications();
    if (liveQueue.length === 0) return null;

    return (
        <div className="notif-stack" aria-live="polite">
            {liveQueue.map(notif => (
                <Toast key={notif._uid} notif={notif} onDismiss={dismissToast} />
            ))}
        </div>
    );
}

// ─── Notification Panel (history + friends) ────────────────────────────────────
export function NotificationPanel() {
    const { panelOpen, closePanel, history, clearHistory, friendActivity } = useNotifications();
    const [tab, setTab] = useState('notifications'); // 'notifications' | 'friends'

    if (!panelOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="notif-panel-backdrop" onClick={closePanel} />

            {/* Panel */}
            <div className={`notif-panel${panelOpen ? ' notif-panel--open' : ''}`}>
                {/* Header */}
                <div className="notif-panel-header">
                    <span className="notif-panel-title">Notifications</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {history.length > 0 && (
                            <button className="notif-panel-action-btn" onClick={clearHistory} title="Clear all">
                                <Trash2 size={15} />
                            </button>
                        )}
                        <button className="notif-panel-action-btn" onClick={closePanel}>
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="notif-panel-tabs">
                    <button
                        className={`notif-panel-tab${tab === 'notifications' ? ' active' : ''}`}
                        onClick={() => setTab('notifications')}
                    >
                        Activity
                    </button>
                    <button
                        className={`notif-panel-tab${tab === 'friends' ? ' active' : ''}`}
                        onClick={() => setTab('friends')}
                    >
                        Friends
                    </button>
                </div>

                {/* Body */}
                <div className="notif-panel-body">
                    {tab === 'notifications' ? (
                        history.length === 0 ? (
                            <div className="notif-panel-empty">
                                <Bell size={32} strokeWidth={1.5} />
                                <p>No notifications yet</p>
                                <span>Complete lessons to get started</span>
                            </div>
                        ) : (
                            history.map(n => (
                                <div key={n._uid} className="notif-panel-item">
                                    <div className="notif-panel-item-icon" style={{ background: n.accent, border: `1px solid ${n.border}` }}>
                                        <NotifIcon icon={n.icon} color={n.color} size={15} />
                                    </div>
                                    <div className="notif-panel-item-content">
                                        <div className="notif-panel-item-title">{n.title}</div>
                                        <div className="notif-panel-item-body">{n.body}</div>
                                        <div className="notif-panel-item-time">{relTime(n.timestamp)}</div>
                                    </div>
                                    <div className="notif-panel-item-accent" style={{ background: n.color }} />
                                </div>
                            ))
                        )
                    ) : (
                        friendActivity.length === 0 ? (
                            <div className="notif-panel-empty">
                                <Users size={32} strokeWidth={1.5} />
                                <p>No friends yet</p>
                                <span>Invite friends to see their activity here</span>
                            </div>
                        ) : (
                            friendActivity.map(f => (
                                <div key={f.id} className="notif-panel-item">
                                    <div className="notif-panel-item-avatar">
                                        {f.name.charAt(0)}
                                    </div>
                                    <div className="notif-panel-item-content">
                                        <div className="notif-panel-item-title">
                                            <span className="notif-friend-name">{f.name}</span>
                                        </div>
                                        <div className="notif-panel-item-body">{f.action}</div>
                                        <div className="notif-panel-item-time">{f.relativeTime}</div>
                                    </div>
                                    <div className="notif-panel-item-icon-sm">
                                        <NotifIcon icon={f.type} color="var(--text-muted)" size={13} />
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </>
    );
}

// Default export for backwards compat
export default NotificationToastStack;
