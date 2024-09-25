import React from 'react'
import { Link } from 'react-router-dom'

export default function Settings() {
  return (
    <>
    <div className="shade_2">
      <h1>Administrator</h1>
      <img src="../assets/linear_bg.png" className="shade_bg" alt="Background pattern" />
      <div className="shade_item">
        <img src="../assets/bg (2).png" alt="Partner image 1" />
      </div>
      <div className="shade_item">
        <img src="../assets/bg (1).png" alt="Partner image 2" />
      </div>
      <div className="shade_item">
        <img src="../assets/bg (4).png" alt="Partner image 3" />
      </div>
      <div className="shade_item">
        <img src="../assets/bg (3).png" alt="Partner image 4" />
      </div>
    </div>
    <section className="holder">
      <div className="intro">
        <h2>Hello</h2>
        <p>Manage your booking experience</p>
      </div>
      <div className="nodes">
        <div className="intro">
          <h2>Settings, Help & Support</h2>
        </div>
        <div className="node_item">
          <h2>General Settings</h2>
          <br />
          <Link to="generalsettings" className="link">
            Manage
          </Link>
          <br />
        </div>
        <div className="node_item">
          <h2>Email Notifications</h2>
          <br />
          <Link to="email" className="link">
            Manage
          </Link>
          <br />
        </div>
        <div className="node_item">
          <h2>Security</h2>
          <br />
          <Link to="security" className="link">
            Manage
          </Link>
        </div>
        <div className="node_item">
          <h2>View Help Messages</h2>
          <br />
          <Link to="helpmessages" className="link">
            Manage
          </Link>
          <br />
        </div>
      </div>
    </section>
  </>
  )
}
