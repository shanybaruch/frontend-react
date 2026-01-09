import { IoClose } from "react-icons/io5"
import { HiOutlineMail } from "react-icons/hi"

export function LoginModal({ onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <button className="btn-close" onClick={onClose}><IoClose /></button>
                    <span>Log in or sign up</span>
                </header>

                <main className="modal-body">
                    <h2>Welcome to AYS Nest</h2>
                    
                    <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="inputs-container">
                            <div className="input-box top">
                                <label>Country code</label>
                                <select>
                                    <option>Israel (+972)</option>
                                    <option>United States (+1)</option>
                                </select>
                            </div>
                            <div className="input-box bottom">
                                <input type="tel" placeholder="Phone number" />
                            </div>
                        </div>

                        <p className="policy-text">
                            We’ll call or text you to confirm your number. Standard message and data rates apply. 
                            <a href="#">Privacy Policy</a>
                        </p>

                        <button className="btn-continue">Continue</button>
                    </form>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="social-logins">
                        <button className="social-btn">
                            <HiOutlineMail className="icon" />
                            <span>Continue with email</span>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}