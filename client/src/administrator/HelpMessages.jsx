import React from 'react'
import { Link } from 'react-router-dom'

export default function HelpMessages() {
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
          <h2>28 unread messages</h2>
          <img src="../assets/check.svg" alt="" />
        </div>
        <p>
          There are the number of unread message from the users on smash
          apartments
        </p>
      </div>
    </div>
    <div className="entry_1">
      <h2>All messages</h2>
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
          <div className="light-text">Juliet adams reserve</div>
        </div>
        <div>
          <div className="title_1">Account type</div>
          <div className="light-text">Customer</div>
        </div>
        <div>
          <div className="title_1">ID</div>
          <div className="light-text">@R56TFYU</div>
        </div>
        <div>
          <div className="title_1">Email</div>
          <div className="light-text">james@gmail.com</div>
        </div>
        <div>
          <div className="title_1">Status</div>
          <div className="light-text">Pending</div>
        </div>
        <div>
          <div className="title_1">Date</div>
          <div className="light-text">12th -23th</div>
        </div>
      </div>
      <br />
      <p className="overdo">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque nam
        eveniet doloremque nobis quam nulla error blanditiis. Harum magnam
        ratione maxime doloribus odit itaque rem id error? Placeat, atque quod!
        Vitae molestiae voluptatem accusantium, expedita voluptate quas
        reprehenderit? Minus voluptatibus dignissimos commodi ad voluptates quis
        eum, facilis tempora doloremque vero.
      </p>
      <br />
      <div className="row_item_2">
        <div className="btn_9">View</div> <div className="btn_9">Respond</div>
      </div>
    </div>
    <div className="block_item">
      <div className="row_item_2">
        <div>
          <div className="title_1">Name</div>
          <div className="light-text">Juliet adams reserve</div>
        </div>
        <div>
          <div className="title_1">Account type</div>
          <div className="light-text">Customer</div>
        </div>
        <div>
          <div className="title_1">ID</div>
          <div className="light-text">@R56TFYU</div>
        </div>
        <div>
          <div className="title_1">Email</div>
          <div className="light-text">james@gmail.com</div>
        </div>
        <div>
          <div className="title_1">Status</div>
          <div className="light-text">Pending</div>
        </div>
        <div>
          <div className="title_1">Date</div>
          <div className="light-text">12th -23th</div>
        </div>
      </div>
      <br />
      <p className="overdo">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque nam
        eveniet doloremque nobis quam nulla error blanditiis. Harum magnam
        ratione maxime doloribus odit itaque rem id error? Placeat, atque quod!
        Vitae molestiae voluptatem accusantium, expedita voluptate quas
        reprehenderit? Minus voluptatibus dignissimos commodi ad voluptates quis
        eum, facilis tempora doloremque vero.
      </p>
      <br />
      <div className="row_item_2">
        <div className="btn_9">View</div> <div className="btn_9">Respond</div>
      </div>
    </div>
  </section>
</>

  )
}
