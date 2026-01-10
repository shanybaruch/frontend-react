export function SignupModal() {
    return (
        <section className="signup-modal">
            <main className="modal-body">
                <form className="signup-form">
                    <label>Legal name</label>
                    <section className="sec-name">
                        <input className="input-first-name" type="text" placeholder="First name on ID" />
                        <input type="text" placeholder="Last name on ID" />
                    </section>
                    <p>Make sure this matches the name on your government ID.</p>
                    <section>
                        <label>Date of birth</label>
                        <input className="input-date" type="date" placeholder="Birthdate" />
                        <p>To sign up, you need to be at least 18. Your birthday won’t be shared with other people who use AYS Nest.</p>
                    </section>
                    <label>Contact info</label>
                    <input className="input-email" type="email" placeholder="Email" />
                    <p>We'll email you trip confirmations and receipts.</p>
                    <button className="btn-continue">Agree and continue</button>
                </form>
                <div className="divider"></div>
                <p className="p-notification">
                    AYS Nest will send you members-only deals, inspiration, marketing emails, and push notifications. You can opt out of receiving these at any time in your account settings or directly from the marketing notification.
                </p>
                <section className="sec-checkbox">
                    <input type="checkbox" />
                    <span>I don’t want to receive marketing messages from AYS Nest.</span>
                </section>
            </main>
        </section>
    )
}