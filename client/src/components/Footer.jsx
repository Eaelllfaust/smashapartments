import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Make sure React Toastify is installed and configured

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleJoinNow = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
  
    // Email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
  
    try {
      const response = await axios.post("/subscribe", { email });
  
      if (response.data.message) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  
  

  return (
    <>
      <div className="line" />
      <footer>
        <section className="newsletter">
          <div className="div">
            <h1>Join our newsletter</h1>
            <br />
            <p>
              Discover exceptional properties, reliable car rentals, flexible
              office spaces, and convenient airport pickups tailored to your
              needs—all in one place.
            </p>
            <br />
            <div className="input_news">
              <div className="search_item">
                <input
                  type="text"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="button b2 b3" onClick={handleJoinNow}>
                Join now
              </div>
            </div>
          </div>
        </section>
        <br />
        <section className="footer">
          <div>
            <h2>Offers</h2>
            <Link to="/stays">
              <p>Properties</p>
            </Link>
            <Link to="/cooffice">
              <p>Co-office spaces</p>
            </Link>
            <Link to="/pickups">
              <p>Airport pickups</p>
            </Link>
            <Link to="/rentals">
              <p>Car rentals</p>
            </Link>
          </div>
          <div>
            <h2>Company</h2>
            <Link to="/aboutus">
              <p>About us</p>
            </Link>
            <Link to="/support">
              <p>Contact us</p>
            </Link>
          </div>
          <div>
            <h2>Legal</h2>
            <Link
              target="_blank"
              to="/assets/SMASH APARTMENTS INTO HOTELS TERMS OF USE.pdf"
            >
              <p>Terms of use</p>
            </Link>
            <Link target="_blank" to="/assets/privacy.pdf">
              <p>Privacy policy</p>
            </Link>
            <Link to="/faqs">
              <p>FAQs</p>
            </Link>
          </div>
          <div>
            <h2>Support</h2>
            <p>
              <a href="mailto:hello@smashapartments.com">
                hello@smashapartments.com
              </a>
            </p>
            <p>
              <a href="mailto:support@smashapartments.com">
                support@smashapartments.com
              </a>
            </p>
            <p>
              <a href="tel:+23490974303297">+234 909 7430 3297</a>
            </p>
          </div>
          <div>
            <Link to="/listproperty">
              <div className="button b4">List your property</div>
            </Link>
          </div>
        </section>
        <div className="rights">
          Copyright © 2024–2024 Smashapartments.com™. All rights reserved.
        </div>
        <br />
      </footer>
    </>
  );
}
