import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Loader } from '../cmps/Loader.jsx'

import { FaArrowLeft } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";
import { loadStay } from "../store/actions/stay.actions.js";

export function OrderPage() {
    const navigate = useNavigate()
    const { stayId } = useParams()
    const dispatch = useDispatch()

    const stay = useSelector(storeState => storeState.stayModule.stay)
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    const order = useSelector(storeState => storeState.stayModule.currentOrder)

    const [isConfirm, setIsConfirm] = useState(false)
    const [cardNumber, setCardNumber] = useState("1111111111111111")
    const [expiry, setExpiry] = useState("11/35")
    const [cvv, setCvv] = useState("111")
    const [zipCode, setZipCode] = useState("1234567")

    useEffect(() => {
        if (!stay && stayId) {
            loadStay(stayId)
        }
    }, [stayId])

    if (!stay) return <Loader />

    console.log('stay: ', stay);
    console.log('filterBy: ', filterBy)

    function calculateNights() {
        if (!filterBy.from || !filterBy.to) return 1
        const diffTime = Math.abs(new Date(filterBy.to) - new Date(filterBy.from))
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return nights || 1
    }

    const nights = calculateNights()
    const serviceFee = 0
    const totalPrice = (nights * stay?.price) + serviceFee

    function handleExpiryChange(e) {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length >= 2) {
            const month = parseInt(value.slice(0, 2))
            if (month > 12) value = "12" + value.slice(2)
            if (month === 0) value = "01" + value.slice(2)
        }
        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4)
        }
        setExpiry(value)
    }

    async function onConfirm(e) {
        e.preventDefault()

        const orderToSave = {
            ...order,
            totalPrice,
            paymentDetails: { cardNum: cardDetails.number },
            status: 'pending'
        }

        try {
            await orderService.save(orderToSave)
            setIsConfirm(true)
            dispatch({ type: SET_ORDER, order: null })
        } catch (err) {
            console.error('Failed to save order', err)
        }
    }

    return (
        <section className="order-page">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <FaArrowLeft />
            </button>

            <header>
                <h1>Confirm and pay</h1>
            </header>

            <div className="order-content">
                <form className="form-pay" onSubmit={onConfirm}>
                    <section className="card">
                        <h3>Add a payment method</h3>
                        <p><FaCreditCard /><span>Credit or debit card</span></p>
                    </section>
                    <div className="card-details">
                        <input
                            type="tel"
                            className="card-name"
                            placeholder="Card number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            inputMode="numeric"
                            maxLength="19"
                            required
                        />
                        <div>
                            <input
                                type="text"
                                className="validity"
                                value={expiry}
                                onChange={handleExpiryChange}
                                placeholder="MM / YY"
                                pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                                maxLength="5"
                                required
                            />
                            <input
                                type="number"
                                min={100}
                                max={999}
                                placeholder="CVV"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                maxLength="4"
                                required
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        className="zip-code"
                        placeholder="Zip code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        inputMode="numeric"
                        required
                    />
                    <section className="bottom">
                        <select
                            name="country"
                            placeholder="Country/region"
                            id=""
                        >
                            <option value="israel" default>Israel</option>
                            <option value="USA">USA</option>
                        </select>
                        <img src="" alt="" />
                        <button type="submit">Next</button>
                    </section>
                </form>

                <section className="order-summary">
                    <div className="stay-preview-info">
                        <img src={stay.imgUrl} alt={stay.name} />
                        <div>
                            <p style={{ fontWeight: 'bold', margin: 0 }}>{stay.name}</p>
                            <p style={{ fontSize: '14px' }}>★ {stay.rate}</p>
                        </div>
                    </div>

                    <hr />

                    <h5>Price details</h5>
                    <div className="payment-row">
                        {/* <span>₪{stay.price * nights}</span> */}
                        {nights > 1 ?
                            <span>{nights} nights x ₪{stay.price}</span> :
                            <span>{nights} night x ₪{stay.price}</span>
                        }
                    </div>
                    <div className="payment-row total" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '10px' }}>
                        <span>Total (ILS)</span>
                        <span>₪{totalPrice}</span>
                    </div>

                    {isConfirm && (
                        <div className="success-msg" style={{ marginTop: '20px', color: 'green', fontWeight: 'bold' }}>
                            🎉 Reservation success!
                        </div>
                    )}
                </section>
            </div>

        </section>
    )
}