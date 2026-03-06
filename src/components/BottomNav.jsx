import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Home, BookOpen, Search, Library, Users } from 'lucide-react';
import { useT } from '../lib/i18n';
import { playTap } from '../utils/sound';

const BottomNav = ({ activeTab, setActiveTab }) => {
    const t = useT();
    const tabs = [
        { id: 'home', icon: <Home size={24} />, label: t('nav_home') },
        { id: 'study', icon: <BookOpen size={24} />, label: t('nav_study') },
        { id: 'dictionary', icon: <Search size={24} />, label: t('nav_dictionary') },
        { id: 'library', icon: <Library size={24} />, label: t('nav_library') },
        { id: 'community', icon: <Users size={24} />, label: t('nav_community') },
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
                                onClick={() => { playTap(); setActiveTab(tab.id); }}
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
                            onClick={() => { playTap(); setActiveTab(tab.id); }}
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
