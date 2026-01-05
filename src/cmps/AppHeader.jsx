import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { FiMenu } from "react-icons/fi";
import { useState } from 'react'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

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
		<header className="app-header full">
			<nav className='header-nav'>
				<NavLink to="/stay" className="logo">
					AYS Stay
				</NavLink>

				<section className='nav-middle'>
					{/* <NavLink to="about">About</NavLink> */}
					<NavLink to="stay">Homes</NavLink>
					<NavLink to="/review">Experiences</NavLink>
					<NavLink to="chat">Services</NavLink>
					{/* <NavLink to="chat">Chat</NavLink> */}
					{/* <NavLink to="review">Review</NavLink> */}
				</section>

				<section className='nav-end'>
					<div className="menu-wrapper">
						<button
							className="btn-menu"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<FiMenu />
						</button>
						{isMenuOpen && (
							<div className="menu-dropdown" onClick={() => setIsMenuOpen(false)}>
								{!user ? (
									<NavLink to="auth/login" className="menu-item">Log in or sign up</NavLink>
								) : (
									<>
										<Link to={`user/${user._id}`} className="menu-item bold">Profile</Link>
										<hr />
										<button onClick={onLogout} className="menu-item logout-btn">Logout</button>
									</>
								)}
							</div>
						)}

						{/* {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>} */}

					</div>
				</section>
			</nav>
			<div className='selection'>
				<section className='select-where'>
					<section className='sec'>

						<p>Where</p>
						<span>Search destinations</span>
					</section>
					<div className="v-line"></div>
				</section>
				<section className='select-when'>
					<section className='sec'>
						<p>When</p>
						<span>Add dates</span>

					</section>
					<div className="v-line"></div>
				</section>
				<section className='select-who'>
					<section className='sec'>
						<p>Who</p>
						<span>Add guests</span>
					</section>
					<span className='search'></span>
				</section>
			</div>
		</header>
	)
}
