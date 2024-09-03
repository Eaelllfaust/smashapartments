import React from 'react'
import { Link } from 'react-router-dom'

export default function ManageReviews() {
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
      <h2>Hello</h2>
      <p>Manage your booking experience</p>
    </div>
    <div className="row_item_3 ">
      <h2>Reviews</h2>
      <div className="row sy">
        <select className="select" name="" id="">
          <option value="">Order by</option>
          <option value="">Ascending</option>
          <option value="">Descending</option>
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
    <div className="block_item">
      <div className="row_item_2">
        <div>Customer 1</div>
        <div>Julian Adams</div>
        <div>Airport Pickups</div>
      </div>
      <br />
      <div className="row_item_2">
        <div className="btn_9">View</div>
        <div className="btn_9">Respond</div>
      </div>
    </div>
  </section>
</>
  )
}
