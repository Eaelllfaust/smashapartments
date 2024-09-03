import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS

export default function CarRentals() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.account_type !== 'user') {
      navigate("/");
    } else {
      fetchRentals();
    }
  }, [user, loading, navigate]);

  const fetchRentals = async () => {
    try {
      const response = await axios.get(`/getCurrentRentals/${user._id}`);
      setRentals(response.data);
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
      toast.error('Failed to fetch rentals');
    }
  };

  const handleCancel = (rentalId) => {
    confirmAlert({
      title: 'Confirm to cancel',
      message: 'Are you sure you want to cancel this rental?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => cancelRental(rentalId)
        },
        {
          label: 'No',
          onClick: () => console.log('Cancel action aborted')
        }
      ]
    });
  };

  const cancelRental = async (rentalId) => {
    try {
      const response = await axios.post(`/cancelrental/${rentalId}`);
      if (response.status === 200) {
        setRentals(rentals.map(rental =>
          rental._id === rentalId ? { ...rental, status: 'cancelled' } : rental
        ));
        toast.success('Rental cancelled successfully');
      }
    } catch (error) {
      console.error('Failed to cancel rental:', error);
      toast.error('Failed to cancel rental');
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Car rentals</h1>
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
          <p>Manage your rental experience</p>
        </div>
      </section>
      <section className="form_area2">
        <div className="ibox2">
          <div className="i3">
            <h2>Your rentals</h2>
            <img src="/assets/time.svg" alt="" />
          </div>
          <p>This is the number of rentals you have: {rentals.length}</p>
        </div>
        <div className='all_data_current'>
        {rentals.length > 0 ? (
          rentals.map((rental, index) => (
            <div key={index} className='x9'>
              <div className="info">
                <div className="info_intro">
                  <h2>{rental.rentalId ? rental.carNameModel : 'Unknown'}</h2>
                  <br />
                  <br />
                  <div className="info_data">
                    <div className="info_1">Car name</div>
                    <div className="info_2">{rental.rentalId ? rental.carNameModel : 'Unknown'}</div>
                  </div>
                  <div className="info_data">
                    <div className="info_1">Rental date</div>
                    <div className="info_2">{new Date(rental.pickupDate).toLocaleDateString()} </div>
                  </div>
                  <div className="info_data">
                    <div className="info_1">Pickup</div>
                    <div className="info_2">{rental.pickupLocation}</div>
                  </div>
                  <div className="info_data">
                    <div className="info_1">Dropoff</div>
                    <div className="info_2">{rental.dropoffLocation}</div>
                  </div>
                  <div className="info_data">
                    <div className="info_1">Status</div>
                    <div className="info_2">{rental.status}</div>
                  </div>
                  <br />
                  <br />
                  <h3>More info</h3>
                  <br />
                  <div className="info_data">
                    <div className="info_1">Paid</div>
                    <div className="info_2">NGN {rental.totalPrice.toLocaleString()}</div>
                  </div>
                  <div className="action">
                  {rental.status === 'confirmed' && (
                          <div className="new_btn_1" onClick={() => handleCancel(rental._id)}>Cancel</div>
                        )}
                  </div>
                </div>
                <div className="info_second">
                  <div>
                    <img src={rental.media.length > 0 ? `https://smashapartments.onrender.com/uploads/${rental.media[0].media_name}`: '/assets/properties (1).png'} alt="" />
                  </div>
                </div>
              </div>
              <br /><br />
              <div className="contacts">
                <h3>Contact driver <i className="bx bx-support" /></h3>
                <br />
                <div className="info_data">
                  <div className="info_1">Phone</div>
                  <div className="info_2">{rental.rentalId ? rental.driverPhoneNumber : 'Not provided'}</div>
                </div>
                <div className="info_data">
                  <div className="info_1">Email</div>
                  <div className="info_2">{rental.rentalId ? rental.driverEmail : 'Not provided'}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No current rentals found.</p>
        )}
        </div>
      </section>
    </>
  );
}
