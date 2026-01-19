import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

export function StayDetailsPhotos() {
  const { stayId } = useParams();

  const location = useLocation()
  const stay = location.state
  if (!stay) return <p>Loading...</p>;

  const photos = stay.imgUrls?.length ? stay.imgUrls : Array(10).fill(stay.imgUrl);

  return (
    <section className="photos-page">
      <h1>All Photos</h1>
      <div className="photos-grid">
        {photos.map((url, idx) => (
          <div key={idx} className={`photo-item photo-${idx % 4}`}>
            <img src={url} alt={`Stay photo ${idx + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
