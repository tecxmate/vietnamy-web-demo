import React, { useState, useMemo } from 'react';
import { ChevronLeft, Volume2, BookOpen, BookOpenText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ARTICLES, { ARTICLE_CATEGORIES, ARTICLE_LEVELS } from '../../data/articleData';
import { getGrammarItems } from '../../lib/grammarDB';
import speak from '../../utils/speak';
import './ReadingLibraryTab.css';

const LEVEL_COLORS = { beginner: '#06D6A0', intermediate: '#FFD166', advanced: '#EF476F' };
const GRAMMAR_LEVEL_COLORS = { A1: '#06D6A0', A2: '#118AB2', B1: '#EF476F' };
const GRAMMAR_LEVELS = ['A1', 'A2', 'B1'];

// ═══════════════════════════════════════════════════════════════
// Library Landing — two module cards
// ═══════════════════════════════════════════════════════════════
function LibraryLanding({ onSelectModule }) {
    const grammarItems = getGrammarItems();
    const grammarCount = grammarItems.length;
    const articleCount = ARTICLES.length;

    return (
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Grammar card */}
            <button
                onClick={() => onSelectModule('grammar')}
                style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    width: '100%', padding: '20px 16px', borderRadius: 16,
                    backgroundColor: 'var(--surface-color)',
                    border: '2px solid rgba(167,139,250,0.3)',
                    cursor: 'pointer', textAlign: 'left',
                }}
            >
                <div style={{
                    width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                    backgroundColor: 'rgba(167,139,250,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <BookOpenText size={28} color="#A78BFA" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-main)' }}>Grammar</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{grammarCount} patterns across {GRAMMAR_LEVELS.length} levels</div>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
            </button>

            {/* Readings card */}
            <button
                onClick={() => onSelectModule('readings')}
                style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    width: '100%', padding: '20px 16px', borderRadius: 16,
                    backgroundColor: 'var(--surface-color)',
                    border: '2px solid rgba(28,176,246,0.3)',
                    cursor: 'pointer', textAlign: 'left',
                }}
            >
                <div style={{
                    width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                    backgroundColor: 'rgba(28,176,246,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <BookOpen size={28} color="#1CB0F6" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-main)' }}>Readings</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{articleCount} articles with translations</div>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
            </button>
        </div>
    );
}


// ═══════════════════════════════════════════════════════════════
// Grammar Browse View (moved from GrammarTab)
// ═══════════════════════════════════════════════════════════════
function GrammarBrowseView({ onBack }) {
    const navigate = useNavigate();
    const allItems = getGrammarItems();
    const grouped = allItems.reduce((acc, item) => {
        acc[item.level] = acc[item.level] || [];
        acc[item.level].push(item);
        return acc;
    }, {});

    return (
        <div>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-main)' }}>
                    <ChevronLeft size={24} />
                </button>
                <h2 style={{ margin: 0, fontSize: 18 }}>Grammar</h2>
            </div>
            <div className="grammar-level-cards">
                {GRAMMAR_LEVELS.map(level => {
                    const items = grouped[level] || [];
                    const samples = items.slice(0, 3).map(i => i.title);
                    return (
                        <div
                            key={level}
                            className="grammar-level-card"
                            style={{ '--accent': GRAMMAR_LEVEL_COLORS[level] }}
                            onClick={() => navigate(`/grammar/${level}`)}
                        >
                            <div className="grammar-level-card-header">
                                <span className="grammar-level-badge" style={{ color: GRAMMAR_LEVEL_COLORS[level] }}>
                                    {level}
                                </span>
                                <span className="grammar-level-count">
                                    {items.length} patterns <ChevronRight size={14} />
                                </span>
                            </div>
                            <div className="grammar-level-samples">
                                {samples.map((s, i) => (
                                    <span key={i} className="grammar-level-sample">{s}</span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


// ═══════════════════════════════════════════════════════════════
// Article Browse View
// ═══════════════════════════════════════════════════════════════
function ArticleBrowseView({ onSelectArticle, onBack }) {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');

    const filtered = useMemo(() =>
        ARTICLES
            .filter(a => categoryFilter === 'all' || a.category === categoryFilter)
            .filter(a => levelFilter === 'all' || a.level === levelFilter),
        [categoryFilter, levelFilter]
    );

    return (
        <div className="rlib-container">
            <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-main)' }}>
                    <ChevronLeft size={24} />
                </button>
                <h2 style={{ margin: 0, fontSize: 18 }}>Readings</h2>
            </div>

            {/* Category pills */}
            <div className="rlib-pills-row">
                {ARTICLE_CATEGORIES.map(c => (
                    <button
                        key={c.key}
                        className={`rlib-pill ${categoryFilter === c.key ? 'active' : ''}`}
                        onClick={() => setCategoryFilter(c.key)}
                    >
                        {c.emoji} {c.label}
                    </button>
                ))}
            </div>

            {/* Level pills */}
            <div className="rlib-pills-row">
                {ARTICLE_LEVELS.map(l => (
                    <button
                        key={l.key}
                        className={`rlib-pill secondary ${levelFilter === l.key ? 'active' : ''}`}
                        onClick={() => setLevelFilter(l.key)}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {/* Article cards */}
            {filtered.map(article => (
                <ArticleCard
                    key={article.id}
                    article={article}
                    onSelect={() => onSelectArticle(article)}
                />
            ))}

            {filtered.length === 0 && (
                <div className="rlib-empty">
                    <BookOpen size={40} />
                    <p>No articles match your filters.</p>
                </div>
            )}
        </div>
    );
}


// ═══════════════════════════════════════════════════════════════
// Article Card
// ═══════════════════════════════════════════════════════════════
function ArticleCard({ article, onSelect }) {
    return (
        <button className="rlib-article-card" onClick={onSelect}>
            <div className="rlib-article-img">
                <img src={article.image} alt={article.title_en} loading="lazy" />
            </div>
            <div className="rlib-article-body">
                <h3 className="rlib-article-title">{article.title_vi}</h3>
                <p className="rlib-article-subtitle">{article.title_en}</p>
                <span className="rlib-article-time">~{article.readingTimeMins} min</span>
            </div>
        </button>
    );
}


// ═══════════════════════════════════════════════════════════════
// Article Reader View (tap-to-reveal)
// ═══════════════════════════════════════════════════════════════
function ArticleReaderView({ article, onBack }) {
    const [revealedSet, setRevealedSet] = useState(new Set());
    const [translationLang, setTranslationLang] = useState('en');

    const toggleReveal = (idx) => {
        setRevealedSet(prev => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });
    };

    const handleSpeak = (text, e) => {
        e.stopPropagation();
        speak(text);
    };

    return (
        <div className="rlib-reader-container">
            {/* Simple back arrow */}
            <div className="rlib-reader-back-row">
                <button className="rlib-back-btn" onClick={onBack}>
                    <ChevronLeft size={20} />
                </button>
            </div>

            {/* Hero image */}
            <img className="rlib-reader-hero" src={article.image} alt={article.title_en} />

            {/* Title block with EN/ZH toggle */}
            <div className="rlib-reader-title-block">
                <div className="rlib-reader-title-row">
                    <h1 className="rlib-reader-title-vi">{article.title_vi}</h1>
                    <div className="rlib-lang-toggle">
                        <button
                            className={`rlib-lang-btn ${translationLang === 'en' ? 'active' : ''}`}
                            onClick={() => setTranslationLang('en')}
                        >EN</button>
                        <button
                            className={`rlib-lang-btn ${translationLang === 'zh' ? 'active' : ''}`}
                            onClick={() => setTranslationLang('zh')}
                        >ZH</button>
                    </div>
                </div>
                <p className="rlib-reader-title-en">
                    {translationLang === 'en' ? article.title_en : article.title_zh}
                </p>
            </div>

            {/* Sentence list */}
            <div className="rlib-sentence-list">
                {article.sentences.map((s, idx) => {
                    const isRevealed = revealedSet.has(idx);
                    return (
                        <div
                            key={idx}
                            className={`rlib-sentence-row ${isRevealed ? 'revealed' : ''}`}
                            onClick={() => toggleReveal(idx)}
                        >
                            <div className="rlib-sentence-vi-row">
                                <span className="rlib-sentence-vi">{s.vi}</span>
                                <button
                                    className="speak-btn"
                                    onClick={(e) => handleSpeak(s.vi, e)}
                                >
                                    <Volume2 size={18} />
                                </button>
                            </div>
                            {isRevealed && (
                                <div className="rlib-translation">
                                    {translationLang === 'en' ? s.en : s.zh}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


// ═══════════════════════════════════════════════════════════════
// Main Tab Component
// ═══════════════════════════════════════════════════════════════
export default function ReadingLibraryTab({ onSubtitleChange }) {
    const [view, setView] = useState('landing'); // 'landing' | 'grammar' | 'readings' | 'reader'
    const [activeArticle, setActiveArticle] = useState(null);

    const enterReader = (article) => {
        setActiveArticle(article);
        setView('reader');
        onSubtitleChange?.('Tap any sentence to reveal translation');
    };

    const goToLanding = () => {
        setView('landing');
        setActiveArticle(null);
        onSubtitleChange?.(null);
    };

    if (view === 'grammar') {
        return <GrammarBrowseView onBack={goToLanding} />;
    }

    if (view === 'reader' && activeArticle) {
        return <ArticleReaderView article={activeArticle} onBack={() => setView('readings')} />;
    }

    if (view === 'readings') {
        return <ArticleBrowseView onSelectArticle={enterReader} onBack={goToLanding} />;
    }

    return <LibraryLanding onSelectModule={(mod) => setView(mod === 'grammar' ? 'grammar' : 'readings')} />;
}
