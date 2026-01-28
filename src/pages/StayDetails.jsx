import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { ShareModal } from './ShareModal.jsx'
import { updateUser } from '../store/actions/user.actions'
import { userService } from "../services/user";


import { StayDetailsHeader } from './StayDetailsHeader.jsx'
import { Amenities } from "./Amenities.jsx";
import { Reviews } from "./Reviews.jsx";
import { Calendar } from '../cmps/Calendar.jsx'
import { Loader } from '../cmps/Loader.jsx'
import { OrderCard } from '../cmps/OrderCard.jsx'
import { InfoBar } from '../cmps/InfoBar.jsx'

import { useSearchParams } from 'react-router-dom'
import { SET_FILTER_BY } from '../store/reducers/stay.reducer'

import { useInView } from 'react-intersection-observer'
import { RiStarFill, RiTvLine } from "react-icons/ri";

import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FiShare } from "react-icons/fi";
import { CgMenuGridO } from "react-icons/cg";

import { useLocation } from 'react-router-dom'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'


export function StayDetails() {
  const { stayId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()

  const photosRef = useRef(null)
  const amenitiesRef = useRef(null)
  const reviewsRef = useRef(null)


  const stay = useSelector(storeState => storeState.stayModule.stay)
  const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
  const location = useLocation()
  const order = location.state?.order

  const loggedInUser = useSelector(storeState => storeState.userModule.user)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  // const [savedIds, setSavedIds] = useState([])
  const isSaved = (loggedInUser && stay) ? loggedInUser?.saved?.includes(stay?._id) : false

  const rangeForCalendar = {
    from: filterBy.from ? new Date(filterBy.from) : undefined,
    to: filterBy.to ? new Date(filterBy.to) : undefined
  }

  const { ref: photosInViewRef, inView: isPhotosInView } = useInView({
    threshold: 0.1,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [stayId])

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

  function onSetRange(range) {
    dispatch({
      type: SET_FILTER_BY,
      filterBy: { ...filterBy, from: range?.from || null, to: range?.to || null }
    })
  }

  const user = userService.getLoggedinUser()

  async function onSaveHeart(stayId) {
    if (!loggedInUser) return showErrorMsg('Please log in to save')

    const newSavedIds = loggedInUser.saved?.includes(stayId)
      ? loggedInUser.saved.filter(id => id !== stayId)
      : [...(loggedInUser.saved || []), stayId]

    try {
      await updateUser({ ...loggedInUser, saved: newSavedIds })
      showSuccessMsg('Updated successfully')
    } catch (err) {
      showErrorMsg('Could not save')
    }
  }

  //calendar
  const nightsCount = (filterBy.from && filterBy.to)
    ? Math.round((new Date(filterBy.to) - new Date(filterBy.from)) / (1000 * 60 * 60 * 24)) + 1
    : 0

  const nightLabel = nightsCount === 1 ? 'night' : 'nights'


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
              <h1 className='title'>{stay?.name}</h1>
              <div className="right-heading flex">
                <button
                  className='share'
                  onClick={() => setIsShareOpen(true)}>
                  <FiShare />
                  <span className='btn-responsive'>Share</span>
                </button>

                {isShareOpen && (
                  <ShareModal
                    stayId={stayId}
                    onClose={() => setIsShareOpen(false)}
                  />
                )}

                <button className="save" onClick={() => onSaveHeart(stay?._id)}>
                  {isSaved
                    ? <FaHeart style={{ color: '#ff385c' }} />
                    : <FaRegHeart />}
                  <span className='btn-responsive'>Save</span>
                </button>
              </div>
            </div>
            <section ref={photosInViewRef} className="gallery">
              <button className="btn-photos btn-responsive" onClick={OnStayDetailsPhotos}>
                <CgMenuGridO size={16} /> Show all photos
              </button>

              <div className="gallery-main">
                <img src={stay?.imgUrl} alt={stay?.name} className="left-img" onClick={OnStayDetailsPhotos} />
              </div>

              <div className="gallery-side">
                <div><img src={stay?.imgUrls?.[1]} alt={stay?.name} /></div>
                <div><img src={stay?.imgUrls?.[2]} alt={stay?.name} className="top-right" /></div>
                <div><img src={stay?.imgUrls?.[3]} alt={stay?.name} /></div>
                <div><img src={stay?.imgUrls?.[4]} alt={stay?.name} className="bottom-right" /></div>
              </div>
            </section>

            <section className='sides'>
              <section className='big-side'>
                <div className="description">
                  <h2>{stay?.type} {stay?.name}</h2>
                  <p className="guests">{stay?.capacity} guest{stay?.capacity > 1 ? 's' : ''} · {stay.capacity / 2} bedroom{stay.capacity / 2 > 1 ? 's' : ''}</p>
                  <div className="meta-item">
                    <RiStarFill size={10} />
                    <span className='rate'>{stay?.rate} · </span>
                    <span className='reviews-txt'>{stay?.reviews?.length} review {stay?.reviews?.length > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="stay-details-padding">
                  <div className="divider"></div>
                  <p className={`description-p ${isExpanded ? 'expanded' : ''}`}>
                    {stay?.description}
                  </p>

                  <button
                    className="btn-description-more"
                    onClick={() => setIsExpanded(prev => !prev)}
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                </div>

                <section ref={amenitiesRef}>
                  <div className="amenities stay-details-padding">
                    <div className="divider"></div>
                    <h2 className="title-place-offers">What this place offers</h2>

                    {stay?.amenities && (
                      <Amenities
                        amenities={stay.amenities}
                      />
                    )}
                    <div className='divider'></div>
                  </div>

                </section>
                <section className="booking-section">
                  <h3>
                    {Math.max(nightsCount - 1, 0)} {nightLabel} in {stay?.loc.city}
                  </h3>
                  <p>
                    {
                      filterBy.from
                        ? `${new Date(filterBy.from).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })} - ${filterBy.to
                          ? new Date(filterBy.to).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                          : ''
                        }`
                        : 'Add dates'
                    }
                  </p>
                  <div className="calendar-dropdown" onClick={(e) => e.stopPropagation()}>
                    <Calendar months={1} range={rangeForCalendar} setRange={onSetRange} />
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
      <InfoBar className='info-bar' />
      <section className='reviews' ref={reviewsRef}>
        <div className="divider"></div>
        {stay?.reviews?.length > 0 && (
          <Reviews
            reviews={stay.reviews}
          />
        )}
      </section>


    </section>
  )
}