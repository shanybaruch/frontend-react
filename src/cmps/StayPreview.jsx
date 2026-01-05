import { Link } from 'react-router-dom'

export function StayPreview({ stay }) {
    return <article className="stay-preview">
        <div className="image-container">
                <img src={stay.imgUrl} alt={stay.name} />
            </div>
        <header>
            <Link to={`/stay/${stay._id}`}>{stay.name}</Link>
        </header>
        <div className="stay-info">
                {/* <h3>{stay.name}</h3> */}
                <p>{stay.loc.city}, {stay.loc.country}</p>
                <p>${stay.price} for night ★ {stay.rate}</p>
                {/* <p>★ {stay.rate}</p> */}
            </div>

        {/* <p>Capacity: <span>{stay.capacity
        }</span></p> */}
        {stay.owner && <p>Owner: <span>{stay.owner.fullname}</span></p>}
        
    </article>
}