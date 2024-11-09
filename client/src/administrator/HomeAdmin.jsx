import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios"; 

export default function HomeAdmin() {
  const { user, loading } = useContext(UserContext); 
  const navigate = useNavigate();
  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0); 
  
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signinadmin");
    } else if (user.interface !== "admin") {
      navigate("/");
    } else {

      const fetchUpcomingBookings = async () => {
        try {
          const response = await axios.get(`/upcomingbookingsgeneral`);
          setUpcomingBookings(response.data.totalUpcomingBookings);
        } catch (error) {
          console.error("Error fetching upcoming bookings", error);
        }
      };

      const fetchActiveUsers = async () => {
        try {
          const response = await axios.get(`/activeusers`);
          setActiveUsers(response.data.totalActiveUsers);
        } catch (error) {
          console.error("Error fetching active users", error);
        }
      };

      fetchUpcomingBookings();
      fetchActiveUsers();

    }

  }, [user, loading, navigate]);

  return (
    <>
      <div className="shade_2">
        <h1>Administrator</h1>
        <img
          src="../assets/linear_bg.png"
          className="shade_bg"
          alt="Background pattern"
        />
        <div className="shade_item">
          <img src="../assets/bg (2).png" alt="Partner image 1" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (1).png" alt="Partner image 2" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (4).png" alt="Partner image 3" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (3).png" alt="Partner image 4" />
        </div>
      </div>
      <section className="holder">
        <div className="intro">
          <h2>Hello {user && <span>{user.first_name}</span>}</h2>
          <p>Manage Smash Apartments</p>
        </div>
        <div className="intro_box">
          <div className="ibox">
            <div className="i2">
              <h2>{upcomingBookings} Bookings</h2>
              {}
            </div>
            <p>This is the number of current bookings</p>
            <Link to="managebookings" className="link">
              View Bookings
            </Link>
          </div>
          <div className="ibox">
            <div className="i2">
              <h2>{activeUsers} Active Users</h2>
              {}
            </div>
            <p>This is the number of active users on Smash Apartments</p>
          </div>
          <div className="ibox">
            <div className="i2">
              <h2>Pending Tasks</h2>
              <img src="../assets/time.svg" alt="Pending tasks icon" />
            </div>
            <Link to="pendingtasks" className="link">
              View Pending Tasks
            </Link>
          </div>
        </div>
        <div className="nodes">
          <div className="node_item">
            <h2>
              Manage Listings{" "}
              <img className="goto" src="../assets/goto.svg" alt="Go to" />
            </h2>
            <br />
            <p>
              Manage stays, car rentals, airport, and co-office spaces listings.
            </p>
            <br />
            <Link to="managelistings" className="link">
              Manage all listings
            </Link>
          </div>
          <div className="node_item">
            <h2>
              Manage Bookings{" "}
              <img className="goto" src="../assets/goto.svg" alt="Go to" />
            </h2>
            <br />
            <p>
              Manage stays, car rentals, airport, and co-office spaces bookings.
            </p>
            <br />
            <Link to ="managebookings" className="link">
              Manage all your bookings
            </Link>
          </div>
          <div className="node_item">
            <h2>
              Manage Users{" "}
              <img className="goto" src="../assets/goto.svg" alt="Go to" />
            </h2>
            <br />
            <p>Manage all user accounts</p>
            <br />
            <Link to="manageusers" className="link">
              Manage users
            </Link>
          </div>
          <div className="node_item">
            <h2>
              Reports & Analytics{" "}
              <img className="goto" src="../assets/goto.svg" alt="Go to" />
            </h2>
            <br />
            <p>
              See reports about listings and bookings, users, and activities.
            </p>
            <br />
            <Link to="reports" className="link">
              Manage reports
            </Link>
          </div>
          {/* <div className="node_item">
            <h2>
              Settings, Help & Support{" "}
              <img className="goto" src="../assets/goto.svg" alt="Go to" />
            </h2>
            <br />
            <p>Manage your language, currency, and notification settings.</p>
            <br />
            <Link to="settings" className="link">
              Manage settings
            </Link>
          </div> */}
        </div>
      </section>
    </>
  );
}
