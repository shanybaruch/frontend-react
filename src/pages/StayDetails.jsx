import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RiStarFill, RiTvLine } from "react-icons/ri";
import { HiOutlineTv } from "react-icons/hi2";
import { HiOutlineWifi } from "react-icons/hi";
import { IoIosSnow } from "react-icons/io";
import { TbToolsKitchen2, TbWindow } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { CgMenuGridO } from "react-icons/cg";
import { useLocation } from 'react-router-dom'


import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'
import { Calendar } from '../cmps/Calendar';


export function StayDetails() {
  const { stayId } = useParams()
  const navigate = useNavigate()
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const location = useLocation()
  const order = location.state?.order


  const iconMap = {
    "Wifi": <HiOutlineWifi />,
    "Air conditioning": <IoIosSnow />,
    "Kitchen": <TbToolsKitchen2 />,
    "TV": <HiOutlineTv />,
    "Balcony": <TbWindow />
  }

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  async function onAddStayMsg(stayId) {
    try {
      await addStayMsg(stayId, 'bla bla ' + parseInt(Math.random() * 10))
      showSuccessMsg(`Stay msg added`)
    } catch (err) {
      showErrorMsg('Cannot add stay msg')
    }
  }

  const OnStayDetailsPhotos = () => {
    navigate(`/stay/${stayId}/photos`, { state: stay });
  };

  function onSaveHeart(stayId) {
    console.log('save', stayId);

  }

  return (
    <section className="stay-details">
      {stay && <div>
        <div className="heading flex">
          <h1 className='title'>{stay.name}</h1>
          <div className="right-heading flex">
            <button className='share' >
              <FiShare />
              <span>Share</span>
            </button>
            <button className='save' onClick={() => onSaveHeart(stay._id)}>
              <FaRegHeart />
              <span>Save</span>
            </button>
          </div>
        </div>

        <div className="gallery">
          <button className="btn-photos" onClick={OnStayDetailsPhotos}><CgMenuGridO /> Show all photos</button>
          <div className="gallery-main">
            <img src={stay.imgUrl} alt={stay.name} className="left-img" />
          </div>

          <div className="gallery-side">
            <div><img src={stay.imgUrl} alt={stay.name} /></div>
            <div><img src={stay.imgUrl} alt={stay.name} className="top-right" /></div>
            <div><img src={stay.imgUrl} alt={stay.name} /></div>
            <div><img src={stay.imgUrl} alt={stay.name} className="bottom-right" /></div>
          </div>
        </div>

        <section className='sides'>
          <section className='big-side'>
            <div className="description">
              <h2> {stay.type} {stay.name} </h2>
              <p className="guests">{stay.capacity} guests · {stay.capacity / 2} bedroom</p>
              <div className="meta-item">
                <RiStarFill size={10} />
                <span className='rate'> {stay.rate} · </span>
                <span className='reviews'>{stay.reviews.length} reviews </span>
              </div>
            </div>

            <div className="">
              <div className="divider"></div>
              <p className="description-p">{stay.description}</p>
            </div>

            <div className="amenities">
              <div className="divider"></div>
              <h2 className='title-place-offers'>What this place offers</h2>
              {stay.amenities && (
                <ul className="amenities">
                  {stay.amenities.map((item, idx) => (
                    <li key={idx} className='amenity-item'>
                      {iconMap[item] || null}
                      <span> {item} </span>
                    </li>)
                  )}
                </ul>)}
            </div>

          </section>

          <section className='small-side'>

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
              
              <button className="reserve-btn"> Reserve </button>
              
              <p className="order-note"> You won’t be charged yet </p> 
            </section>
          </section>

        </section>

      </div>
      }
      <button onClick={() => { onAddStayMsg(stay._id) }}>Add stay msg</button>
    </section >
  )
}