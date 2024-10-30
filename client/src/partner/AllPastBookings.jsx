import React from 'react'
import { Link } from 'react-router-dom'

export default function AllPastBookings() {
  return (
    <>
  <div className="shade_2">
    <h1>Our vendor</h1>
    <img src="/assets/linear_bg.png" className="shade_bg" alt="Background pattern" />
    <div className="shade_item">
      <img src="/assets/bg (2).png" alt="Partner image 1" />
    </div>
    <div className="shade_item">
      <img src="/assets/bg (1).png" alt="Partner image 2" />
    </div>
    <div className="shade_item">
      <img src="/assets/bg (4).png" alt="Partner image 3" />
    </div>
    <div className="shade_item">
      <img src="/assets/bg (3).png" alt="Partner image 4" />
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
          <h2>2 Upcoming Bookings</h2>
          <img src="/assets/check.svg" alt="Upcoming bookings" />
        </div>
        <p>This is the number of upcoming bookings you have: 2</p>
        <Link to="/partner/managebookings" className="link">
          View Upcoming Bookings
        </Link>
      </div>
      <div className="ibox">
        <div className="i2">
          <h2>Past Bookings</h2>
          <img src="/assets/time.svg" alt="Past bookings" />
        </div>
        <p>View your past bookings.</p>
       
      </div>
    </div>
    <div className="block_item">
      <div className="row_item_2">
        <div>Julian Adams</div>
        <div>12th - 23rd</div>
        <div>Ended</div>
      </div>
      <br />
      <div className="row_item_2">
        <div className="btn_9">View</div> 
        <div className="btn_9">Review</div>
        <div className="btn_9">Resolved</div>
      </div>
    </div>
  </section>
</>

  )
}
