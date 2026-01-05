import { Link } from 'react-router-dom'

export function StayPreview({ stay }) {
    return <article className="stay-preview">
        <header>
            <Link to={`/stay/${stay._id}`}>{stay.type}</Link>
        </header>

        <p>Capacity: <span>{stay.capacity
        // .toLocaleString()
        }</span></p>
        {stay.owner && <p>Owner: <span>{stay.owner.fullname}</span></p>}
        
    </article>
}