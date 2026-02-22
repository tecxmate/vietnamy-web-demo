// Speak text via browser TTS, preferring Vietnamese voice
const speak = (text, lang = 'vi-VN') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.startsWith('vi'));
    if (viVoice) utter.voice = viVoice;
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
};

export default speak;
