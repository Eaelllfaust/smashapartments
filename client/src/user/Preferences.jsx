import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { toast } from 'react-toastify';

export default function Preferences() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('');
  const [language, setLanguage] = useState('');
  const [notifications, setNotifications] = useState('');
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.interface !== 'user') {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Fetch user preferences on page load
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('/preferences'); // Adjust the endpoint as needed
        const data = response.data.preferences;

        if (data) {
          setCurrency(data.currency);
          setLanguage(data.language);
          setNotifications(data.notifications ? 'yes' : 'no');
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchPreferences();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (!currency || !language || !notifications) {
        toast.error('Please fill in all fields');
        return;
      }

      const response = await axios.post('/updatepreferences', {
        currency,
        language,
        notifications,
      });

      if (response.status === 200) {
        toast.success(response.data.message || 'Preferences updated successfully');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
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
        <h2>Hello {user && <span>{user.first_name}</span>}</h2>
          <p>Manage your booking experience</p>
        </div>
        <section className="form_area form">
          <div className="div">
            <div className="node_item">
              <h2>
                Manage preferences<img src="../assets/preference.svg" alt="" />
              </h2>
            </div>
            <label htmlFor="currency">Currency</label>
            <br />
            <select
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
            </select>
            <br />
            <label htmlFor="language">Language</label>
            <br />
            <select
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="yo">Yoruba</option>
              <option value="ha">Hausa</option>
            </select>
            <br />
            <label htmlFor="notifications">I want to receive email notifications</label>
            <br />
            <select
              name="notifications"
              value={notifications}
              onChange={(e) => setNotifications(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <div className="button_5" onClick={handleSubmit}>Update</div>
            <br />
          </div>
        </section>
      </section>
    </>
  );
}
