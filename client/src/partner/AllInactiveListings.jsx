import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';

export default function AllInactiveListings() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [inactiveListings, setInactiveListings] = useState([]);
  const [activeListings, setActiveListings] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.account_type !== 'partner') {
      navigate("/");
    } else {
      // Fetch active and inactive listings
      const fetchListings = async () => {
        try {
          const activeResponse = await axios.get(`/listings/active/${user._id}`);
          const inactiveResponse = await axios.get(`/listings/inactive/${user._id}`);
          
          setActiveListings(activeResponse.data);
          setInactiveListings(inactiveResponse.data);
        } catch (error) {
          console.error("Error fetching listings:", error);
        }
      };

      fetchListings();
    }
  }, [user, loading, navigate]);

  return (
    <>
      <div className="shade_2">
        <h1>Our partner</h1>
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
              <h2>{activeListings.length} active listings</h2>
              <img src="/assets/check.svg" alt="" />
            </div>
            <p>This is the number of active listings you have.</p>
            <Link to="/partner/managelistings" className="link">
              View all active listings
            </Link>
          </div>
          <div className="ibox">
            <div className="i2">
              <h2>{inactiveListings.length} total inactive listings</h2>
              <img src="/assets/time.svg" alt="" />
            </div>
            <p>This is the number of inactive listings you have.</p>
          </div>
        </div>
        <br />
        <br />
        {inactiveListings.map(listing => (
          <div className="row_item" key={listing._id}>
            <div>
              <img src="/assets/properties (2).png" alt="" />
            </div>
            <div>{listing.property_type}</div>
            <div>{listing.property_name}</div>
            <div>{listing.status}</div>
            <div className="btn_9">Activate</div>
          </div>
        ))}
      </section>
    </>
  );
}
