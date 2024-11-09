import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

export default function ListProperty() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleNext = () => {
        if (!email.trim()) {
            toast.error('Email address is required');
            return;
        }

        navigate('/partnerdetails', {
            state: { email }
        });
    };

    return (
        <>
            <div className="shade_2 df">
                <h1>List your property</h1>
                <p>Over 12,000 properties live</p>
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
                <form className="div">
                    <h2>Create vendor account</h2>
                    <br />
                    <p>
                        Whether hosting is your side passion or full-time job, list your home
                        today and quickly start earning more income.
                    </p>
                    <br />
                    <label htmlFor="email">Email address</label>
                    <br />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="button_5" onClick={handleNext}>
                        Continue with email
                    </div>
                    <Link to="/signin">
                        <div className="button_6">Sign in</div>
                    </Link>
                    <br />
                    <p className="legal_text">
                        By signing in or creating an account, you agree with our&nbsp;Terms
                        &amp; Conditions&nbsp;and&nbsp;Privacy Statement
                    </p>
                </form>
            </section>
            <br />
        </>
    );
}
