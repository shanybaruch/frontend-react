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

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'


export function StayDetails() {

  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const iconMap = {
    "Wifi": <HiOutlineWifi />,
    "Air conditioning": <IoIosSnow />,
    "Kitchen": <TbToolsKitchen2 />,
    "TV": <HiOutlineTv />,
    "Balcony": <TbWindow />
  };

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

  
    const navigate = useNavigate();

    const OnStayDetailsPhotos = () => {
      navigate(`/stay/${stayId}/photos`, { state: stay }); 
    };

  function onSaveHeart(stayId) {
    console.log('save', stayId);

  }

  return (
    <section className="stay-details">
      {stay && <div>

        <div class="heading flex">
          <h1>{stay.name}</h1>
          <div class="right-heading flex">
            <p onClick={() => onSaveHeart(stay._id)}><FaRegHeart /> save</p>
            <p><FiShare /> share</p>
          </div>
        </div>
        <div className="gallery">
          <button class="btn-photos" onClick={OnStayDetailsPhotos}><CgMenuGridO /> Show all photos</button>
          <div className="gallery-main">
            <img src={stay.imgUrl} alt={stay.name} class="left-img" />
          </div>
          <div className="gallery-side">
            <div><img src={stay.imgUrl} alt={stay.name} /></div>
            <div><img src={stay.imgUrl} alt={stay.name} class="top-right" /></div>
            <div><img src={stay.imgUrl} alt={stay.name} /></div>
            <div><img src={stay.imgUrl} alt={stay.name} class="bottom-right" /></div>
          </div>
        </div>
        <div class="description third-page">
          <h2>
            {stay.type} {stay.name}
          </h2>
          <p class="guests">{stay.capacity} guests · {stay.capacity / 2} bedroom</p>
          <h3>
            <div className="meta-item">
              <RiStarFill size={10} />
              {stay.rate} · {stay.reviews.length} reviews

            </div>
          </h3>
        </div>
        <div class="third-page">
          <div className="divider"></div>
          <p class="description-p">{stay.description}</p>
        </div>
        <div className="amenities third-page">
          <div className="divider"></div>
          <h2>What this place offers</h2>
          {stay.amenities && (
            <>
              {(() => {
                const mid = Math.ceil(stay.amenities.length / 2);
                const queue1 = stay.amenities.slice(0, mid);
                const queue2 = stay.amenities.slice(mid);

                return (
                  <div
                    className="amenities-wrapper"
                    style={{ display: "flex", gap: "40px" }}
                  >
                    <div className="queue1">
                      {queue1.map((item, idx) => (
                        <div key={idx} className="amenity-item">
                          {iconMap[item] || null}
                          <span> {item} </span>
                        </div>
                      ))}
                    </div>
                    <div className="queue2">
                      {queue2.map((item, idx) => (
                        <div key={idx} className="amenity-item">
                          {iconMap[item] || null}
                          <span> {item} </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>



        {/* <pre> {JSON.stringify(stay, null, 2)} </pre> */}

      </div>
      }
      <button onClick={() => { onAddStayMsg(stay._id) }}>Add stay msg</button>

    </section >
  )
}