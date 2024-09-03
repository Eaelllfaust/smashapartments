import React from 'react'
import { Link } from 'react-router-dom'

export default function Email() {
  return (
    <>
    <div className="shade_2">
      <h1>Administrator</h1>
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
      <section className="form_area form">
        <div className="div">
          <div className="node_item">
            <h2>Email Notifications</h2>
          </div>
          <label htmlFor="audience">Audience</label>
          <br />
          <select name="" id="">
            <option value="ngn">Users</option>
            <option value="usd">Administrators</option>
          </select>
          <br />
          <label htmlFor="text">Email Text</label>
          <br />
          <textarea placeholder="Email text" name="" id="" defaultValue={""} />
          <br />
          <div className="button_5">Send</div>
          <br />
        </div>
      </section>
    </section>
  </>
  )
}
