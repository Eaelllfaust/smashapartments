import React from 'react'
import { Link } from 'react-router-dom'

export default function ManageStaysBookings() {
  return (
    <>
  <div className="shade_2">
    <h1>Administrator</h1>
    <img src="/assets/linear_bg.png" className="shade_bg" alt="Background pattern" />
    <div className="shade_item">
      <img src="/assets/bg (2).png" alt="Background image 2" />
    </div>
    <div className="shade_item">
      <img src="/assets/bg (1).png" alt="Background image 1" />
    </div>
    <div className="shade_item">
      <img src="/assets/bg (4).png" alt="Background image 4" />
    </div>
    <div className="shade_item">
      <img src="/assets/bg (3).png" alt="Background image 3" />
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
          <h2>2 active bookings</h2>
          <img src="/assets/check.svg" alt="Checkmark icon" />
        </div>
        <p>There are 28 active stays bookings on smash apartments</p>
      </div>
      <div className="ibox">
        <div className="i2">
          <h2>13 legacy bookings</h2>
          <img src="/assets/time.svg" alt="Time icon" />
        </div>
        <p>There are 13 legacy stays bookings on smash apartments</p>
        <Link to="/administrator/managebookings/deactivatedstaysbookings" className="link">
          View all past bookings
        </Link>
      </div>
    </div>
    <div className="entry_1">
      <h2>Active stays bookings </h2>
    </div>
    <br />
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        type="text"
        placeholder="Search by ID, customer name, dates"
        className="search_text"
      />
      <div className="button b2 b3" style={{ borderRadius: 10, height: 50 }}>
        Search
      </div>
    </div>
    <br />
    <br />
    <div className="block_item">
      <div className="row_item_2">
        <div>
          <div className="title_1">Name</div>
          <div className="light-text">Juliet adams reserve</div>
        </div>
        <div>
          <div className="title_1">Customer</div>
          <div className="light-text">Juliet adams reserve</div>
        </div>
        <div>
          <div className="title_1">ID</div>
          <div className="light-text">@R56TFYU</div>
        </div>
        <div>
          <div className="title_1">Status</div>
          <div className="light-text">Active</div>
        </div>
        <div>
          <div className="title_1">Location</div>
          <div className="light-text">Owerri</div>
        </div>
        <div>
          <div className="title_1">Date</div>
          <div className="light-text">12th - 23rd</div>
        </div>
      </div>
      <br />
      <div className="row_item_2">
        <div className="btn_9">View</div> 
        <div className="btn_9">Edit</div>
        <div className="btn_9">Cancel</div>
        <div className="btn_9">Confirm</div>
      </div>
    </div>
  </section>
</>
  )
}
