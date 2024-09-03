import React from 'react'
import { Link } from 'react-router-dom'

export default function ManageListings() {
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
          <h2>Manage Listings</h2>
        </div>
        <div className="node_item">
          <h2>Manage Stays Listing</h2>
          <br />
          <Link to="managestayslistings" className="link">Manage all listings</Link>
          <br />
        </div>
        <div className="node_item">
          <h2>Manage Co-Office Spaces</h2>
          <br />
          <Link to="managecooffices" className="link">Manage all listings</Link>
          <br />
        </div>
        <div className="node_item">
          <h2>Manage Airport Pickup Listings</h2>
          <br />
          <Link to="manageairportpickups" className="link">Manage all listings</Link>
        </div>
        <div className="node_item">
          <h2>Manage Car-Rental Listings</h2>
          <br />
          <Link to="managerentals" className="link">Manage all listings</Link>
          <br />
        </div>
      </div>
    </section>
  </>
  )
}
