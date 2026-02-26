import { useCallback } from 'react';
import speakUtil from '../utils/speak';

export function useTTS() {
    const speak = useCallback((text, rate = 1.0) => {
        speakUtil(text, rate);
    }, []);

    return { speak };
}
