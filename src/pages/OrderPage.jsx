import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";

import { useNavigate } from "react-router";

export function OrderPage() {
    const navigate = useNavigate()
    const [expiry, setExpiry] = useState("")

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

    function onNext() { 
    }

    return (
        <section className="order-page">
            <header>
                <button onClick={() => navigate(-1)}><FaArrowLeft /></button>
                <h1>Confirm and pay</h1>
            </header>
            <section className="form-pay" onSubmit={onNext}>
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
                    <input type="tel" className="card-name" placeholder="Card number" inputMode="numeric" maxLength="19" required />
                    <div>
                        <input type="text" className="validity" value={expiry} onChange={handleExpiryChange} placeholder="MM / YY" pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                            maxLength="5" required />
                        <input type="number" min={100} max={999} placeholder="CVV" maxLength="4" required />
                    </div>
                </div>
                <input type="text" className="zip-code" placeholder="Zip code" inputMode="numeric" required />
                <section className="bottom">
                    <select name="country" placeholder="Country/region" id="">
                        <option value="israel" default>Israel</option>
                        <option value="USA">USA</option>
                    </select>
                    <img src="" alt="" />
                    <button>Next</button>
                </section>
            </section>
            <section className="order-details">
                <h2></h2>

            </section>
        </section>
    )
}