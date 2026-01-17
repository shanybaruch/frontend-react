import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Calendar } from './Calendar'
import { GuestPicker } from './GuestPicker'
import { IoSearch } from 'react-icons/io5'
import { SET_FILTER_BY } from '../store/reducers/stay.reducer'

export function StayFilter(
    { isEditingWhere, isEditingWhen, isEditingWho,
        setIsEditingWhere, setIsEditingWhen, setIsEditingWho,
        getGuestLabel
    }) {

    const dispatch = useDispatch()
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    const isAnyActive = isEditingWhere || isEditingWhen || isEditingWho
    const guests = filterBy.guests || { adults: 0, children: 0, infants: 0, pets: 0 }
    const [searchTerm, setSearchTerm] = useState('')

    function onUpdateGuests(type, diff) {
        const newVal = Math.max(0, guests[type] + diff)
        dispatch({
            type: SET_FILTER_BY,
            filterBy: { ...filterBy, guests: { ...guests, [type]: newVal } }
        })
    }

    function onSearch() {
        const totalGuests = filterBy.guests.adults + filterBy.guests.children
        const filterToSave = { ...filterBy, minCapacity: totalGuests }
        dispatch({ type: SET_FILTER_BY, filterBy: filterToSave })
        loadStays(filterToSave)
        setIsEditingWhere(false)
        setIsEditingWhen(false)
        setIsEditingWho(false)
    }

    function onSetRange(range) {
        dispatch({
            type: SET_FILTER_BY,
            filterBy: { ...filterBy, from: range?.from || null, to: range?.to || null }
        })
    }

    const rangeForCalendar = {
        from: filterBy.from ? new Date(filterBy.from) : undefined,
        to: filterBy.to ? new Date(filterBy.to) : undefined
    }

    const destinations = [
        { id: '1', name: 'Eilat, Israel', desc: 'Because your wishlist has stays in Eilat' },
        { id: '2', name: 'New York, United States', desc: 'For its bustling nightlife' },
        { id: '3', name: 'Paris, France', desc: 'Because you wishlisted it' },
        { id: '4', name: 'Tokyo, Japan', desc: 'For sights like Trevi Fountain' },
        { id: '5', name: 'Rome, Italy', desc: 'For sights like Trevi Fountain' },
    ]

    const handleSelect = (destinationName) => {
        const cityOnly = destinationName.split(',')[0].trim()

        setSearchTerm(destinationName) 
        dispatch({ type: SET_FILTER_BY, filterBy: { ...filterBy, txt: cityOnly } }) 
        setIsEditingWhere(false)
    }

    return (
        <section className='stay-filter'>
            <div className='selection'>
                <section
                    className={`select-where ${isEditingWhere ? 'active' : ''}`}
                    onClick={(ev) => {
                        ev.stopPropagation()
                        setIsEditingWhere(!isEditingWhere)
                        setIsEditingWhen(false)
                        setIsEditingWho(false)
                    }}
                >
                    <section className='sec first-sec'>
                        <p>Where</p>
                        {isEditingWhere && (
                            <div className="suggestions-modal" onClick={(e) => e.stopPropagation()}>
                                <p>Suggested destinations</p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {destinations.map((dest) => (
                                        <li
                                            key={dest.id}
                                            onClick={() => handleSelect(dest.name)}
                                            className="suggestion-item"
                                        >
                                            <h4>{dest.name}</h4>
                                            <span>{dest.desc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {isEditingWhere ? (
                            <input
                                type="search"
                                autoFocus
                                placeholder="Search destinations"
                                value={searchTerm || filterBy.txt || ''}
                                onChange={(ev) => {
                                    setSearchTerm(ev.target.value)
                                    dispatch({ type: SET_FILTER_BY, filterBy: { ...filterBy, txt: ev.target.value } })
                                }}
                            />
                        ) : (
                            <span>{filterBy.txt || 'Search destinations'}</span>
                        )}
                    </section>
                    <div className="v-line"></div>
                </section>

                <section
                    className={`select-when ${isEditingWhen ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsEditingWhen(!isEditingWhen)
                        setIsEditingWhere(false)
                        setIsEditingWho(false)
                    }}
                >
                    <section className='sec'>
                        <p>When</p>
                        <span>
                            {filterBy.from ?
                                `${new Date(filterBy.from).toLocaleDateString()} - ${filterBy.to ? new Date(filterBy.to).toLocaleDateString() : ''}`
                                : 'Add dates'}
                        </span>
                    </section>
                    {isEditingWhen && (
                        <div className="calendar-dropdown" onClick={(e) => e.stopPropagation()}>
                            <Calendar range={rangeForCalendar} setRange={onSetRange} />
                        </div>
                    )}
                    <div className="v-line"></div>
                </section>

                <section
                    className={`select-who ${isEditingWho ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsEditingWhere(false)
                        setIsEditingWhen(false)
                        setIsEditingWho(!isEditingWho)
                    }}
                >
                    <section className='sec'>
                        <p>Who</p>
                        <span>{getGuestLabel()}</span>
                    </section>
                    {isEditingWho && (
                        <GuestPicker guests={guests} onUpdateGuests={onUpdateGuests} />
                    )}
                </section>

                <section className={`sec-search ${isAnyActive ? 'expanded' : ''}`} onClick={onSearch}>
                    <IoSearch />
                    {isAnyActive && <span className="search-text">Search</span>}
                </section>
            </div>
        </section>
    )
}