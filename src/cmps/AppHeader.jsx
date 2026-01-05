import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()

	async function onLogout() {
		try {
			await logout()
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

				<section>
					{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

					{!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
					{user && (
						<div className="user-info">
							<Link to={`user/${user._id}`}>
								{user.imgUrl && <img src={user.imgUrl} />}
								{user.fullname}
							</Link>
							<span className="score">{user.score?.toLocaleString()}</span>
							<button onClick={onLogout}>logout</button>
						</div>
					)}
				</section>
			</nav>
			<div className='selection'>
				<section>
					<p>Where</p>
					<span>Search destinations</span>
				</section>
				<section>
					<p>When</p>
					<span>Add dates</span>
				</section>
				<section className='select-who'>
					<div>
						<p>Who</p>
						<span>Add guests</span>
					</div>
					<span className='search'></span>
				</section>
			</div>
		</header>
	)
}
