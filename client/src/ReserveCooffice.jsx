import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export default function ReserveCooffice() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [officeDetails, setOfficeDetails] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { user } = useContext(UserContext);

  const officeId = searchParams.get("id");
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchOfficeDetails = async () => {
      try {
        const response = await axios.get(`/getcoofficedata/${id}`);
        setOfficeDetails(response.data);
      } catch (error) {
        console.error("Error fetching office details:", error);
        toast.error("Failed to load office details. Please try again later.");
      }
    };

    fetchOfficeDetails();

    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [officeId]);

  useEffect(() => {
    if (checkInDate && checkOutDate && officeDetails) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const diffInTime = checkOut.getTime() - checkIn.getTime();
      const numberOfDays = diffInTime / (1000 * 3600 * 24);

      let price;
      if (numberOfDays >= 30) {
        price = officeDetails.price_monthly;
      } else if (numberOfDays >= 7) {
        price = officeDetails.price_weekly * (Math.floor(numberOfDays / 7));
        price += officeDetails.price_per_day * (numberOfDays % 7);
      } else {
        price = officeDetails.price_per_day * numberOfDays;
      }

      // Calculate discount (you may want to adjust this logic based on your requirements)
      let discount = 0;
      if (numberOfDays >= 30) {
        discount = price * 0.2; // 20% discount for monthly bookings
      } else if (numberOfDays >= 7) {
        discount = price * 0.1; // 10% discount for weekly bookings
      }

      setDiscountAmount(discount);
      setTotalPrice(price - discount);
    }
  }, [checkInDate, checkOutDate, officeDetails]);

  const handlePayment = () => {
    if (!user) {
      toast.error("Please create an account or sign in to continue.");
      return;
    }
  
    if (user.account_type !== 'user') {
      toast.error("Please create a booking account to continue.");
      return;
    }
  
    if (!checkInDate || !checkOutDate) {
      toast.error("Please fill in all the required fields.");
      return;
    }
  
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
  
    if (checkIn < today) {
      toast.error("Check-in date cannot be in the past.");
      return;
    }
  
    if (checkOut < checkIn) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }
  
    if (checkOut.getFullYear() - checkIn.getFullYear() > 1) {
      toast.error("Booking period cannot exceed 1 year.");
      return;
    }
  
    // Proceed with payment
    const paystack = new window.PaystackPop();
    paystack.newTransaction({
      key: 'pk_test_aa805fbdf79594d452dd669b02148a98482bae70', // Replace with your public key
      amount: totalPrice * 100, // Amount in kobo
      email: user.email,
      onSuccess: (transaction) => {
        verifyPaymentAndBook(transaction.reference);
      },
      onCancel: () => {
        toast.error("Payment cancelled. Please try again.");
      }
    });
  };

  const verifyPaymentAndBook = async (reference) => {
    try {
      const response = await axios.post('/verify_payment_cooffice', {
        reference,
        officeId,
        checkInDate,
        checkOutDate,
        totalPrice
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate('/user');
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying payment and creating booking:", error);
      toast.error(error.response?.data?.error || "An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="shade_2 df">
        <h1>Search for cooffice</h1>
        <p>From budget offices to luxury spaces and everything in between</p>
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

      <section className="majestic mml">
        <div className="col_3">
          {officeDetails && (
            <div className="listings_list">
              <div className="list_node">
                <div className="list_1">
                  <img src="/assets/bg (1).png" alt="" />
                </div>
                <div className="list_2">
                  <div className="l22">
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h2>{officeDetails.office_space_name}</h2>
                        <div className="star_holder">
                          {/* You might want to add a rating system for offices */}
                          <i className="bx bx-star" />
                          <i className="bx bx-star" />
                          <i className="bx bx-star" />
                          <i className="bx bx-star" />
                          <i className="bx bx-star" />
                        </div>
                      </div>
                      <h3 className="small_1" style={{ marginTop: 10 }}>
                        {officeDetails.city}, {officeDetails.state_name}
                      </h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="n94">
                        <h3>
                          {officeDetails.ratings >= 4.5 ? "Excellent" : "Good"}
                        </h3>
                        <h3>{officeDetails.reviews || "No reviews"}</h3>
                      </div>
                      <div
                        className="button b3"
                        style={{
                          marginLeft: 10,
                          maxWidth: "50px !important",
                          minWidth: "100px !important",
                        }}
                      >
                        {officeDetails.ratings || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="l33">
                    <div className="o93">
                      <h3>Cooffice</h3>
                      <p>{officeDetails.description}</p>
                    </div>
                    <div>
                      <div className="o33">
                        <div>Daily rate</div>
                      </div>
                      <div className="amount_main">
                        <h1>NGN {officeDetails.price_per_day.toLocaleString()}</h1>
                      </div>
                      <div className="o33">
                        <div>Includes taxes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="info_row">
            <div className="l54">
              <div>
                <h3>Email</h3>
                <p>{officeDetails?.contact_email}</p>
              </div>
              <div>
                <h3>Phone</h3>
                <p>{officeDetails?.contact_phone}</p>
              </div>
            </div>
          </div>
<br />
          <div className="detail">
            <h2>Confirm booking details</h2>
            <br />
            <div className="form h89">
              <label htmlFor="checkIn">Check in date</label>
              <input
                type="date"
                className="input"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </div>
            <div className="form h89">
              <label htmlFor="checkOut">Check out date</label>
              <input
                type="date"
                className="input"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              />
            </div>

            <div className="l54">
              <div>
                <h3>Check in</h3>
                <p>{checkInDate || "Select a date"}</p>
              </div>
              <div>
                <h3>Check out</h3>
                <p>{checkOutDate || "Select a date"}</p>
              </div>
            </div>
            <br />
            <div className="l54">
              <div>
                <h3>You selected</h3>
                <p>{officeDetails?.office_space_name}</p>
              </div>
            </div>
            <br />
            <h2>Your price summary</h2>
            <br />
            <div className="l02">
              <div className="l02_1">
                <div>Original price</div>
                <div>NGN {(totalPrice + discountAmount).toLocaleString()}</div>
              </div>
              <div className="l02_1">
                <div>Discount</div>
                <div>NGN {discountAmount.toLocaleString()}</div>
              </div>
            </div>
            <h2>Total</h2>
            <br />
            <h2 className="sum">NGN {totalPrice.toLocaleString()}</h2>
            <br />
            <div className="button b3 b2" onClick={handlePayment}>
              Make payment
            </div>
          </div>
          <div className="info_row">
            <div className="l54">
              <div>
                <h3>Cancellation Policy</h3>
                <p>{officeDetails?.cancellation_policy}</p>
              </div>
              <div>
                <h3>Refund Policy</h3>
                <p>{officeDetails?.refund_policy}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}