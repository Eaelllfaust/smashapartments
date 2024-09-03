import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext'; // Adjust the path as necessary
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

export default function Help() {
  const { user, setUser } = useContext(UserContext);
  return (
    <>
    <div className="shade_2">
      <h1>Our partner</h1>
      <img src="../assets/linear_bg.png" className="shade_bg" alt="" />
      <div className="shade_item">
        <img src="../assets/bg (2).png" alt="" />
      </div>
      <div className="shade_item">
        <img src="../assets/bg (1).png" alt="" />
      </div>
      <div className="shade_item">
        <img src="../assets/bg (4).png" alt="" />
      </div>
      <div className="shade_item">
        <img src="../assets/bg (3).png" alt="" />
      </div>
    </div>
    <section className="holder">
      <div className="intro">
      <h2>Hello {user && (<span>{user.first_name}</span>)}</h2>
        <p>Manage your booking experience</p>
      </div>
      <div className="nodes">
        <div className="node_item">
          <h2>FAQS</h2>
          <br />
          <Link to="/faqs" className="link">
            See common questions and answers
          </Link>
          <br />
        </div>
        <div className="node_item">
          <h2>Contact support</h2>
          <br />
          <Link to="/support" className="link">
            Form to submit queries or issues
          </Link>
          <br />
        </div>
        <div className="node_item">
          <h2>Live chat</h2>
          <br />
          <div >
          Click on the chat button on your screen
          </div>
          <br />
        </div>
      </div>
    </section>
  </>
  
  )
}
