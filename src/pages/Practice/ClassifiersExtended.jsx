import DrillPractice from './DrillPractice';
import data from '../../data/drills/classifiers_extended.json';

export default function ClassifiersExtended() {
    return <DrillPractice data={data} questionCount={10} />;
}
