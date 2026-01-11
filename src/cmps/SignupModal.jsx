import { useNavigate } from "react-router"
import { userService } from "../services/user"
import { signup } from "../store/actions/user.actions"

export function SignupModal({ credentials, setCredentials, onBack }) {
    const navigate = useNavigate()

    function clearState() {
        setCredentials(userService.getEmptyUser())
    }

    function handleChange({ target }) {
        const { name, value, type, checked } = target
        const val = type === 'checkbox' ? checked : value

        setCredentials(prev => ({
            ...prev,
            [name]: val
        }))
    }

    async function onSignup(ev) {
        if (ev) ev.preventDefault()
        if (!credentials.email || !credentials.firstName || !credentials.lastName) {
            console.error('Missing required fields')
            return
        }
        try {
            await signup(credentials)
            navigate('/')
        } catch (err) {
            console.error('Signup failed:', err)
        }
    }

    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() - 18)
    const maxDateString = maxDate.toISOString().split("T")[0]

    return (
        <section className="signup-modal">
            <main className="modal-body">
                <form className="signup-form" onSubmit={onSignup}>
                    <label>Legal name</label>
                    <section className="sec-name">
                        <input
                            type="text"
                            name="firstName"
                            value={credentials.firstName || ''}
                            onChange={handleChange}
                            className="input-first-name"
                            placeholder="First name on ID"
                            required
                        />
                        <input
                            name="lastName"
                            value={credentials.lastName || ''}
                            onChange={handleChange}
                            type="text"
                            placeholder="Last name on ID"
                            required
                        />
                    </section>
                    <p>Make sure this matches the name on your government ID.</p>
                    <section>
                        <label>Date of birth</label>
                        <input
                            name="birthday"
                            max={maxDateString}
                            value={credentials.birthDate || ''}
                            type="date"
                            onChange={handleChange}
                            // onChange={(e) => setCredentials(prev => ({ ...prev, birthDate: e.target.value }))}
                            className="input-date"
                            placeholder="Birthdate"
                            required
                        />
                        <p>To sign up, you need to be at least 18. Your birthday won’t be shared with other people who use AYS Nest.</p>
                    </section>
                    <label>Contact info</label>
                    <input
                        name="email"
                        value={credentials.email || ''}
                        onChange={handleChange}
                        type="email"
                        className="input-email"
                        placeholder="Email"
                        required
                    />
                    <p>We'll email you trip confirmations and receipts.</p>
                    <button className="btn-continue">Agree and continue</button>
                </form>
                <div className="divider"></div>
                <p className="p-notification">
                    AYS Nest will send you members-only deals, inspiration, marketing emails, and push notifications. You can opt out of receiving these at any time in your account settings or directly from the marketing notification.
                </p>
                <section className="sec-checkbox">
                    <input
                        type="checkbox"
                        name="isMarketingOptOut"
                        checked={credentials.isMarketingOptOut || false}
                        onChange={handleChange}
                    />
                    <span>I don’t want to receive marketing messages from AYS Nest.</span>
                </section>
            </main>
        </section>
    )
}