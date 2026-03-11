import DrillPractice from './DrillPractice';
import data from '../../data/drills/particles_emotion.json';

export default function ParticlesEmotion() {
    return <DrillPractice data={data} questionCount={10} />;
}
