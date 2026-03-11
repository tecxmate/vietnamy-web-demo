import DrillPractice from './DrillPractice';
import data from '../../data/drills/consonants_initial.json';

export default function ConsonantsPractice() {
    return <DrillPractice data={data} questionCount={10} />;
}
