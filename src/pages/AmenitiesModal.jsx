import { useEffect } from "react";

export function AmenitiesModal({ amenities, iconMap, onClose }) {

    useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    }
  }, []);

    return (
        <div
            className="amenities-modal-overlay"
            onClick={onClose}
        >
            <div
                className="amenities-modal-content"
                onClick={e => e.stopPropagation()}
            >
                <div className="btnX-amenities-modal">
                    <button className="amenities-modal-close" onClick={onClose}>X</button>
                </div>
                <div className="amenities-modal-body">
                    <h1>What this place offers</h1>

                    <ul className="amenities-modal-list-full">
                        {amenities.map((item, idx) => (
                            <li key={idx} className="amenity-item">
                                {iconMap[item] || null}
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}
