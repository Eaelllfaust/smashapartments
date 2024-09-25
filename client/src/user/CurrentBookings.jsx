import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from "react-toastify";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS

export default function CurrentBookings() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.interface !== 'user') {
      navigate("/");
    } else {
      fetchBookings();
    }
  }, [user, loading, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`getcurrentbookings/${user._id}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handleCancel = (bookingId) => {
    confirmAlert({
      title: 'Confirm to cancel',
      message: 'Are you sure you want to cancel this booking?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => cancelBooking(bookingId)
        },
        {
          label: 'No',
          onClick: () => console.log('Cancel action aborted')
        }
      ]
    });
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await axios.post(`/cancelbooking/${bookingId}`);
      if (response.status === 200) {
        setBookings(bookings.map(booking =>
          booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
        ));
        toast.success('Booking cancelled successfully');
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Stays</h1>
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
      </section>
      <section>
        <section className="form_area2 booking_data">
          <div className="ibox2">
            <div className="i3">
              <h2>Your bookings</h2>
              <img src="/assets/time.svg" alt="" />
            </div>
            <p>These is the number of bookings you have: {bookings.length}</p>
          </div>
          <div className='all_data_current'>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div key={index} className='x9'>
                  <div className="info">
                    <div className="info_intro">
                      <h2>{booking.property_name}</h2>
                      <br />
                      <br />
                      <div className="info_data">
                        <div className="info_1">Location</div>
                        <div className="info_2">{booking.city}, {booking.state_name}</div>
                      </div>
                      <div className="info_data">
                        <div className="info_1">Check in</div>
                        <div className="info_2">{new Date(booking.checkInDate).toLocaleDateString()}</div>
                      </div>
                      <div className="info_data">
                        <div className="info_1">Checkout</div>
                        <div className="info_2">{new Date(booking.checkOutDate).toLocaleDateString()}</div>
                      </div>
                      <div className="info_data">
                        <div className="info_1">Status</div>
                        <div className="info_2">{booking.status}</div>
                      </div>
                      <br />
                      <br />
                      <h3>More info</h3>
                      <br />
                      <div className="info_data">
                        <div className="info_1">Paid</div>
                        <div className="info_2">{booking.currency} {booking.totalPrice}</div>
                      </div>
                      <div className="info_data">
                        <div className="info_1">People</div>
                        <div className="info_2">{booking.numPeople}</div>
                      </div>
                      <div className="info_data">
                        <div className="info_1">Rooms</div>
                        <div className="info_2">{booking.numRooms}</div>
                      </div>
                      <br />
                      <div className="action">
                        {booking.status === 'confirmed' && (
                          <div className="new_btn_1" onClick={() => handleCancel(booking._id)}>Cancel</div>
                        )}
                      </div>
                    </div>
                    <div className="info_second">
                      <div>
                        <img src={booking.media.length > 0 ? `https://smashapartments.com/uploads/${booking.media[0].media_name}`: '/assets/properties (1).png'} alt="" />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="contacts">
                    <h3>Contact host <i className="bx bx-support" /></h3>
                    <br />
                    <div className="info_data">
                      <div className="info_1">Phone</div>
                      <div className="info_2">{booking.contact_phone}</div>
                    </div>
                    <div className="info_data">
                      <div className="info_1">Email</div>
                      <div className="info_2">{booking.contact_email}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No current bookings found.</p>
            )}
          </div>
        </section>
      </section>
    </>
  );
}
