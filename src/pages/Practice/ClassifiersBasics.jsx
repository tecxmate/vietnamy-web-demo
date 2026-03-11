import DrillPractice from './DrillPractice';
import data from '../../data/drills/classifiers_basics.json';

export default function ClassifiersBasics() {
    return <DrillPractice data={data} questionCount={10} />;
}
