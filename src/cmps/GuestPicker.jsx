export function GuestPicker({ guests, onUpdateGuests }) {
    const guestLabels = [
        { type: 'adults', title: 'Adults', desc: 'Ages 13 or above' },
        { type: 'children', title: 'Children', desc: 'Ages 2 – 12' },
        { type: 'infants', title: 'Infants', desc: 'Under 2' },
        { type: 'pets', title: 'Pets', desc: 'Bringing a service animal?', link: true },
    ]

    return (
        <div className="guests-dropdown" onClick={(e) => e.stopPropagation()}>
            {guestLabels.map((g, idx) => (
                <div key={g.type} className="guest-row">
                    <div className="info">
                        <div className="title">{g.title}</div>
                        {g.link ? <a href="#">{g.desc}</a> : <div className="desc">{g.desc}</div>}
                    </div>
                    <div className="counts">
                        <button
                            type="button"
                            className={guests[g.type] <= 0 ? 'disabled' : ''}
                            onClick={() => onUpdateGuests(g.type, -1)}
                        >
                            -
                        </button>
                        <span>{guests[g.type]}</span>
                        <button
                            type="button"
                            onClick={() => onUpdateGuests(g.type, 1)}
                        >
                            +
                        </button>
                    </div>
                    {idx < guestLabels.length - 1 && <hr />}
                </div>
            ))}
        </div>
    )
}