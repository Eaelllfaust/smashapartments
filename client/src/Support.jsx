import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toastify


export default function Support() {
  const { user, loading } = useContext(UserContext);
  const [complaint, setComplaint] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user && user._id) {
      // You can do something here if needed
    }
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(complaint == ""){
      toast.error("Please fill the form");
      return;
    }
    try {
      const userId = user ? user._id : 'general';
      await axios.post('/complaints', {
        userId,
        complaint
      });
      toast.success('Complaint submitted successfully!');
      setComplaint('');
    } catch (error) {
      toast.error('Error submitting complaint. Please try again.');
      console.error("Error submitting complaint:", error);
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Help center</h1>
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
          <h2>Hello there</h2>
          <p>Manage your booking experience</p>
        </div>
      </section>
      <br />
      <section className="form_area">
        <div className="form div">
          <h1>Help center</h1>
          <br />
          <label htmlFor="text">
            Tell us about any issues you may be experiencing on our platform, and
            any ways you think we can help. You can also reach us at <a href="support@smashapartments.com" className='href'>support@smashapartments.com</a>
          </label>
          <br />
          <br />
          <textarea
            className="textarea"
            placeholder="Enter text here"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          />
          <button className="button b2" type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </section>
    
    </>
  );
}
