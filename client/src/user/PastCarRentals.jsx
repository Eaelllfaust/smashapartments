import React from 'react'
import { Link } from 'react-router-dom'

export default function PastCarRentals() {
  return (
    <>
    <div className="shade_2">
      <h1>Car rentals</h1>
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
    </section>
    <br />
    <section className="form_area2">
      <div className="ibox2">
        <div className="i3">
          <h2>Past rentals</h2>
          <img src="/assets/time.svg" alt="" />
        </div>
        <p>This is the number of past rentals you have: 1</p>
      </div>
      <div className="info">
        <div className="info_intro">
          <h2>Reon agency</h2>
          <br />
          <br />
          <div className="info_data">
            <div className="info_1">Car name</div>
            <div className="info_2">Mercedez benz</div>
          </div>
          <div className="info_data">
            <div className="info_1">Rental date</div>
            <div className="info_2">28 July - 15 August</div>
          </div>
          <div className="info_data">
            <div className="info_1">Pickup</div>
            <div className="info_2">Abuja location 12</div>
          </div>
          <div className="info_data">
            <div className="info_1">Dropoff</div>
            <div className="info_2">Abuja location 12</div>
          </div>
          <div className="info_data">
            <div className="info_1">Status</div>
            <div className="info_2">Current</div>
          </div>
          <br />
          <br />
          <h3>More info</h3>
          <br />
          <div className="info_data">
            <div className="info_1">Paid</div>
            <div className="info_2">NGN 234,000</div>
          </div>
          <br />
          <br />
          <div className="action">
            <div className="new_btn">Rebook</div>
            <div className="new_btn_2">Review</div>
            <div className="new_btn_2">Extend</div>
          </div>
        </div>
        <div className="info_second">
          <div>
            <img src="/assets/car.jpg" alt="" />
          </div>
          <div className="link">View agency</div>
        </div>
      </div>
      <br />
      <br />
      <div className="contacts">
        <h3>
          Contact driver <i className="bx bx-support" />
        </h3>
        <br />
        <div className="info_data">
          <div className="info_1">Phone</div>
          <div className="info_2">08048589483</div>
        </div>
        <div className="info_data">
          <div className="info_1">Email</div>
          <div className="info_2">host@gmail.com</div>
        </div>
      </div>
    </section>
  </>
  
  )
}
