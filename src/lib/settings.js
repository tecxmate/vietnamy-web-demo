const SETTINGS_KEY = 'vnme_settings';

export function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        if (parsed.testMode === undefined) parsed.testMode = true;
        if (!parsed.ttsVoice && parsed.ttsAccent) parsed.ttsVoice = parsed.ttsAccent === 'south' ? 'azure-south' : 'azure-north';
        return parsed;
    } catch {
        return { testMode: true };
    }
}

export function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
