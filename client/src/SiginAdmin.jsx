import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

export default function SigninAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext); 
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has('admin')) {
      navigate('/administrator'); 
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post('/loginadmin', { email, password }, { withCredentials: true });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Login successful!');
        setUser(response.data); 
        
        if (response.data.email) {
            window.location.href = "/signinadmin?admin";
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
        <h1>Admin signin</h1>
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
          <h2>Sigin</h2>
          <br />
          <p>The smashapartments.com management entry. Sign in continue.</p>
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
          <br />
          <button type="submit" className="button_5 stick">
            Proceed as administrator
          </button>
          <br />
        </form>
      </section>
    </>
  );
}
