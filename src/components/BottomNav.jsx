import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Home, BookOpen, Search, Library, Users, Camera, Image, Mic, X, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

const BottomNav = ({ activeTab, setActiveTab, dictMode, onDictInput }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [listening, setListening] = useState(false);
    const longPressTimer = useRef(null);
    const didLongPress = useRef(false);
    const cameraInputRef = useRef(null);
    const uploadInputRef = useRef(null);
    const recognitionRef = useRef(null);

    const tabs = [
        { id: 'home', icon: <Home size={24} />, label: 'Home' },
        { id: 'study', icon: <BookOpen size={24} />, label: 'Study' },
        { id: 'dictionary', icon: <Search size={24} />, label: 'Dictionary' },
        { id: 'library', icon: <Library size={24} />, label: 'Library' },
        { id: 'community', icon: <Users size={24} />, label: 'Community' },
    ];

    // Close menu on outside click
    useEffect(() => {
        if (!showMenu) return;
        const close = () => setShowMenu(false);
        const timer = setTimeout(() => document.addEventListener('click', close), 10);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', close);
        };
    }, [showMenu]);

    // Long-press handlers for dictionary icon
    const handlePressStart = useCallback((e) => {
        didLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            didLongPress.current = true;
            setShowMenu(true);
            // Vibrate if available
            if (navigator.vibrate) navigator.vibrate(30);
        }, 500);
    }, []);

    const handlePressEnd = useCallback(() => {
        clearTimeout(longPressTimer.current);
        if (!didLongPress.current) {
            setActiveTab('dictionary');
        }
    }, [setActiveTab]);

    const handlePressMove = useCallback(() => {
        clearTimeout(longPressTimer.current);
    }, []);

    // OCR language based on dict mode
    const getOcrLang = () => {
        if (dictMode === 'zh-s') return 'chi_sim';
        if (dictMode === 'zh-t') return 'chi_tra';
        return 'vie';
    };

    const handleOcrFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        setShowMenu(false);
        setOcrLoading(true);
        setOcrProgress(0);
        try {
            const { data } = await Tesseract.recognize(file, getOcrLang(), {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setOcrProgress(Math.round(m.progress * 100));
                    }
                },
            });
            const text = data.text.trim().replace(/\s+/g, ' ');
            if (text) {
                onDictInput(text);
            }
        } catch (err) {
            console.error('OCR failed:', err);
        } finally {
            setOcrLoading(false);
        }
    };

    // Voice recognition
    const handleVoice = () => {
        setShowMenu(false);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        if (dictMode === 'zh-s') recognition.lang = 'zh-CN';
        else if (dictMode === 'zh-t') recognition.lang = 'zh-TW';
        else recognition.lang = 'vi-VN';

        recognitionRef.current = recognition;
        setListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setListening(false);
            if (transcript.trim()) {
                onDictInput(transcript.trim());
            }
        };
        recognition.onerror = () => setListening(false);
        recognition.onend = () => setListening(false);
        recognition.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setListening(false);
    };

    return (
        <>
            <nav className="bottom-nav">
                {tabs.map(tab => {
                    if (tab.id === 'dictionary') {
                        return (
                            <button
                                key={tab.id}
                                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onTouchStart={handlePressStart}
                                onTouchEnd={handlePressEnd}
                                onTouchMove={handlePressMove}
                                onMouseDown={handlePressStart}
                                onMouseUp={handlePressEnd}
                                onMouseLeave={() => clearTimeout(longPressTimer.current)}
                                onClick={(e) => e.preventDefault()}
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

                {/* Long-press popup menu */}
                {showMenu && (
                    <div className="dict-popup-menu" onClick={(e) => e.stopPropagation()}>
                        <button className="dict-popup-item" onClick={() => cameraInputRef.current?.click()}>
                            <Camera size={20} />
                            <span>Camera</span>
                        </button>
                        <button className="dict-popup-item" onClick={() => uploadInputRef.current?.click()}>
                            <Image size={20} />
                            <span>Upload Image</span>
                        </button>
                        <button className="dict-popup-item" onClick={handleVoice}>
                            <Mic size={20} />
                            <span>Voice</span>
                        </button>
                    </div>
                )}

                {/* Hidden file inputs */}
                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleOcrFile}
                    style={{ display: 'none' }}
                />
                <input
                    ref={uploadInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleOcrFile}
                    style={{ display: 'none' }}
                />
            </nav>

            {/* OCR Loading Overlay */}
            {ocrLoading && (
                <div className="ocr-overlay">
                    <div className="ocr-overlay-card">
                        <Loader2 size={32} className="loading-icon" />
                        <span className="ocr-overlay-text">Recognizing text… {ocrProgress}%</span>
                        <div className="ocr-progress-bar">
                            <div className="ocr-progress-fill" style={{ width: `${ocrProgress}%` }} />
                        </div>
                        <button className="ocr-cancel-btn" onClick={() => setOcrLoading(false)}>
                            <X size={16} /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Voice Listening Overlay */}
            {listening && (
                <div className="ocr-overlay" onClick={stopListening}>
                    <div className="ocr-overlay-card" onClick={(e) => e.stopPropagation()}>
                        <div className="voice-pulse-ring">
                            <Mic size={32} color="var(--primary-color)" />
                        </div>
                        <span className="ocr-overlay-text">Listening…</span>
                        <button className="ocr-cancel-btn" onClick={stopListening}>
                            <X size={16} /> Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default BottomNav;
