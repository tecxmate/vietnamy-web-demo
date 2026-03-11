import VowelsPractice from './VowelsPractice';

// Special Vietnamese vowels (with diacritics/hooks)
const SPECIAL_VOWELS = [
    { letter: 'ă', name: 'Smile a', sound: 'Shorter "ah" as in <b>cut</b> or <b>shut</b>', example: 'ăn', exMeaning: 'eat' },
    { letter: 'â', name: 'Hat a', sound: '"u" as in <b>but</b> (very short)', example: 'cần', exMeaning: 'need' },
    { letter: 'ê', name: 'Hat e', sound: '"ay" as in <b>say</b> or <b>day</b>', example: 'bê', exMeaning: 'calf' },
    { letter: 'ô', name: 'Hat o', sound: '"o" as in <b>go</b>', example: 'cô', exMeaning: 'miss' },
    { letter: 'ơ', name: 'Hook o', sound: '"u" as in <b>huh</b> or <b>fur</b> (but longer)', example: 'thơ', exMeaning: 'poem' },
    { letter: 'ư', name: 'Hook u', sound: 'Like "ee" but with flat, unrounded lips', example: 'thư', exMeaning: 'letter' },
];

export default function VowelsSingle2() {
    return (
        <VowelsPractice
            singleVowels={SPECIAL_VOWELS}
            centeringDiphthongs={null}
            glidingDiphthongs={null}
            triphthongs={null}
            title="Vowels: Special"
        />
    );
}
