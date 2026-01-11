import { IoClose } from "react-icons/io5"
import { HiOutlineMail } from "react-icons/hi"
import { CgSmartphone } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";

import { useState } from "react"
import { SignupModal } from "./SignupModal";

export function LoginModal({ onClose }) {
    const [countryCode, setCountryCode] = useState('972')
    const [isPhoneOption, setIsPhoneOption] = useState(true)
    const [isNextStep, setIsNextStep] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyUser())

    function handleChange({ target }) {
        const { name, value } = target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    function onContinue(ev) {
        ev.preventDefault()
        setIsNextStep(true)
    }
    
    function onBack(ev) {
        ev.preventDefault()
        setIsNextStep(false)
    }

    function toggleOption() {
        setIsPhoneOption(prev => !prev)
        setCredentials(prev => ({ ...prev, email: '', phone: '' }))
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    {isNextStep ?
                        <button className="btn-back" onClick={onBack} style={{ fontSize: '1.2rem', backgroundColor: 'transparent', margin: 0 }}><IoIosArrowBack /> </button>
                        : <button className="btn-close" onClick={onClose}><IoClose /></button>
                    }
                    {isNextStep ? <span>Finish signing up</span> : <span>Log in or sign up</span>}
                </header>

                {isNextStep ?
                    <SignupModal
                        credentials={credentials}
                        setCredentials={setCredentials}
                        onBack={onBack}
                    /> :
                    <main className="modal-body">
                        <h2>Welcome to AYS Nest</h2>

                        <form className="login-form" onSubmit={onContinue}>
                            <div className="inputs-container">
                                {isPhoneOption ?
                                    <section>
                                        <div className="input-box top">
                                            <label>Country code</label>
                                            <select
                                                value={countryCode}
                                                onChange={(e) => setCountryCode(e.target.value)}>
                                                <option value='972'>Israel (+972)</option>
                                            </select>
                                        </div>
                                        <div className="input-box bottom">
                                            <label>Phone number</label>
                                            <section>
                                                <span>+{countryCode}</span>
                                                <input
                                                    type="tel"
                                                    required
                                                    name="phone"
                                                    onChange={handleChange}
                                                    value={credentials.phone || ''} />
                                            </section>
                                        </div>
                                    </section>
                                    : <section>
                                        <div className="input-box top">
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                required
                                                name="email"
                                                value={credentials.email || ''}
                                                onChange={handleChange} />
                                        </div>
                                    </section>
                                }
                            </div>

                            <p className="policy-text">
                                We’ll call or text you to confirm your number. Standard message and data rates apply.
                                <a href="https://www.airbnb.com/help/article/2855">Privacy Policy</a>
                            </p>

                            <button
                                type="submit"
                                className="btn-continue"
                            >Continue</button>
                        </form>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <div className="social-logins">
                            <button className="social-btn">
                                {isPhoneOption ?
                                    <span onClick={toggleOption}>
                                        <HiOutlineMail className="icon" />
                                        Continue with email
                                    </span>
                                    :
                                    <span onClick={toggleOption}>
                                        <CgSmartphone className="icon" />
                                        Continue with Phone
                                    </span>
                                }
                            </button>
                        </div>
                    </main>
                }
            </div>
        </div>
    )
}