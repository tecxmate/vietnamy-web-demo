import VowelsPractice from './VowelsPractice';

// First group of gliding diphthongs (most common)
const GLIDING_GROUP_1 = [
    { diph: 'ai', approx: 'Like "I" or "eye" (long a)', example: 'tai', meaning: 'ear' },
    { diph: 'ay', approx: 'Like "I" but shorter (short ă)', example: 'tay', meaning: 'hand' },
    { diph: 'ao', approx: 'Like "now" or "how"', example: 'chào', meaning: 'hello' },
    { diph: 'au', approx: 'Like "owl" but much shorter', example: 'sau', meaning: 'after' },
    { diph: 'oi', approx: 'Like "oy" (as in "boy")', example: 'hỏi', meaning: 'ask' },
    { diph: 'ôi', approx: 'Like "oh-ee"', example: 'tôi', meaning: 'I / me' },
    { diph: 'ơi', approx: 'Like "uh-ee"', example: 'mới', meaning: 'new' },
    { diph: 'ui', approx: 'Like "oo-ee" (long u)', example: 'tui', meaning: 'me (slang)' },
];

export default function VowelsDiph2() {
    return (
        <VowelsPractice
            singleVowels={null}
            centeringDiphthongs={null}
            glidingDiphthongs={GLIDING_GROUP_1}
            triphthongs={null}
            title="Vowels: Gliding Diphthongs"
        />
    );
}
