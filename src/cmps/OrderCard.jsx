import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { SET_ORDER } from '../store/reducers/stay.reducer'
import { Loader } from './Loader'


export function OrderCard() {
    const stay = useSelector(storeState => storeState.stayModule.stay)
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    if (!stay) return <Loader />

    function formatDate(dateStr) {
        if (!dateStr) return 'Add date'
        return new Date(dateStr).toLocaleDateString()
    }

    function getGuestsLabel() {
        const { adults = 0, children = 0, infants = 0 } = filterBy.guests || {}
        const total = adults + children + infants
        if (!total) return 'Add guests'
        return `${total} guest${total > 1 ? 's' : ''}`
    }

    function calculateNights() {
        if (!filterBy.from || !filterBy.to) return 0
        const diffTime = Math.abs(new Date(filterBy.to) - new Date(filterBy.from))
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    function onReserve() {
        const order = {
            hostId: stay.host._id,
            buyer: { _id: 'u101', fullname: 'Guest' },
            totalPrice: totalPrice,
            startDate: filterBy.from,
            endDate: filterBy.to,
            guests: filterBy.guests,
            stay: {
                _id: stay._id,
                name: stay.name,
                price: stay.price,
                imgUrl: stay.imgUrl 
            },
            status: 'pending'
        }
        
        dispatch({ type: SET_ORDER, order })
        navigate(`/order/${stay._id}`)
    }

    const nights = calculateNights()
    const serviceFee = 0
    const staysPrice = nights * stay.price
    const totalPrice = staysPrice + serviceFee

    return (
    <section className="order-card">
        <div className="order-top">
            <div className="order-header">
                <p className="price">
                    {nights > 0 ? (
                        <>
                            <span className="span1">₪{totalPrice}</span>
                            <span className="span2"> for {nights} nights</span>
                        </>
                    ) : (
                        <>
                            <span className="span1">₪{stay.price}</span>
                            <span className="span2"> for night</span>
                        </>
                    )}
                </p>
            </div>

            <div className="order-summary">
                <div className="order-dates">
                    <div className="date-box">
                        <span className="label">CHECK-IN</span>
                        <span className="value">{formatDate(filterBy.from)}</span>
                    </div>
                    <div className="date-box">
                        <span className="label">CHECK-OUT</span>
                        <span className="value">{formatDate(filterBy.to)}</span>
                    </div>
                </div>

                <div className="order-guests">
                    <span className="label">GUESTS</span>
                    <span className="value">{getGuestsLabel()}</span>
                </div>
            </div>

            {/* {nights > 0 && (
                <div className="order-payment">
                    <div className="payment-row">
                        <span>₪{stay.price} × {nights} nights</span>
                        <span>₪{staysPrice}</span>
                    </div>

                    <div className="payment-row">
                        <span>Service fee</span>
                        <span>₪{serviceFee}</span>
                    </div>

                    <hr />

                    <div className="payment-row total">
                        <span>Total</span>
                        <span>₪{totalPrice}</span>
                    </div>
                </div>
            )} */}
        </div>
        <div className="order-bottom">
            <button className="reserve-btn" onClick={onReserve}> Reserve </button>
            <p className="order-note"> You won’t be charged yet </p>
        </div>
    </section>
    )
}