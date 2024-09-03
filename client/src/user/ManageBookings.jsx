import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';


export default function ManageBookings() {
  const { user, loading } = useContext(UserContext); // Get the user and loading state from context
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait until loading is complete
    if (!user) {
      navigate("/signin"); // Redirect to sign-in if no user is found
    } else if (user.account_type !== 'user') {
      navigate("/"); // Redirect if the user is not of type 'user'
    }
  }, [user, loading, navigate]);
  return (
    <>
      <div className="shade_2">
        <h1>Bookings</h1>
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
        <div className="nodes">
          <div className="node_item">
            <h2>Stays</h2>
            <br />
            <Link to="currentbookings" className="link">
             See all your bookings
            </Link>
   
          </div>
          <div className="node_item">
            <h2>Car rentals</h2>
            <br />
            <Link to="carrentals" className="link">
              See all your rentals
            </Link>
  
          </div>
          <div className="node_item">
            <h2>Airport pickups</h2>
            <br />
            <Link to="airportpickups" className="link">
             See all your pickups
            </Link>
      
       
          </div>
          <div className="node_item">
            <h2>Co-office spaces</h2>
            <br />
            <Link to="officespaces" className="link">
             See all your reservations
            </Link>
       
          </div>
        </div>
      </section>
    </>
  );
}
