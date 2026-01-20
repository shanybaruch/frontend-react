import { Link, useLocation } from 'react-router-dom'

export function StayPreview({ stay }) {
    const location = useLocation()

    if (!stay) return
    return <article className="stay-preview">
        <Link to={`/stay/${stay._id}${location.search}`}>
            <div className="image-container">
                <img src={stay.imgUrl} alt={stay.name} />
            </div>

            <p className='name'>{stay.name}</p>

            <div className="stay-info">
                {/* <h3>{stay.name}</h3> */}
                {/* <p>{stay.loc?.city}, {stay.loc?.country}</p> */}
                <p>₪{stay.price} for night ★ {stay.rate}</p>
            </div>

            {/* <p>Capacity: <span>{stay.capacity
        }</span></p> */}
            {stay.owner && <p>Owner: <span>{stay.owner.fullname}</span></p>}
        </Link>

    </article>
}