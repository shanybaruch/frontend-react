import { useSelector } from 'react-redux'


export function OrderCard(){
    const stay = useSelector(storeState => storeState.stayModule.stay)

    return (
        <section className="order-card">
            <div className="order-header">
                <p className="price">
                    ₪{stay.price}/ night
                </p>
                
                <div className="order-rating">
                    <span className="rate">{stay.rate}</span>
                    <span className="reviews">· {stay.reviews.length} reviews</span>
                </div>
            </div>
            
            <div className="order-summary">
                <div className="order-dates">
                    <div className="date-box">
                        <span className="label">CHECK-IN</span>
                        <span className="value">Add date</span>
                    </div>
                    <div className="date-box">
                        <span className="label">CHECK-OUT</span>
                        <span className="value">Add date</span>
                    </div>
                </div>
                
                <div className="order-guests">
                    <span className="label">GUESTS</span>
                    <span className="value">Add guests</span>
                </div>
            </div>

           <div className="order-payment">
            <div className="payment-row">
                <span >₪26 × 7 nights</span>
                <span>₪182</span>
                </div>
                
                <div className="payment-row">
                    <span >Service fee</span>
                    <span>₪78</span>
                </div>

                <hr></hr>
                
                <div className="payment-row total">
                    <span>Total</span>
                    <span>₪260</span>
                </div>
            </div>

            
            <button className="reserve-btn" onClick={() => navigate('order')}> Reserve </button>
            <p className="order-note"> You won’t be charged yet </p>
        </section>
    )
}