import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Home, BookOpen, Search, Library, Dumbbell } from 'lucide-react';
import { useT } from '../lib/i18n';

const BottomNav = ({ activeTab, setActiveTab }) => {
    const t = useT();
    const tabs = [
        { id: 'home', icon: <Home size={24} />, label: t('nav_home') },
        { id: 'study', icon: <BookOpen size={24} />, label: t('nav_study') },
        { id: 'dictionary', icon: <Search size={24} />, label: t('nav_dictionary') },
        { id: 'practice', icon: <Dumbbell size={24} />, label: t('nav_practice') },
        { id: 'library', icon: <Library size={24} />, label: t('nav_library') },
    ];

    return (
        <>
            <nav className="bottom-nav">
                {tabs.map(tab => {
                    if (tab.id === 'dictionary') {
                        return (
                            <button
                                key={tab.id}
                                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        );
                    }
                    return (
                        <button
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}

            </nav>
        </>
    );
};

export default BottomNav;
