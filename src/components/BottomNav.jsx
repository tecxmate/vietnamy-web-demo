import React from 'react';
import { Home, BookOpen, Search, Library, Users } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'home', icon: <Home size={24} />, label: 'Home' },
        { id: 'study', icon: <BookOpen size={24} />, label: 'Study' },
        { id: 'dictionary', icon: <Search size={24} />, label: 'Dictionary' },
        { id: 'library', icon: <Library size={24} />, label: 'Library' },
        { id: 'community', icon: <Users size={24} />, label: 'Community' },
    ];

    return (
        <nav className="bottom-nav">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
