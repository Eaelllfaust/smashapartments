import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReviewModal from "./ReviewModal";
export default function CurrentBookings() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedListingId, setSelectedListingId] = useState(null);

  const openReviewModal = (bookingId, listingId) => {
    setSelectedBookingId(bookingId);
    setSelectedListingId(listingId);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBookingId(null);
    setSelectedListingId(null);
  };

  const [uploading, setUploading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const uploadReceipt = (bookingId) => {
    const fileInput = document.querySelector(`#receipt-${bookingId}`);
    fileInput.click();
  };

  const handleFileChange = async (event, bookingId) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload only images or PDF files");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("receipt", file);
      const response = await axios.post(
        `/uploadreceipt/${bookingId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setBookings(
          bookings.map((booking) => {
            if (booking._id === bookingId) {
              return {
                ...booking,
                receipts: [...(booking.receipts || []), response.data.receipt],
              };
            }
            return booking;
          })
        );
        toast.success("Receipt uploaded successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to upload receipt:", error);
      toast.error(error.response?.data?.error || "Failed to upload receipt");
    } finally {
      setUploading(false);
    }
  };
  const viewReceipt = (receipt) => {
    window.open(`https://smashapartments.com/uploads/${receipt.media_name}`, "_blank");
  };
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.interface !== "user") {
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
      console.error("Failed to fetch bookings:", error);
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

  const isCancellable = (createdAt) => {
    const oneHour = 60 * 60 * 1000;
    return new Date() - new Date(createdAt) < oneHour;
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await axios.post(`/cancelbooking/${bookingId}`);
      if (response.status === 200) {
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );
        toast.success("Booking cancelled successfully");
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to cancel booking";
      toast.error(errorMessage);
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
          <div className="all_data_current">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div key={index} className="x9">
                  <div className="info">
                    <div className="info_intro">
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
                                    src={`https://smashapartments.com/uploads/${receipt.media_name}`}
                                    alt="Receipt preview"
                                  />
                                </div>
                                <span className="receipt-name">
                                  {receipt.media_name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>No receipts uploaded yet</p>
                        )}
                      </div>

                      <h2>{booking.property_name}</h2>
                      <br />
                      <br />
                      <div className="info_data">
                        <div className="info_1">Location</div>
                        <div className="info_2">
                          {booking.city}, {booking.state_name}
                        </div>
                      </div>
                      <div className="info_data">
                        <div className="info_1">Check in</div>
                        <div className="info_2">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="info_data">
                        <div className="info_1">Checkout</div>
                        <div className="info_2">
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </div>
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
                        <div className="info_2">
                          {booking.currency} {booking.totalPrice}
                        </div>
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
                        {booking.status === "confirmed" &&
                          isCancellable(booking.createdAt) && (
                            <div
                              className="new_btn_1"
                              onClick={() => handleCancel(booking._id)}
                            >
                              Cancel
                            </div>
                          )}
                      </div>
                      <div className="action">
                        <div
                          className="new_btn_2"
                          onClick={() => uploadReceipt(booking._id)}
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Upload receipt"}
                        </div>
                      </div>
                      <div className="action">
                        <div
                          className="new_btn_2"
                          onClick={() =>
                            openReviewModal(booking._id, booking.listingId)
                          }
                        >
                          Review and rate
                        </div>
                      </div>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        id={`receipt-${booking._id}`}
                        onChange={(e) => handleFileChange(e, booking._id)}
                        accept="image/*,.pdf"
                      />
                    </div>
                    <div className="info_second">
                      <div>
                        <img
                          src={
                            booking.media.length > 0
                              ? `https://smashapartments.com/uploads/${booking.media[0].media_name}`
                              : "/assets/properties (1).png"
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="contacts">
                    <h3>
                      Contact host <i className="bx bx-support" />
                    </h3>
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
            {showReviewModal && (
              <ReviewModal
                userId={user._id}
                bookingId={selectedBookingId}
                listingId={selectedListingId}
                onClose={closeReviewModal}
              />
            )}
          </div>
        </section>
      </section>
    </>
  );
}
