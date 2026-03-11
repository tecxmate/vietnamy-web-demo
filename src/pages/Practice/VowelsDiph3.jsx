import VowelsPractice from './VowelsPractice';

// Remaining gliding diphthongs + all triphthongs
const GLIDING_GROUP_2 = [
    { diph: 'âu', approx: 'Like "oh" (as in "go")', example: 'câu', meaning: 'sentence' },
    { diph: 'ây', approx: 'Like "ay" (as in "day")', example: 'mấy', meaning: 'how many' },
    { diph: 'eo', approx: 'Like "eh-ao" (meow)', example: 'mèo', meaning: 'cat' },
    { diph: 'êu', approx: 'Like "ay-oo"', example: 'kêu', meaning: 'call' },
    { diph: 'uy', approx: 'Like "we" in English', example: 'tuy', meaning: 'although' },
    { diph: 'iu', approx: 'Like "ew" (as in "few")', example: 'chịu', meaning: 'tolerate' },
    { diph: 'ưu', approx: 'Like ư gliding into u', example: 'hưu', meaning: 'retired' },
];

export default function VowelsDiph3() {
    return (
        <VowelsPractice
            singleVowels={null}
            centeringDiphthongs={null}
            glidingDiphthongs={GLIDING_GROUP_2}
            title="Vowels: Advanced Sounds"
        />
    );
}
