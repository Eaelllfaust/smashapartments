import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PartnerDetails() {
    const { state } = useLocation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const handleNext = () => {
        if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
            toast.error('All fields are required');
            return;
        }

        if (!/^\d+$/.test(phoneNumber)) {
            toast.error('Phone number must be numeric');
            return;
        }

        navigate('/partnerpassword', {
            state: { 
                ...state,
                firstName,
                lastName,
                phoneNumber
            }
        });
    };

    return (
        <div>
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
                        <h2>Contact details</h2>
                        <br />
                        <p>
                            Your full name and phone number are needed to ensure the security
                            of your Smash apartments account.
                        </p>
                        <br />
                        <label htmlFor="firstname">First name</label>
                        <br />
                        <input
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <br />
                        <label htmlFor="lastname">Last name</label>
                        <br />
                        <input
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <br />
                        <label htmlFor="phone">Phone number</label>
                        <br />
                        <input
                            type="text"
                            placeholder="Phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <div className="button_5" onClick={handleNext}>
                            Next
                        </div>
                        <br />
                        <p className="legal_text">
                            By signing in or creating an account, you agree with
                            our&nbsp;Terms &amp; Conditions&nbsp;and&nbsp;Privacy Statement
                        </p>
                    </div>
                </section>
            </>
        </div>
    );
}
