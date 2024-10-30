import React from 'react'
import { Link } from 'react-router-dom'
export default function ManageEarnings() {
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
      <h2>Hello</h2>
      <p>Manage your booking experience</p>
    </div>
    <div className="intro_box">
      <div className="ibox">
        <div className="i2">
          <h2>Your total earnings</h2>
          <img src="../assets/check.svg" alt="" />
        </div>
        <p>NGN 20,345,544</p>
      </div>
      <div className="ibox">
        <div className="i2">
          <h2>Pending payments</h2>
          <img src="../assets/time.svg" alt="" />
        </div>
        <p>NGN 349,948</p>
        <Link to="pendingspayments" className="link">
          View pending payments
        </Link>
      </div>
    </div>
    <div className="node_item">
      <Link to="/partner/profilesettings/payoutsettings">
        <h2>
          Payout settings <img src="../assets/preference.svg" alt="" />
        </h2>
      </Link>
    </div>
    <div className="row_item_3">
      <h2>Your earnings</h2>
      <div className="row sy">
        <select className="select" name="" id="">
          <option value="">Dates</option>
          <option value="">Last 24 hours</option>
          <option value="">Last 7 days</option>
          <option value="">Last 14 days</option>
          <option value="">Last 1 month</option>
          <option value="">Last 3 months</option>
          <option value="">Last 6 months</option>
          <option value="">Last 12 months</option>
        </select>
        <select className="select" name="" id="">
          <option value="">Listing types</option>
          <option value="">Stays</option>
          <option value="">Airport pickups</option>
          <option value="">Car rentals</option>
          <option value="">Co-office spaces</option>
        </select>
      </div>
    </div>
  </section>
</>
  )
}
