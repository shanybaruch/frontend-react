import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";

import { useNavigate } from "react-router";

export function OrderPage() {
    const navigate = useNavigate()
    const [isConfirm, setIsConfirm] = useState(false)
    const [cardNumber, setCardNumber] = useState("1111111111111111");
    const [expiry, setExpiry] = useState("11/35")
    const [cvv, setCvv] = useState("111");
    const [zipCode, setZipCode] = useState("1234567");

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

    function onConfirm(e) {
        e.preventDefault()
        setIsConfirm(true)
    }

    return (
        <section className="order-page">
            <header>
                <button onClick={() => navigate(-1)}>
                    <FaArrowLeft />
                </button>
                <h1>Confirm and pay</h1>
            </header>
            <form className="form-pay" onSubmit={onConfirm}>
                <section className="card">
                    <h3>Add a payment method</h3>
                    <p>
                        <FaCreditCard />
                        <span>
                            Credit or debit card
                        </span>
                    </p>
                </section>
                <div className="card-details">
                    <input
                        type="tel"
                        className="card-name"
                        placeholder="Card number"
                        value={cardNumber}
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
                    <button type="submit">Confirm</button>
                </section>
            </form>
            <section className="order-details">
                {isConfirm &&
                    <h2>Reservation success!</h2>
                }
            </section>
        </section>
    )
}