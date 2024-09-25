import React from 'react'
import { Link } from 'react-router-dom'

export default function GeneralSettings() {
  return (
    <>
    <div className="shade_2">
      <h1>Administrator</h1>
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
      <section className="form_area form">
        <div className="div">
          <div className="node_item">
            <h2>General settings</h2>
          </div>
          <label htmlFor="first_name">Currency</label>
          <br />
          <select name="" id="">
            <option value="ngn">Naira</option>
            <option value="usd">United states dollar</option>
          </select>
          <br />
          <label htmlFor="last_name">Language</label>
          <br />
          <select name="" id="">
            <option value="eng">English</option>
            <option value="frc">French</option>
          </select>
          <br />
          <label htmlFor="timezone">Timezone</label>
          <br />
          <select name="" id="">
            <option value="eng">West african</option>
            <option value="frc">North american</option>
          </select>
          <div className="button_5">Update</div>
          <br />
        </div>
      </section>
    </section>
  </>
  
  )
}
