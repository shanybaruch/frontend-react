import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { NavLink, Outlet } from 'react-router-dom'

import { loadUser, updateUser } from '../store/actions/user.actions'
import { showSuccessMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'
import { ImgUploader } from '../cmps/ImgUploader'
import { UserAbout } from '../cmps/UserAbout'

export function UserDetails() {
  const dispatch = useDispatch()
  const params = useParams()
  const user = useSelector(storeState => storeState.userModule.watchedUser)

  useEffect(() => {
    loadUser(params.id)

    socketService.emit(SOCKET_EMIT_USER_WATCH, params.id)
    socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

    return () => {
      socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    }

  }, [params.id])

  function onUserUpdate(user) {
    showSuccessMsg(`User updated`)
    dispatch({ type: SET_WATCHED_USER, user })
  }

  return (
    <section className="user-details">
      <section className='section profile'>
        <h1 className='title'>Profile</h1>
        <div className='nav-links'>
          <NavLink to={`/user/${params.id}/about`}>
            <img src={user?.imgUrl} alt="img-profile" className='img-profile' />
            <span>About me</span>
          </NavLink>
          <NavLink to={`/user/${params.id}/trips`}>
            <div className='img-trip'>🧳</div>
            <span>Past trips</span>
          </NavLink>
        </div>
      </section>
      <div className='divider'></div>
      <section className="tab-content">
        <Outlet context={{ user }} />
      </section>
    </section>
  )
}