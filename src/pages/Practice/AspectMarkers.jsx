import DrillPractice from './DrillPractice';
import data from '../../data/drills/aspect_markers.json';

export default function AspectMarkers() {
    return <DrillPractice data={data} questionCount={10} />;
}
