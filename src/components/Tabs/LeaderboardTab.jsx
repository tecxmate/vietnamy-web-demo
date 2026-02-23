import React from 'react';
import { Trophy } from 'lucide-react';

const LeaderboardTab = () => {
    return (
        <div style={{ padding: 'var(--spacing-4)', paddingBottom: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, backgroundColor: 'var(--surface-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Trophy size={40} color="var(--primary-color)" />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 24 }}>Coming Soon</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, maxWidth: 280 }}>
                Compete with friends and other learners. Leaderboards are on the way!
            </p>
        </div>
    );
};

export default LeaderboardTab;
