import VowelsPractice from './VowelsPractice';

// Basic vowels with close English equivalents
const BASIC_VOWELS = [
    { letter: 'a', name: 'Plain a', sound: '"ah" as in <b>father</b>', example: 'ba', exMeaning: 'father' },
    { letter: 'e', name: 'Plain e', sound: '"e" as in <b>get</b> or <b>set</b>', example: 'xe', exMeaning: 'vehicle' },
    { letter: 'i / y', name: 'i / y', sound: '"ee" as in <b>see</b>', example: 'bi', exMeaning: 'marble' },
    { letter: 'o', name: 'Plain o', sound: '"o" as in <b>hot</b>', example: 'bò', exMeaning: 'cow' },
    { letter: 'u', name: 'Plain u', sound: '"oo" as in <b>boot</b> or <b>true</b>', example: 'thu', exMeaning: 'autumn' },
];

export default function VowelsSingle1() {
    return (
        <VowelsPractice
            singleVowels={BASIC_VOWELS}
            centeringDiphthongs={null}
            glidingDiphthongs={null}
            triphthongs={null}
            title="Vowels: Basics"
        />
    );
}
