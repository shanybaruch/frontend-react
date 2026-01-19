import { useState } from "react";
import { AmenitiesModal } from "./AmenitiesModal.jsx";

export function Amenities({ amenities, iconMap }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const amenitiesToShow = amenities.slice(0, 10);

  const mid = Math.ceil(amenitiesToShow.length / 2);
  const firstCol = amenitiesToShow.slice(0, mid);
  const secondCol = amenitiesToShow.slice(mid);

  return (
    <>
      <div className="amenities-columns">
        <ul className="amenities-list">
          {firstCol.map((item, idx) => (
            <li key={idx} className="amenity-item">
              {iconMap[item] || null}
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <ul className="amenities-list">
          {secondCol.map((item, idx) => (
            <li key={idx} className="amenity-item">
              {iconMap[item] || null}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {amenities.length > 10 && (
        <button
          className="btn-amenities-more"
          onClick={() => setIsModalOpen(true)}
        >
          Show all amenities
        </button>
      )}

      {isModalOpen && (
        <AmenitiesModal
          amenities={amenities}
          iconMap={iconMap}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}