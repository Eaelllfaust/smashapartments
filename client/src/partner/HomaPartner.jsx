import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';

export default function HomaPartner() {
  const { user, loading } = useContext(UserContext); // Get the user and loading state from context
  const navigate = useNavigate();

  const [activeListings, setActiveListings] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
   
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.interface !== 'partner') {
      navigate("/");
    } else {
      const fetchActiveListings = async () => {
        try {
          const response = await axios.get(`/activelistings/${user._id}`);
          setActiveListings(response.data.totalActiveListings);
        } catch (error) {
          console.error("Error fetching active listings", error);
        }
      };

      const fetchUpcomingBookings = async () => {
        try {
          const response = await axios.get(`/upcomingbookings/${user._id}`);
          setUpcomingBookings(response.data.totalUpcomingBookings);
        } catch (error) {
          console.error("Error fetching upcoming bookings", error);
        }
      };

      const fetchEarnings = async () => {
        try {
          const response = await axios.get(`/earnings/${user._id}`);
          setEarnings(response.data.totalEarnings);
        } catch (error) {
          console.error("Error fetching earnings", error);
        }
      };

      fetchActiveListings();
      fetchUpcomingBookings();
      fetchEarnings();
    }
  }, [user, loading, navigate]);

  return (
    <>
      <div className="shade_2">
        <h1>Our vendor</h1>
        <img src="/assets/linear_bg.png" className="shade_bg" alt="" />
        <div className="shade_item">
          <img src="/assets/bg (2).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (1).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (4).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (3).png" alt="" />
        </div>
      </div>
      <section className="holder">
        <div className="intro">
          <h2>Hello {user && (<span>{user.first_name}</span>)}</h2>
          <p>Manage your booking experience</p>
        </div>
        <div className="intro_box">
          <div className="ibox">
            <div className="i2">
              <h2>{activeListings} active listings</h2>
              <img src="../assets/check.svg" alt="" />
            </div>
            <p>This is the number of active listings you have: {activeListings}</p>
            <Link to="managelistings" className="link">
              View all listings
            </Link>
          </div>
          <div className="ibox">
            <div className="i2">
              <h2>{upcomingBookings} Upcoming bookings</h2>
              <img src="../assets/time.svg" alt="" />
            </div>
            <p>This is the number of upcoming bookings you have.</p>
            <Link to="managebookings" className="link">
              View all bookings
            </Link>
          </div>
          <div className="ibox">
            <div className="i2">
              <h2>Your earnings</h2>
              <img src="../assets/payment.svg" alt="" />
            </div>
            <p>You've made NGN {earnings.toLocaleString()} as our partner</p>
            {/* <Link to="manageearnings" className="link">
              View detailed report
            </Link> */}
          </div>
        </div>
        <div className="nodes">
          <div className="node_item">
            <h2>My listings</h2>
            <br />
            <p>Manage your stays, car rentals, airport and co-office spaces listings.</p>
            <br />
            <Link to="managelistings" className="link">
              Manage all your listings
            </Link>
          </div>
          <div className="node_item">
            <h2>My bookings</h2>
            <br />
            <p>Manage your stays, car rentals, airport and co-office bookings.</p>
            <br />
            <Link to="managebookings" className="link">
              Manage all your bookings
            </Link>
          </div>
          {/* <div className="node_item">
            <h2>
              Earnings <img src="/assets/payment.svg" alt="" />
            </h2>
            <br />
            <p>Summary of total earnings, pending payments, and payment history.</p>
            <br />
            <Link to="manageearnings" className="link">
              Manage payment details
            </Link>
          </div> */}
          {/* <div className="node_item">
            <h2>
              Reviews &amp; ratings <img src="../assets/rating.svg" alt="" />
            </h2>
            <br />
            <p>List of reviews and ratings from customers for each listing.</p>
            <br />
            <Link to="managereviews" className="link">
              Manage reviews and rating
            </Link>
          </div> */}
          <div className="node_item">
            <h2>
              Profile settings <img src="../assets/account.svg" alt="" />
            </h2>
            <br />
            <p>Update your profile information</p>
            <br />
            <Link to="profilesettings" className="link">
              Manage payout details
            </Link>
          </div>
          <div className="node_item">
            <h2>
              Help &amp; support <img src="../assets/help.svg" alt="" />
            </h2>
            <br />
            <p>Get your questions answered, contact our support</p>
            <br />
            <Link to="help" className="link">
              See help and support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
