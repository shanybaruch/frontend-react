import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { ShareModal } from './ShareModal.jsx'
import { StayDetailsHeader } from './StayDetailsHeader.jsx'
import { useInView } from 'react-intersection-observer'

import { RiStarFill, RiTvLine } from "react-icons/ri";
import { HiOutlineTv } from "react-icons/hi2";
import { HiOutlineWifi } from "react-icons/hi";
import { IoIosSnow } from "react-icons/io";
import { TbToolsKitchen2, TbWindow } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FiShare } from "react-icons/fi";
import { CgMenuGridO } from "react-icons/cg";
import { useLocation } from 'react-router-dom'


import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'
import { saveToStorage } from '../services/util.service'

import { Calendar } from '../cmps/Calendar';
import { Loader } from '../cmps/Loader.jsx'


export function StayDetails() {
  const { stayId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const photosRef = useRef(null)
  const amenitiesRef = useRef(null)

  const stay = useSelector(storeState => storeState.stayModule.stay)
  const location = useLocation()
  const order = location.state?.order

  const loggedInUser = useSelector(storeState => storeState.userModule.user)

  const [isShareOpen, setIsShareOpen] = useState(false)

  const { ref: photosInViewRef, inView: isPhotosInView } = useInView({
    threshold: 0.1,
  })



  const iconMap = {
    "Wifi": <HiOutlineWifi />,
    "Air conditioning": <IoIosSnow />,
    "Kitchen": <TbToolsKitchen2 />,
    "TV": <HiOutlineTv />,
    "Balcony": <TbWindow />
  }

  useEffect(() => {
    loadStay(stayId)

    return () => {
      dispatch({ type: 'SET_STAY', stay: null })
    }
  }, [stayId])

  async function onAddStayMsg(stayId) {
    try {
      await addStayMsg(stayId, 'bla bla ' + parseInt(Math.random() * 10))
      showSuccessMsg(`Stay msg added`)
    } catch (err) {
      showErrorMsg('Cannot add stay msg')
    }
  }

  function OnStayDetailsPhotos() {
    navigate(`/stay/${stayId}/photos`, { state: stay });
  };

  function onSaveHeart(stayId) {
    if (!loggedInUser) {
      showErrorMsg('Please log in to save')
      return
    }

    const saved = loggedInUser.saved || []
    const isSaved = saved.includes(stayId)

    const updatedUser = {
      ...loggedInUser,
      saved: isSaved
        ? saved.filter(id => id !== stayId)
        : [...saved, stayId]
    }

    saveToStorage('users', updatedUser)

    dispatch({ type: 'SET_USER', user: updatedUser })
  }

  if (!stay) return <Loader />
  return (
    <section>
      <StayDetailsHeader
        hidden={isPhotosInView}
        amenitiesRef={amenitiesRef}
      />

      <div className="stay-details">
        {stay && (
          <div>
            <div className="heading flex">
              <h1 className='title'>{stay.name}</h1>
              <div className="right-heading flex">
                <button
                  className='share'
                  onClick={() => setIsShareOpen(true)}>
                  <FiShare />
                  <span>Share</span>
                </button>

                {isShareOpen && (
                  <ShareModal
                    stayId={stayId}
                    onClose={() => setIsShareOpen(false)}
                  />
                )}

                <button
                  className='save'
                  onClick={() => onSaveHeart(stay._id)}>
                  {loggedInUser?.saved?.includes(stay._id) ? <FaHeart /> : <FaRegHeart />}
                  <span>Save</span>
                </button>
              </div>
            </div>

            <section ref={photosInViewRef} className="gallery">
              <button className="btn-photos" onClick={OnStayDetailsPhotos}>
                <CgMenuGridO /> Show all photos
              </button>
              <div className="gallery-main">
                <img src={stay.imgUrl} alt={stay.name} className="left-img" />
              </div>

              <div className="gallery-side">
                <div><img src={stay.imgUrl} alt={stay.name} /></div>
                <div><img src={stay.imgUrl} alt={stay.name} className="top-right" /></div>
                <div><img src={stay.imgUrl} alt={stay.name} /></div>
                <div><img src={stay.imgUrl} alt={stay.name} className="bottom-right" /></div>
              </div>
            </section>

            <section className='sides'>
              <section className='big-side'>
                <div className="description">
                  <h2>{stay.type} {stay.name}</h2>
                  <p className="guests">{stay.capacity} guests · {stay.capacity / 2} bedroom</p>
                  <div className="meta-item">
                    <RiStarFill size={10} />
                    <span className='rate'>{stay.rate} · </span>
                    <span className='reviews'>{stay.reviews.length} reviews</span>
                  </div>
                </div>

                <div className="">
                  <div className="divider"></div>
                  <p className="description-p">{stay.description}</p>
                </div>

                <section ref={amenitiesRef}>
                  <div className="amenities">
                    <div className="divider"></div>
                    <h2 className='title-place-offers'>What this place offers</h2>
                    {stay.amenities && (
                      <ul className="amenities">
                        {stay.amenities.map((item, idx) => (
                          <li key={idx} className='amenity-item'>
                            {iconMap[item] || null}
                            <span> {item} </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>

              </section>
              <section className="small-side">
                <section className="order-card">
                  <div className="order-header">
                    <span className="price">
                      ₪{stay.price}
                      <span className="per-night"> / night </span>
                    </span>
                    <div className="order-rating">
                      <RiStarFill size={12} />
                      <span>{stay.rate}</span>
                      <span className="reviews">· {stay.reviews.length} reviews</span>
                    </div>
                  </div>

                  <div className="order-dates">
                    <div className="date-box">
                      <span className="label">CHECK-IN</span>
                      <span className="value">{order?.checkIn || 'Add date'}</span>
                    </div>
                    <div className="date-box">
                      <span className="label">CHECK-OUT</span>
                      <span className="value">{order?.checkOut || 'Add date'}</span>
                    </div>
                  </div>

                  <div className="order-guests">
                    <span className="label">GUESTS</span>
                    <span className="value">{order
                      ? `${order.guests.adults + order.guests.children} guests`
                      : 'Add guests'}
                    </span>
                  </div>

                  <button
                    className="reserve-btn"
                    onClick={() => navigate('order')}> Reserve </button>

                  <p className="order-note"> You won’t be charged yet </p>
                </section>
              </section>
            </section>
          </div>
        )}

        {/* <button onClick={() => onAddStayMsg(stay._id)}>Add stay msg</button> */}

      </div>
    </section>
  )
}