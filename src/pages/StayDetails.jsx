import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { ShareModal } from './ShareModal.jsx'
import { updateUser } from '../store/actions/user.actions'

import { StayDetailsHeader } from './StayDetailsHeader.jsx'
import { Amenities } from "./Amenities.jsx";
import { Reviews } from "./Reviews.jsx";

import { useSearchParams } from 'react-router-dom'
import { SET_FILTER_BY } from '../store/reducers/stay.reducer'

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
import { saveToStorage, loadFromStorage } from '../services/util.service'
import { Calendar } from '../cmps/Calendar';
import { Loader } from '../cmps/Loader.jsx'
import { OrderCard } from '../cmps/OrderCard.jsx'
import { BiColor } from 'react-icons/bi'

export function StayDetails() {
  const { stayId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()

  const photosRef = useRef(null)
  const amenitiesRef = useRef(null)
  const reviewsRef = useRef(null)


  const stay = useSelector(storeState => storeState.stayModule.stay)
  const location = useLocation()
  const order = location.state?.order

  const loggedInUser = useSelector(storeState => storeState.userModule.user)
  const [, forceRender] = useState(0)
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
    if (searchParams.size === 0) return

    const filterFromUrl = {
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      guests: {
        adults: +searchParams.get('adults') || 0,
        children: +searchParams.get('children') || 0,
        infants: +searchParams.get('infants') || 0,
        pets: +searchParams.get('pets') || 0,
      }
    }
    dispatch({ type: SET_FILTER_BY, filterBy: filterFromUrl })
  }, [])

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
  const user = userService.getLoggedinUser()

  async function onSaveHeart(stayId) {

    console.log(user);

    if (!user) {
      showErrorMsg('Please log in to save')
      return
    }

    const saved = Array.isArray(user.saved) ? user.saved : []
    const isSaved = saved.includes(stayId)

    const userToUpdate = {
      ...user,
      saved: isSaved
        ? saved.filter(id => id !== stayId)
        : [...saved, stayId]
    }
    console.log(userToUpdate);

    try {
      await updateUser(userToUpdate)
    } catch (err) {
      showErrorMsg('Could not save stay to favorites')
    }
  }



  if (!stay) return <Loader />
  return (
    <section className='all-stay-details'>
      <StayDetailsHeader
        hidden={isPhotosInView}
        amenitiesRef={amenitiesRef}
        reviewsRef={reviewsRef}
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
                  className="save"
                  onClick={() => onSaveHeart(stay._id)}
                >
                  {user?.saved?.includes(stay._id)
                    ? <FaHeart style={{ color: '#ff385c' }} />
                    : <FaRegHeart />}
                  <span>Save</span>
                </button>
              </div>
            </div>

            <section ref={photosInViewRef} className="gallery">
              <button className="btn-photos" onClick={OnStayDetailsPhotos}>
                <CgMenuGridO size={16} /> Show all photos
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
                  <p className="guests">{stay.capacity} guest{stay.capacity > 1 ? 's' : ''} · {stay.capacity / 2} bedroom{stay.capacity / 2 > 1 ? 's' : ''}</p>
                  <div className="meta-item">
                    <RiStarFill size={10} />
                    <span className='rate'>{stay.rate} · </span>
                    <span className='reviews-txt'>{stay.reviews.length} reviews</span>
                  </div>
                </div>

                <div className="">
                  <div className="divider"></div>
                  <p className="description-p">{stay.description}</p>
                </div>

                <section ref={amenitiesRef}>
                  <div className="amenities">
                    <div className="divider"></div>
                    <h2 className="title-place-offers">What this place offers</h2>

                    {stay.amenities && (
                      <Amenities
                        amenities={stay.amenities}
                        iconMap={iconMap}
                      />
                    )}
                  </div>
                </section>

              </section>

              <section className="small-side">
                <OrderCard />
              </section>
            </section>
          </div>
        )}

        {/* <button onClick={() => onAddStayMsg(stay._id)}>Add stay msg</button> */}

      </div>
      <div className="divider"></div>
      <section className='reviews' ref={reviewsRef}>
        <div className="reviews">
          {stay.reviews && (
            <Reviews
              reviews={stay.reviews}
            />
          )}
        </div>
      </section>
    </section>
  )
}