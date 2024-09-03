import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext'; // Adjust the path as necessary
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageDetails() {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10,14}$/; // Adjust regex based on your requirements
    return phoneRegex.test(number);
  };

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

    try {
      const response = await axios.put('/updateuser', formData);
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
        <h1>Manage account</h1>
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
