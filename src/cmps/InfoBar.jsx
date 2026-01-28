import { getRandomIntInclusive } from '../services/util.service.js'
import { SvgIcon } from './SvgIcon.jsx';

export function InfoBar({ stay, isPhotosInView, photosRef, amenitiesRef, reviewsRef }) {
  var randomInt = getRandomIntInclusive(2, 5);
  const InfoBar = ['Cleanliness', 'Accuracy', 'Communication', 'Location', 'CheckIn', 'Value']
  return (
    <section className='info-bar'>
      <ul className="info-bar-list">
        <li>
          <span className='info-bar-item-1'>Overall rating</span>
          <div className="info-rating">
            <div className="rating-row">
              <span className="rating-number">1</span>
              <div className="bar filled"></div>
            </div>
            <div className="rating-row">
              <span className="rating-number">2</span>
              <div className="bar"></div>
            </div>
            <div className="rating-row">
              <span className="rating-number">3</span>
              <div className="bar"></div>
            </div>
            <div className="rating-row">
              <span className="rating-number">4</span>
              <div className="bar"></div>
            </div>
            <div className="rating-row">
              <span className="rating-number">5</span>
              <div className="bar"></div>
            </div>
          </div>
        </li>

        {InfoBar.map((item, idx) => {
          const randomInt = Math.floor(Math.random() * 5) + 1;
          return (
            <li key={idx} className="info-bar-item">
              <span>{item}</span>
              <span className='randomInt-point'>{randomInt}.0</span>
              <SvgIcon iconName={item} />
            </li>
          );
        })}
      </ul>
    </section>
  )
}
