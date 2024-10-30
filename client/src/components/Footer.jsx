import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Footer() {
  const [email, setEmail] = useState("");
  const handleJoinNow = async () => {

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

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
        <br/>
        <section className="footer">
          <div className="flexer">
            <div className="download_btn">
              <img src="/assets/getoneplaystore.png" alt="" />
            </div>
            <div className="download_btn">
              <img src="/assets/getoneappstore.png" alt="" />
            </div>
          </div>
          <div>
            <h2>Offers</h2>
            <Link to="/stays" className="link lnk">
              <p>Properties</p>
            </Link>
            <Link to="/cooffice" className="link lnk">
              <p>Co-office spaces</p>
            </Link>
            <Link className="lnk" to="/pickups">
              <p>Airport pickups</p>
            </Link>
            <Link className="lnk" to="/rentals">
              <p>Car rentals</p>
            </Link>
          </div>
          <div>
            <h2>Company</h2>
            <Link className="lnk" to="/aboutus">
              <p>About us</p>
            </Link>
            <Link className="lnk" to="/support">
              <p>Contact us</p>
            </Link>
            <a href="https://www.instagram.com/smashapartments?igsh=NjRveHcwNTY4NHZ0">
                <img src="/assets/mdi_instagram.svg" alt="" />
              </a>
          </div>
          <div>
            <h2>Legal</h2>
            <Link
              className="lnk"
              to="termsofuse"
            >
              <p>Terms of use</p>
            </Link>
            <Link className="lnk"  to="privacypolicy">
              <p>Privacy policy</p>
            </Link>
            <Link className="lnk" to="/faqs">
              <p>FAQs</p>
            </Link>
          </div>
          <div>
            <h2>Support</h2>
            <p>
              <a className="lnk" href="mailto:hello@smashapartments.com">
                hello@smashapartments.com
              </a>
            </p>
            <p>
              <a className="lnk" href="mailto:support@smashapartments.com">
                support@smashapartments.com
              </a>
            </p>
            <p>
              <a className="lnk" href="tel:+23490974303297">
                +234 909 7430 3297
              </a>
            </p>
            <Link to="/listproperty" className="only">
              <div className="button b4">List your property</div>
            </Link>
          </div>
          {/* <div>
            <h2>Social media</h2>
            <p className="sm_things">
             
              <a href="">
                <img src="/assets/flowbite_x-solid.svg" alt="" />
              </a>
              <a href="">
                <img src="/assets/facebook.svg" alt="" />
              </a>
            </p>
          </div> */}
       
        </section>
        <div className="rights">
          Copyright © 2024–2024 Smashapartments.com™. All rights reserved.
        </div>
        <br />
      </footer>
    </>
  );
}
