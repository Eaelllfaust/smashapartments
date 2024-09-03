import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios'; // Import axios

export default function HomeUser() {
  const { user, loading } = useContext(UserContext); 
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState({ totalBookings: 0, reservedBookings: 0 });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.account_type !== 'user') {
      navigate("/");
    } else {
      const fetchBookingData = async () => {
        try {
          const response = await axios.get(`/userbookings/${user._id}`);
          setBookingData(response.data);
        } catch (error) {
          console.error("Error fetching booking data", error);
        }
      };
      fetchBookingData();
    }
  }, [user, loading, navigate]);
  
  return (
    <>
      <div className="shade_2">
        <h1>Manage account</h1>
        <img src="../assets/linear_bg.png" className="shade_bg" alt="" />
        <div className="shade_item">
          <img src="../assets/bg (2).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (1).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (4).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (3).png" alt="" />
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
              <h2>{bookingData.totalBookings} Bookings</h2>
              <img src="../assets/check.svg" alt="" />
            </div>
            <p>This is the number of bookings you have</p>
          </div>
          <div className="ibox">
            <div className="i2">
              <h2>{bookingData.reservedBookings} reservations</h2>
              <img src="../assets/time.svg" alt="" />
            </div>
            <p>This is the number of reservations you have.</p>
          </div>
        </div>
        <div className="nodes">
          <div className="node_item">
            <h2>My bookings & reservations</h2>
            <br />
            <p>Manage your stays, car rentals, airport and co-office spaces bookings.</p>
            <br />
            <Link to="managebookings" className="link">
              Manage all your bookings
            </Link>
          </div>
          <div className="node_item">
            <h2>Personal details <img src="../assets/account.svg" alt="" /></h2>
            <br />
            <p>Update your personal information and how it's used.</p>
            <br />
            <Link to ="managedetails" className="link">
              Manage personal details
            </Link>
          </div>
          <div className="node_item">
            <h2>Payment methods <img src="../assets/payment.svg" alt="" /></h2>
            <br />
            <p>Securely add or remove payment methods to make it easier for you to book.</p>
            <br />
            <Link to="managepayment" className="link">
              Manage payment details
            </Link>
          </div>
          <div className="node_item">
            <h2>Preferences <img src="../assets/preference.svg" alt="" /></h2>
            <br />
            <p>Manage your language, currency, and notification settings.</p>
            <br />
            <Link to="preferences" className="link">Manage preferences</Link>
          </div>
        </div>
      </section>
    </>
  );
}
