import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { toast } from "react-toastify";

export default function PersonalInfo() {
  const { user, loading, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  // State to hold form data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    contact_email: '',
    address: ''
  });

  // Populate the form with user details if the user is available
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.interface !== 'partner') {
      navigate("/");
    } else {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        contact_email: user.contact_email || '',
        address: user.address || '',
      });
    }
  }, [user, loading, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Phone number validation
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10,14}$/; // Adjust regex based on your requirements
    return phoneRegex.test(number);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    if (!formData.first_name.trim()) {
      return toast.error('First name cannot be empty');
    }
    if (!formData.last_name.trim()) {
      return toast.error('Last name cannot be empty');
    }
    if (formData.phone_number && !validatePhoneNumber(formData.phone_number)) {
      return toast.error('Invalid phone number format');
    }
    if (!formData.contact_email.trim()) {
      return toast.error('Contact email cannot be empty');
    }
    if (!formData.address.trim()) {
      return toast.error('Address cannot be empty');
    }

    try {
      const response = await axios.put('/updatepartnerdetails', formData);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Details updated successfully!');
        setUser(response.data); // Update user context with new details
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

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
          <h2>Hello {user && <span>{user.first_name}</span>}</h2>
          <p>Manage your booking experience</p>
        </div>
        <section className="form_area">
          <form className='div' onSubmit={handleSubmit}>
            <div className="div">
              <div className="node_item">
                <h2>
                  Personal details <img src="../assets/account.svg" alt="" />
                </h2>
              </div>
              <label htmlFor="first_name">First name</label>
              <br />
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <br />
              <label htmlFor="last_name">Last name</label>
              <br />
              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
              />
              <br />
              <label htmlFor="phone_number">Phone number</label>
              <br />
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone"
                value={formData.phone_number}
                onChange={handleChange}
              />
              <br />
              <label htmlFor="email">Contact email</label>
              <br />
              <input
                type="email"
                name="contact_email"
                placeholder="Contact email"
                value={formData.contact_email}
                onChange={handleChange}
              />
              <br />
              <label htmlFor="address">Address</label>
              <br />
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
              />
              <div className="button_5" onClick={handleSubmit}>
                Update
              </div>
              <br />
            </div>
          </form>
        </section>
      </section>
    </>
  );
}
