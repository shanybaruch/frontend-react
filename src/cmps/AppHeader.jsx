import { Link, NavLink } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { FiMenu } from "react-icons/fi";

import { useState } from 'react';
import { IoSearch } from "react-icons/io5";

import { LoginModal } from './LoginModal'
import { StayFilter } from './StayFilter'

export function AppHeader({ isAtTop }) {
    const user = useSelector(storeState => storeState.userModule.user)
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)

    const navigate = useNavigate()
    const location = useLocation()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isEditingWhere, setIsEditingWhere] = useState(false)
    const [isEditingWhen, setIsEditingWhen] = useState(false)
    const [isEditingWho, setIsEditingWho] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    
    const isUserPage = location.pathname.startsWith('/user')
    const isStayDetails = location.pathname.startsWith('/stay/') && location.pathname !== '/stay'
    const isAnyActive = isEditingWhere || isEditingWhen || isEditingWho
    const isCompact = (!isAtTop || isStayDetails || isUserPage) && !isAnyActive
    
    const guests = filterBy.guests || { adults: 0, children: 0, infants: 0, pets: 0 }
    const { adults, children, infants, pets } = guests
    const totalGuests = adults + children

    function getGuestLabel() {
        if (!totalGuests && !infants && !pets) return 'Add guests'
        let label = `${totalGuests} guests`
        if (infants) label += `, ${infants} infants`
        if (pets) label += `, ${pets} pets`
        return label
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

    return (
        <header className={`app-header full ${isCompact ? 'compact' : ''} ${isStayDetails ? 'static-header' : ''}`}>
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
                    <span>AYS Nest</span>
                </NavLink>

                {!isUserPage && (
                    <section className='nav-middle'>
                        {isCompact ? (
                            <button className="search-bar-mini" onClick={() => setIsEditingWhere(true)}>
                                <span className="label">Anywhere</span>
                                <div className="v-line"></div>
                                <span className="label">Any week</span>
                                <div className="v-line"></div>
                                <span className="label guests">Add guests</span>
                                <div className="search-icon"><IoSearch /></div>
                            </button>
                        ) : (
                            <div className="nav-links-wrapper">
                                <NavLink to="stay">
=                                    <img src="/img/home-logo.png" alt="home-logo" />
                                    <span>
                                        Homes
                                    </span>
                                    <hr />
                                </NavLink>
                            </div>
                        )}
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
            {!isUserPage &&
                <StayFilter
                    isEditingWhere={isEditingWhere}
                    isEditingWhen={isEditingWhen}
                    isEditingWho={isEditingWho}
                    setIsEditingWhere={setIsEditingWhere}
                    setIsEditingWhen={setIsEditingWhen}
                    setIsEditingWho={setIsEditingWho}
                    getGuestLabel={getGuestLabel}
                />
            }
            {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
        </header>
    )
}