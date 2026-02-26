// Speak text via Google Translate TTS (server proxy), with browser fallback
let currentAudio = null;

const speak = (text, rate = 1, lang = 'vi') => {
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    if (!text || text.length > 200) return;

    const ttsLang = typeof rate === 'string' ? rate : lang;
    const playRate = typeof rate === 'number' ? rate : 1;

    const url = `/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(ttsLang)}`;
    const audio = new Audio(url);
    audio.playbackRate = playRate;
    currentAudio = audio;

    audio.play().catch(() => {
        // Fallback to browser TTS if server TTS fails
        currentAudio = null;
        if (!window.speechSynthesis) return;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = ttsLang === 'vi' ? 'vi-VN' : ttsLang;
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.lang.startsWith(ttsLang));
        if (match) utter.voice = match;
        utter.rate = playRate;
        window.speechSynthesis.speak(utter);
    });

    audio.addEventListener('ended', () => { currentAudio = null; });
    audio.addEventListener('error', () => { currentAudio = null; });
};

export default speak;
