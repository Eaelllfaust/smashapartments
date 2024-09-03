import React from 'react'
import { Link } from 'react-router-dom'

export default function ManageCooffice() {
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
      <div className="intro_box">
        <div className="ibox">
          <div className="i2">
            <h2>2 active listings</h2>
            <img src="/assets/check.svg" alt="" />
          </div>
          <p>There are 28 active co-office listings on smash apartments</p>
        </div>
        <div className="ibox">
          <div className="i2">
            <h2>13 deactivated listings</h2>
            <img src="/assets/time.svg" alt="" />
          </div>
          <p>There are 13 deactive listings on smash apartments</p>
          <Link to="/administrator/managelistings/deactivatedcooffice" className="link">
            View all inactive listings
          </Link>
        </div>
      </div>
      <div className="entry_1">
        <h2>Active Co-office listings </h2>
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
          <div className="btn_9">Deactivate</div>
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
          <div className="btn_9">Deactivate</div>
          <div className="btn_9">Delete</div>
        </div>
      </div>
    </section>
  </>
  
  )
}
