import React from 'react'
import { Link } from 'react-router-dom'

export default function ManageUsers() {
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
      <div className="intro_box">
        <div className="ibox">
          <div className="i2">
            <h2>2 Active Users</h2>
            <img src="../assets/check.svg" alt="Check icon" />
          </div>
          <p>There are the number of active users on Smash Apartments</p>
        </div>
        <div className="ibox">
          <div className="i2">
            <h2>5675 Users</h2>
            <img src="../assets/time.svg" alt="Time icon" />
          </div>
          <p>There are the number of users on Smash Apartments</p>
        </div>
      </div>
      <div className="entry_1">
        <h2>Smash Users</h2>
      </div>
      <br />
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by user name or email"
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
            <div className="light-text">Eaelll Faust</div>
          </div>
          <div>
            <div className="title_1">Account Type</div>
            <div className="light-text">Juliet Adams Reserve</div>
          </div>
          <div>
            <div className="title_1">ID</div>
            <div className="light-text">@R56TFYU</div>
          </div>
          <div>
            <div className="title_1">Email</div>
            <div className="light-text">eaelllfaust@gmail.com</div>
          </div>
          <div>
            <div className="title_1">Status</div>
            <div className="light-text">Active</div>
          </div>
          <div>
            <div className="title_1">Join Date</div>
            <div className="light-text">12th - 23rd</div>
          </div>
          <div>
            <div className="title_1">Role</div>
            <div className="light-text">Owerri</div>
          </div>
          <div>
            <div className="title_1">Date</div>
            <div className="light-text">12th - 23rd</div>
          </div>
        </div>
        <br />
        <div className="row_item_2">
          <div><Link to="view" className="btn_9">View</Link></div>
          <div><Link to="edit" className="btn_9">Edit</Link></div>
          <div> <Link to="active" className="btn_9">Active</Link></div>
          <div> <Link to="delete" className="btn_9">Delete</Link></div>
        </div>
      </div>
    </section>
  </>
  )
}
