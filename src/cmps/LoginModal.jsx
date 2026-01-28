import { IoClose } from "react-icons/io5"
import { HiOutlineMail } from "react-icons/hi"
import { CgSmartphone } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";

import { useState } from "react"
import { SignupModal } from "./SignupModal";
import { userService } from "../services/user";
import { login } from "../store/actions/user.actions";
import { storageService } from "../services/async-storage.service";

export function LoginModal({ onClose }) {
    const [countryCode, setCountryCode] = useState('972')
    const [isPhoneOption, setIsPhoneOption] = useState(true)
    const [isNextStep, setIsNextStep] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const [isLoading, setIsLoading] = useState(false)
    const [isSignup, setIsSignup] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const [password, setPassword] = useState('')

    function handleChange({ target }) {
        const { name, value } = target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    //local storage
    // async function onContinue(ev) {
    //     ev.preventDefault()
    //     setIsLoading(true)
    //     try {
    //         const users = await storageService.query('user')
    //         const user = users.find(u =>
    //             (credentials.email && u.email === credentials.email) ||
    //             (credentials.phone && u.phone === credentials.phone)
    //         )
    //         if (user) {
    //             console.log('User exists, logging in...', user)
    //             await login(user)
    //             onClose()
    //         } else {
    //             setIsNextStep(true)
    //         }
    //     } catch (err) {
    //         console.error('Had issues checking user', err)
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    async function onContinue(ev) {
        ev.preventDefault()
        setIsLoading(true)
        const identifier = isPhoneOption ? credentials.phone : credentials.email
        try {
            const res = await userService.checkUserExists(identifier)
            if (res && res.exists) {
                setIsLogin(true)
                setIsSignup(false)
            } else {
                setIsSignup(true)
                setIsLogin(false)
            }
            setIsNextStep(true)
        } catch (err) {
            console.error('Error in checking user', err)
        } finally {
            setIsLoading(false)
        }
    }

    function onBack(ev) {
        ev.preventDefault()
        setIsNextStep(false)
    }

    function toggleOption() {
        setIsPhoneOption(prev => !prev)
        setCredentials(prev => ({ ...prev, email: '', phone: '' }))
    }

    async function onLogin(ev) {
        ev.preventDefault()
        try {
            await login({ ...credentials, password })
            onClose()
            showSuccessMsg('Welcome back!')
        } catch (err) {
            showErrorMsg('Invalid password, please try again')
        }
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
                        isSignup={isSignup}
                        onBack={onBack}
                        onClose={onClose}
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

                            {isNextStep ? (
                                isSignup ? (
                                    <SignupModal
                                        credentials={credentials}
                                        setCredentials={setCredentials}
                                        onBack={onBack}
                                        onClose={onClose}
                                    />
                                ) : (
                                    <main className="modal-body">
                                        <form className="login-form" onSubmit={onLogin}>
                                            <div className="input-box">
                                                <label>Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            <button type="submit" className="btn-continue">Log in</button>
                                        </form>
                                    </main>
                                )
                            ) : (
                                <main className="modal-body">...</main>
                            )}

                            <button
                                type="submit"
                                className="btn-continue"
                            >{isLoading ? 'Checking...' : 'Continue'}</button>
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