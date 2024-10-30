import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS

export default function AirportPickups() {
  const { user, loading } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (user) {
      fetchAirportPickups();
    }
  }, [user, loading]);

  const fetchAirportPickups = async () => {
    try {
      const response = await axios.get(`/getcurrentpickups/${user._id}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch airport pickups:', error);
      toast.error("Failed to fetch airport pickups");
    }
  };

  const handleCancel = (bookingId) => {
    confirmAlert({
      title: "Confirm to cancel",
      message: "Are you sure you want to cancel this booking?",
      buttons: [
        {
          label: "Yes",
          onClick: () => cancelBooking(bookingId),
        },
        {
          label: "No",
          onClick: () => console.log("Cancel action aborted"),
          className: "noButtonStyle",
        },
      ],
    });
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await axios.post(`/cancelairportpickup/${bookingId}`);
      if (response.status === 200) {
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
          )
        );
        toast.success("Booking cancelled successfully");
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const uploadReceipt = (bookingId) => {
    const fileInput = document.querySelector(`#receipt-${bookingId}`);
    fileInput.click();
  };

  const handleFileChange = async (event, bookingId) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only images or PDF files');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('receipt', file);
      const response = await axios.post(
        `/uploadreceiptpickup/${bookingId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        setBookings(bookings.map(booking => {
          if (booking._id === bookingId) {
            return {
              ...booking,
              receipts: [...(booking.receipts || []), response.data.receipt]
            };
          }
          return booking;
        }));
        toast.success('Receipt uploaded successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to upload receipt:', error);
      toast.error('Failed to upload receipt');
    } finally {
      setUploading(false);
    }
  };

  const viewReceipt = (receipt) => {
    window.open(`http://localhost:8000/${receipt.media_location}`, '_blank');
  };

  return (
    <>
      <div className="shade_2">
        <h1>Airport pickups</h1>
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
      <br />
      <section className="form_area2">
        <div className="ibox2">
          <div className="i3">
            <h2>Your pickups</h2>
            <img src="/assets/time.svg" alt="" />
          </div>
          <p>This is the number of pickups you have: {bookings.length}</p>
        </div>
        <div className="all_data_current">
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div key={index} className="x9">
                <div className="info">
                  <div className="info_intro">
                    <h2>{booking.serviceDetails.serviceName}</h2>
                    <br />
                    <br />
                    <div className="info_data">
                      <div className="info_1">Driver name</div>
                      <div className="info_2">{booking.serviceDetails.driverName}</div>
                    </div>
                    <div className="info_data">
                      <div className="info_1">Car details</div>
                      <div className="info_2">{booking.carColor}, {booking.carMakeModel}</div>
                    </div>
                    <div className="info_data">
                      <div className="info_1">Flight arrival time</div>
                      <div className="info_2">{new Date(booking.arrivalDate).toLocaleDateString()} at {booking.arrivalTime}</div>
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
                      <div className="info_2">NGN {booking.totalPrice.toLocaleString()}</div>
                    </div>
                    <br />
                    <h3>Receipts</h3>
                    <br />
                    <div className="receipts-section">
                      {booking.receipts && booking.receipts.length > 0 ? (
                        <div className="receipts-grid">
                          {booking.receipts.map((receipt, idx) => (
                            <div 
                              key={idx} 
                              className="receipt-item"
                              onClick={() => viewReceipt(receipt)}
                            >
                              <div className="receipt-preview">
                                <img 
                                  src={`http://localhost:8000/${receipt.media_location}`}
                                  alt="Receipt preview"
                                />
                              </div>
                              <span className="receipt-name">{receipt.media_name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No receipts uploaded yet</p>
                      )}
                    </div>
                    <br />
                    <div className="action">
                      {booking.status === "confirmed" && (
                        <div className="new_btn_1" onClick={() => handleCancel(booking._id)}>
                          Cancel
                        </div>
                      )}
                      <div className="new_btn_2" onClick={() => uploadReceipt(booking._id)} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload receipt'}
                      </div>
                      <input 
                        style={{display: "none"}} 
                        type="file" 
                        id={`receipt-${booking._id}`}
                        onChange={(e) => handleFileChange(e, booking._id)}
                        accept="image/*,.pdf"
                      />
                    </div>
                  </div>
                  <div className="info_second">
                    <div>
                      <img src="/assets/bg (4).png" alt="" />
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <div className="contacts">
                  <h3>
                    Contact driver <i className="bx bx-support" />
                  </h3>
                  <br />
                  <div className="info_data">
                    <div className="info_1">Phone</div>
                    <div className="info_2">{booking.driverPhoneNumber}</div>
                  </div>
                  <div className="info_data">
                    <div className="info_1">Email</div>
                    <div className="info_2">{booking.driverEmail}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No current bookings found.</p>
          )}
        </div>
      </section>
    </>
  );
}
