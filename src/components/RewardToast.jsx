import React from 'react';
import { useDong } from '../context/DongContext';
import { Zap } from 'lucide-react';

const RewardToast = () => {
    const { rewardEvent, dailyBonusEvent } = useDong();

    if (!rewardEvent && !dailyBonusEvent) return null;

    return (
        <>
            {dailyBonusEvent && (
                <div style={{
                    position: 'fixed',
                    top: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    backgroundColor: '#1CB0F6',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: 16,
                    fontWeight: 700,
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    animation: 'slideDown 0.3s ease-out',
                }}>
                    <Zap size={20} fill="white" />
                    Day {dailyBonusEvent.streak} streak! +{dailyBonusEvent.amount}₫
                </div>
            )}

            {rewardEvent && (
                <div style={{
                    position: 'fixed',
                    top: dailyBonusEvent ? 64 : 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    backgroundColor: '#FFD166',
                    color: '#1A1A1A',
                    padding: '10px 20px',
                    borderRadius: 16,
                    fontWeight: 700,
                    fontSize: 16,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    animation: 'slideDown 0.3s ease-out',
                }}>
                    +{rewardEvent.amount}₫ earned!
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>
        </>
    );
};

export default RewardToast;
