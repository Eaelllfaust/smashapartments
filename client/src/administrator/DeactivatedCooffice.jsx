import React from 'react'
import { Link } from 'react-router-dom'

export default function DeactivatedCooffice() {
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
      <h2>Hello {user && (<span>{user.first_name}</span>)}</h2>
        <p>Manage your booking experience</p>
      </div>
      <div className="intro_box">
        <div className="ibox">
          <div className="i2">
            <h2>2 active listings</h2>
            <img src="/assets/check.svg" alt="" />
          </div>
          <p>There are 2 active cooffice listings on smash apartments</p>
          <Link to="/administrator/managelistings/managecooffices" className="link">
            View active listings
          </Link>
        </div>
        <div className="ibox">
          <div className="i2">
            <h2>13 deactivated listings</h2>
            <img src="../assets/time.svg" alt="" />
          </div>
          <p>There are 13 active listings on smash apartments</p>
        </div>
      </div>
      <div className="entry_1">
        <h2>Deactivated cooffice listings</h2>
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
            <div className="light-text">12th -23th</div>
          </div>
        </div>
        <br />
        <div className="row_item_2">
          <div className="btn_9">View</div> <div className="btn_9">Edit</div>{" "}
          <div className="btn_9">Reactivate</div>
          <div className="btn_9">Delete</div>
        </div>
      </div>
      <div className="block_item">
        <div className="row_item_2">
          <div>
            <div className="title_1">Name</div>
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
            <div className="light-text">12th -23th</div>
          </div>
        </div>
        <br />
        <div className="row_item_2">
          <div className="btn_9">View</div> <div className="btn_9">Edit</div>{" "}
          <div className="btn_9">Reactivate</div>
          <div className="btn_9">Delete</div>
        </div>
      </div>
    </section>
  </>
  
  )
}
