import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Loader } from '../cmps/Loader.jsx'
import { SET_ORDER } from '../store/reducers/stay.reducer'
import { orderService } from '../services/order.service.js'
import { updateUser } from '../store/actions/user.actions.js'

import { FaArrowLeft } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";
import { loadStay } from "../store/actions/stay.actions.js";
import { showSuccessMsg } from "../services/event-bus.service.js";

export function OrderPage() {
    const navigate = useNavigate()
    const { orderId } = useParams()
    const dispatch = useDispatch()

    const stay = useSelector(storeState => storeState.stayModule.stay)
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    const order = useSelector(storeState => storeState.stayModule.currentOrder)
    const user = useSelector(storeState => storeState.userModule.user)

    const [isConfirm, setIsConfirm] = useState(false)
    const [cardNumber, setCardNumber] = useState("5804 3443 9082 1194")
    const [expiry, setExpiry] = useState("11/31")
    const [cvv, setCvv] = useState("142")
    const [zipCode, setZipCode] = useState("5223098")

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        if (orderId && (!stay || stay._id !== orderId)) {
            loadStay(orderId)
        }
    }, [orderId, stay])

    if (!stay) return <Loader />

    function calculateNights() {
        if (!filterBy.from || !filterBy.to) return 1
        const diffTime = Math.abs(new Date(filterBy.to) - new Date(filterBy.from))
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return nights || 1
    }

    const nights = calculateNights()
    const serviceFee = 0
    const totalPrice = (nights * stay?.price) + serviceFee

    function formatDatesRange(from, to) {
        if (!from || !to) return 'Add dates'
        const d1 = new Date(from)
        const d2 = new Date(to)
        const options = { month: 'short', day: 'numeric' }
        const part1 = d1.toLocaleDateString('en-US', options)

        if (d1.getMonth() === d2.getMonth()) {
            return `${part1} – ${d2.getDate()}, ${d1.getFullYear()}`
        } else {
            const part2 = d2.toLocaleDateString('en-US', options)
            return `${part1} – ${part2}, ${d1.getFullYear()}`
        }
    }

    function getGuestsLabel() {
        const { adults = 0, children = 0, infants = 0 } = filterBy.guests || {}
        const total = adults + children + infants
        if (!total) return 'Add guests'
        return `${total} guest${total > 1 ? 's' : ''}`
    }

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

    function handleCardNumberChange(e) {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 16) {
            value = value.slice(0, 16)
        }
        value = value.replace(/(\d{4})(?=\d)/g, "$1 ")
        setCardNumber(value)
    }

    async function onConfirm(e) {
        e.preventDefault()

        const buyer = user ? {
            _id: user._id,
            fullname: user.fullname,
            imgUrl: user.imgUrl
        } : { _id: 'guest', fullname: 'Guest' }

        const orderToSave = {
            ...order,
            buyer,
            totalPrice,
            paymentDetails: { cardNum: cardNumber },
            status: 'pending'
        }

        try {
            const savedOrder = await orderService.save(orderToSave)
            if (user) {
                const userTrips = user.trips ? [...user.trips, savedOrder] : [savedOrder]
                const userToUpdate = { ...user, trips: userTrips }
                await updateUser(userToUpdate)
            }
            setIsConfirm(true)
            dispatch({ type: SET_ORDER, order: null })
            showSuccessMsg('Order confirmed!')
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
                            onChange={handleCardNumberChange}
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
                            <p style={{ fontSize: '.7rem', fontWeight: 'bold' }}>★ {stay.rate}</p>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h5>Dates</h5>
                        <span className="value">{formatDatesRange(filterBy.from, filterBy.to)}</span>
                    </div>

                    <hr />

                    <div>
                        <h5>Guests</h5>
                        <span className="value">{getGuestsLabel()}</span>
                    </div>

                    <hr />

                    <h5>Price details</h5>
                    <div className="payment-row">
                        {nights > 1 ?
                            <span>{nights} nights x ₪{stay.price}</span> :
                            <span>{nights} night x ₪{stay.price}</span>
                        }
                        <span>₪{totalPrice}</span>
                    </div>

                    <hr />

                    <div className="payment-row total">
                        <span>Total<span style={{ textDecoration: 'underline', marginLeft: '4px' }}>ILS</span></span>
                        <span>₪{totalPrice}</span>
                    </div>

                    {isConfirm && (
                        <div className="success-msg">
                            🎉 Reservation success!
                        </div>
                    )}
                </section>
            </div>

        </section>
    )
}