import { useSelector, useDispatch } from 'react-redux'
import { RiStarFill, RiTvLine } from "react-icons/ri";
import { BiLogoFacebookCircle } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";


export function ShareModal({ onClose, stayId }) {
    const stay = useSelector(storeState => storeState.stayModule.stay)
    console.log(stay);

    function onShareFacebook() {
        const url = encodeURIComponent(window.location.href)
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            '_blank',
            'width=600,height=400'
        )
    }

    return (
        <div
            className="share-modal-overlay"
            onClick={onClose}
        >
            <div
                className="share-modal-content"
                onClick={e => e.stopPropagation()}
            >
                <button className='btnX-share-modal' onClick={onClose}>X</button>
                <h1>Share this place</h1>
                <div className="share-modal-header">
                    <img
                        src={stay.imgUrl}
                        alt={stay.name}
                        className="share-modal-img"
                    />
                    <p>
                        {stay.name} <RiStarFill size={10} /> {stay.rate} · {stay.capacity / 2} bedroom{stay.capacity / 2 > 1 ? 's' : ''} · {stay.capacity} beds{stay.capacity > 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    className="btn-share-modal"
                    onClick={() => onShareFacebook(stay._id)}
                >
                    
                    <BiLogoFacebookCircle /> Facebook
                </button>

                <button
                    className="btn-share-modal"
                    onClick={() => {
                        navigator.clipboard.writeText(`https://yourapp.com/stay/${stay._id}`)
                        alert('Link copied!')
                    }}
                >
                    <IoCopy /> Copy Link
                </button>
            </div>
        </div>
    )
}
