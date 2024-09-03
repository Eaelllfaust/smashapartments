import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from '../../context/userContext'; // Adjust the path as necessary
import { toast } from 'react-toastify';

export default function ProfileSettings() {
  const { user, setUser } = useContext(UserContext);

  return (
    <>
    <div className="shade_2">
      <h1>Our partner</h1>
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
          <h2>Personal information</h2>
          <br />
          <Link to="personalinfo" className="link">
            Edit your personal information
          </Link>
          <br />
        </div>
        <div className="node_item">
          <h2>Payment methods</h2>
          <br />
          <Link to="payoutsettings" className="link">
            Edit payout methods
          </Link>
          <br />
        </div>
      </div>
    </section>
  </>
  
  )
}
