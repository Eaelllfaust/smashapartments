import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

export default function AddListing() {
  const { user, loading } = useContext(UserContext); // Get the user and loading state from context
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait until loading is complete
    if (!user) {
      navigate("/signin"); // Redirect to sign-in if no user is found
    } else if (user.interface !== 'partner') {
      navigate("/"); // Redirect if the user is not of type 'user'
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
      <section className="form_area_5">
        <div className="div">
          <h2 className="smaller_h2">Add new listing</h2>
          <br />
          <div className="nodes">
            <Link to="addstays">
              <div className="gerald">
                <div className="ger_1">
                  <div>
                    <h3>Stays</h3>
                    <i className="bx bx-chevron-right" />
                  </div>
                  <p>List your apartments, suites e.t.c</p>
                </div>
                <div>
                  <img src="/assets/gerald (4).png" alt="" />
                </div>
              </div>
            </Link>
            <Link to="addcooffice">
              <div className="gerald">
                <div className="ger_1">
                  <div>
                    <h3>Co-office spaces</h3>
                    <i className="bx bx-chevron-right" />
                  </div>
                  <p>List your office spaces</p>
                </div>
                <div>
                  <img src="/assets/gerald (3).png" alt="" />
                </div>
              </div>
            </Link>
            <Link to="addairportpickup">
              <div className="gerald">
                <div className="ger_1">
                  <div>
                    <h3>Airport pickups</h3>
                    <i className="bx bx-chevron-right" />
                  </div>
                  <p>List a ride for pickups</p>
                </div>
                <div>
                  <img src="/assets/gerald (2).png" alt="" />
                </div>
              </div>
            </Link>
            <Link to="addcarrentals">
              <div className="gerald">
                <div className="ger_1">
                  <div>
                    <h3>Car rentals</h3>
                    <i className="bx bx-chevron-right" />
                  </div>
                  <p>List a car for rent</p>
                </div>
                <div>
                  <img src="/assets/gerald (1).png" alt="" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </section>
  </>
)
}
