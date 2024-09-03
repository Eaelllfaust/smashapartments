import React from 'react'
import { Link } from 'react-router-dom'

export default function ManageReports() {
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
      <h2>Hello</h2>
      <p>Manage your booking experience</p>
    </div>
    <div className="intro_box">
      <div className="ibox">
        <div className="i2">
          <h2>Revenue</h2>
          <img src="/assets/check.svg" alt="" />
        </div>
        <p>NGN 20,345,544</p>
        <a href="" className="link">
          Export total revenue report
        </a>
      </div>
    </div>
    <div className="node_item" style={{ marginBottom: "10px !important" }}>
      <a href="payout-settings.html">
        <h2>
          Generate reports <img src="/assets/report.svg" alt="" />
        </h2>
      </a>
    </div>
    <div className="row_item_3">
      <h2>Analytics</h2>
      <div className="row sy">
        <select className="select" name="" id="">
          <option value="">User analytics</option>
          <option value="">Listing performance</option>
        </select>
      </div>
    </div>
  </section>
</>

  )
}
