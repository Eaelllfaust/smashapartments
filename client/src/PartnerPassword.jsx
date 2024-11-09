import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PartnerPassword() {
    const { state } = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password.trim() || !confirmPassword.trim()) {
            toast.error('Both password fields are required');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 10) {
            toast.error('Password must be at least 10 characters long');
            return;
        }

        const { email, firstName, lastName, phoneNumber } = state;

        try {
            const response = await axios.post('/createpartner', {
                email,
                firstName,
                lastName,
                phoneNumber,
                password
            });

            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                toast.success(response.data.message);
                navigate('/authme'); 
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
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
                <div className="div">
                    <h2>Create password</h2>
                    <br />
                    <p>
                        Use a minimum of 10 characters, including uppercase letters, lowercase
                        letters, and numbers.
                    </p>
                    <br />
                    <label htmlFor="password">Password</label>
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <br />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <div className="button_5" onClick={handleSubmit}>
                        Create account
                    </div>
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
