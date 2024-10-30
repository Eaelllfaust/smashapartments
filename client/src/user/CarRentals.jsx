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
  const [uploading, setUploading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.interface !== 'user') {
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
          onClick: () => console.log('Cancel action aborted'),
          className: "noButtonStyle",
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

  const uploadReceipt = (rentalId) => {
    const fileInput = document.querySelector(`#receipt-${rentalId}`);
    fileInput.click();
  };

  const handleFileChange = async (event, rentalId) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only images or PDF files');
      return;
    }

    try {
      setUploading(true);
      var bookingId = rentalId;
      const formData = new FormData();
      formData.append('receipt', file);
      const response = await axios.post(
        `/uploadreceiptrental/${bookingId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        setRentals(rentals.map(rental => {
          if (rental._id === rentalId) {
            return {
              ...rental,
              receipts: [...(rental.receipts || []), response.data.receipt]
            };
          }
          return rental;
        }));
        toast.success('Receipt uploaded successfully');
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
                  <h2>{rental.carNameModel}</h2>
                  <br />
                  <div className="info_data">
                    <div className="info_1">Car name</div>
                    <div className="info_2">{rental.carNameModel}</div>
                  </div>
                  <div className="info_data">
                    <div className="info_1">Rental date</div>
                    <div className="info_2">{new Date(rental.pickupDate).toLocaleDateString()}</div>
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
                  <h3>More info</h3>
                  <div className="info_data">
                    <div className="info_1">Paid</div>
                    <div className="info_2">NGN {rental.totalPrice.toLocaleString()}</div>
                  </div>
                  <div className="action">
                    {rental.status === 'confirmed' && (
                      <div className="new_btn_1" onClick={() => handleCancel(rental._id)}>Cancel</div>
                    )}
                  </div>
                  <div className="action">
                    <div className="new_btn_2" onClick={() => uploadReceipt(rental._id)}>Upload receipt</div>
                    <input 
                      style={{ display: "none" }} 
                      type="file" 
                      id={`receipt-${rental._id}`}
                      onChange={(e) => handleFileChange(e, rental._id)}
                      accept="image/*,.pdf"
                    />
                  </div>
                  <h3>Receipts</h3>
                  <div className="receipts-section">
                    {rental.receipts && rental.receipts.length > 0 ? (
                      <div className="receipts-grid">
                        {rental.receipts.map((receipt, idx) => (
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
                </div>
                <div className="info_second">
                  <div>
                    <img src={rental.media.length > 0 ? `http://localhost:8000/uploads/${rental.media[0].media_name}` : '/assets/properties (1).png'} alt="" />
                  </div>
                </div>
              </div>
              <br /><br />
              <div className="contacts">
                <h3>Contact driver <i className="bx bx-support" /></h3>
                <br />
                <div className="info_data">
                  <div className="info_1">Phone</div>
                  <div className="info_2">{rental.driverPhoneNumber || 'Not provided'}</div>
                </div>
                <div className="info_data">
                  <div className="info_1">Email</div>
                  <div className="info_2">{rental.driverEmail || 'Not provided'}</div>
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
