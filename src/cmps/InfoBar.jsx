import {getRandomIntInclusive} from '../services/util.service.js'
import { SvgIcon } from './SvgIcon.jsx';

export function InfoBar({ stay, isPhotosInView, photosRef, amenitiesRef, reviewsRef }) {
    var randomInt = getRandomIntInclusive(2, 5);
    const InfoBar = ['Cleanliness', 'Accuracy', 'Communication', 'Location', 'CheckIn', 'Value']
    return (
    <section className='info-bar'>
        <ul className="info-bar-list">
          {InfoBar.map((item, idx) => (
            <li key={idx} className="info-bar-item">
              <span>{item}</span>
              <span>{randomInt}.0</span>
              <SvgIcon iconName={item} />
            </li>
          ))}
        </ul>
    </section>
    )
}
