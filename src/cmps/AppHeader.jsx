import { Link, NavLink } from 'react-router-dom'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { FiMenu } from "react-icons/fi";
import { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { loadStays } from '../store/actions/stay.actions'
import { SET_FILTER_BY } from '../store/reducers/stay.reducer'
import { Calendar } from './Calendar'
import { GuestPicker } from './GuestPicker'
import { LoginModal } from './LoginModal'


export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const location = useLocation()

	const isUserPage = location.pathname.startsWith('/user')

	const guests = filterBy.guests || { adults: 0, children: 0, infants: 0, pets: 0 }
	const { adults, children, infants, pets } = guests
	const totalGuests = adults + children

	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isEditingWhere, setIsEditingWhere] = useState(false)
	const [isEditingWhen, setIsEditingWhen] = useState(false)
	const [isEditingWho, setIsEditingWho] = useState(false)
	const [isLoginOpen, setIsLoginOpen] = useState(false)
	const isAnyActive = isEditingWhere || isEditingWhen || isEditingWho

	function onUpdateGuests(type, diff) {
		const newVal = Math.max(0, guests[type] + diff)
		dispatch({
			type: SET_FILTER_BY,
			filterBy: { ...filterBy, guests: { ...guests, [type]: newVal } }
		})
	}

	function getGuestLabel() {
		if (!totalGuests && !infants && !pets) return 'Add guests'

		let label = `${totalGuests} guests`
		if (infants) label += `, ${infants} infants`
		if (pets) label += `, ${pets} pets`
		return label
	}

	function onSetRange(range) {
		const from = range?.from || null
		const to = range?.to || null

		dispatch({
			type: SET_FILTER_BY,
			filterBy: { ...filterBy, from, to }
		})
		// if (from && to && from.getTime() !== to.getTime()) {
		//     setIsEditingWhen(false)
		// }
	}

	const rangeForCalendar = {
		from: filterBy.from ? new Date(filterBy.from) : undefined,
		to: filterBy.to ? new Date(filterBy.to) : undefined
	}

	async function onLogout() {
		try {
			await logout()
			setIsMenuOpen(false)
			navigate('/')
			showSuccessMsg(`Bye now`)
		} catch (err) {
			showErrorMsg('Cannot logout')
		}
	}

	function handleTxtChange({ target }) {
		const value = target.value
		dispatch({ type: SET_FILTER_BY, filterBy: { ...filterBy, txt: value } })
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

	return (
        <header className={`app-header full`}>
            {(isMenuOpen || isAnyActive) && (
                <div className="main-screen" onClick={() => {
                    setIsMenuOpen(false)
                    setIsEditingWhen(false)
                    setIsEditingWhere(false)
                    setIsEditingWho(false)
                }}></div>
            )}
            
            <nav className='header-nav'>
                <NavLink to="/stay" className="logo">
                    <img src="/img/logo-ays.png" alt="logo" />
                    AYS Nest
                </NavLink>

                {!isUserPage && (
                    <section className='nav-middle'>
                        <NavLink to="stay">Homes</NavLink>
                        <NavLink to="/review">Experiences</NavLink>
                        <NavLink to="chat">Services</NavLink>
                    </section>
                )}

                <section className='nav-end'>
                    <div className="menu-wrapper">
                        {user && (
                            <Link to={`/user/${user._id}/about`} className="menu-item user-img-link">
                                <img src={user.imgUrl} alt="user" className="user-nav-img" />
                            </Link>
                        )}
                        <button className="btn-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <FiMenu />
                        </button>
                        {isMenuOpen && (
                            <div className="menu-dropdown" onClick={() => setIsMenuOpen(false)}>
                                {!user ? (
                                    <section className="menu-item" onClick={() => setIsLoginOpen(true)}>
                                        Log in or sign up
                                    </section>
                                ) : (
                                    <>
                                        <Link to={`/user/${user._id}/about`} className="menu-item bold">Profile</Link>
                                        <div className='divider'></div>
                                        <button onClick={onLogout} className="menu-item logout-btn">Logout</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </nav>

            {!isUserPage && (
                <div className='selection'>
                    <section
                        className={`select-where ${isEditingWhere ? 'active' : ''}`}
                        onClick={() => {
                            setIsEditingWhere(!isEditingWhere)
                            setIsEditingWhen(false)
                            setIsEditingWho(false)
                        }}
                    >
                        <section className='sec'>
                            <p>Where</p>
                            {isEditingWhere ? (
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search destinations"
                                    value={filterBy.txt || ''}
                                    onChange={(e) => dispatch({ type: SET_FILTER_BY, filterBy: { ...filterBy, txt: e.target.value } })}
                                    onBlur={() => setTimeout(() => setIsEditingWhere(false), 200)}
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
            )}
            {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
        </header>
    )
}
