import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext'; // Adjust the path as necessary
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Add setUser to update user context

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post('/login', { email, password }, { withCredentials: true });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Login successful!');
        setUser(response.data); // Update user context with the logged-in user data
        
        // Redirect based on account_type
        if (response.data.account_type === 'partner') {
          navigate('/partner'); // Redirect to partner page
        } else {
          navigate('/user'); // Redirect to user page
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Welcome back</h1>
        <img src="assets/linear_bg.png" className="shade_bg" alt="" />
        <div className="shade_item">
          <img src="assets/bg (2).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (1).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (4).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (3).png" alt="" />
        </div>
      </div>
      <section className="form_area">
        <form onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <br />
          <p>Sign in to book your property, flight, ride, or office space</p>
          <br />
          <label htmlFor="email">Email address</label>
          <br />
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit" className="button_5 stick">
            Sign in
          </button>
          <br />
        </form>
      </section>
    </>
  );
}
