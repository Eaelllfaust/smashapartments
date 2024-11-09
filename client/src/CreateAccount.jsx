import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateAccount() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);

    };

    const handleContinue = () => {
        if (!email) {
            toast.error('Email address is required.');
            
        } else if (!validateEmail(email)) {
            toast.error('Invalid email address.');
        } else {
            navigate('/createdetails', { state: { email } });
        }
    };

    return (
        <>
            <div className="shade_2">
                <h1>Create account</h1>
                <img src="assets/linear_bg.png" className="shade_bg" alt="" />
                <div className="shade_item">
                    <img src="assets/bg (2).png" alt="" />
                </div>
                <div className="shade_item">
                    <img src="assets/bg (1).png" alt="" />
                </div>
                <div className="shade_item">
                    <img src="assets/bg (4).png" alt="" />
                </div>
                <div className="shade_item">
                    <img src="assets/bg (3).png" alt="" />
                </div>
            </div>
            <section className="form_area">
                <div className="div">
                    <h2>Sign up</h2>
                    <br />
                    <p>Sign up and book your first property, flight, ride, or office space</p>
                    <br />
                    <label htmlFor="email">Email address</label>
                    <br />
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                    />
                    <div className="button_5" onClick={handleContinue}>
                        Continue with email
                    </div>
                    <div className="or">OR</div>
                    <Link to="/listproperty">
                        <div className="button nj">
                            Sign up as property owner | List your property
                        </div>
                    </Link>
                    <br />
                    <p className="legal_text">
                        By signing in or creating an account, you agree with our&nbsp;Terms
                        &amp; Conditions&nbsp;and&nbsp;Privacy Statement
                    </p>
                </div>
            </section>
        </>
    );
}
