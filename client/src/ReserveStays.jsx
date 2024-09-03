import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ReserveStays() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [stayDetails, setStayDetails] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numPeople, setNumPeople] = useState("");
  const [numRooms, setNumRooms] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { user } = useContext(UserContext);

  const listingId = searchParams.get("id");

  useEffect(() => {
    const fetchStayDetails = async () => {
      try {
        const response = await axios.get(`/getlistingdata/${listingId}`);
        setStayDetails(response.data);
      } catch (error) {
        console.error("Error fetching stay details:", error);
        toast.error("Failed to load stay details. Please try again later.");
      }
    };

    fetchStayDetails();

    // Load Paystack script
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [listingId]);

  useEffect(() => {
    if (checkInDate && checkOutDate && stayDetails) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const diffInTime = checkOut.getTime() - checkIn.getTime();
      const numberOfDays = diffInTime / (1000 * 3600 * 24);

      let price = stayDetails.price_per_night * numberOfDays;

      let discount = 0;
      if (numberOfDays >= 30 && stayDetails.monthly_discount > 0) {
        discount = (price * stayDetails.monthly_discount) / 100;
      } else if (numberOfDays >= 7 && stayDetails.weekly_discount > 0) {
        discount = (price * stayDetails.weekly_discount) / 100;
      }

      setDiscountAmount(discount);
      setTotalPrice(price - discount);
    }
  }, [checkInDate, checkOutDate, stayDetails]);

  const handlePayment = () => {
    if (!user) {
      toast.error("Please create an account or sign in to continue.");
      return;
    }

    if (user.account_type !== "user") {
      toast.error("Please create a booking account to continue.");
      return;
    }

    if (!checkInDate || !checkOutDate || !numPeople || !numRooms) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    if (numPeople <= 0 || numRooms <= 0) {
      toast.error("Number of people and rooms must be greater than 0.");
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
      key: "pk_test_aa805fbdf79594d452dd669b02148a98482bae70", // Replace with your public key
      amount: totalPrice * 100, // Amount in kobo
      email: user.email,
      onSuccess: (transaction) => {
        verifyPaymentAndBook(transaction.reference);
      },
      onCancel: () => {
        toast.error("Payment cancelled. Please try again.");
      },
    });
  };

  const verifyPaymentAndBook = async (reference) => {
    try {
      const response = await axios.post("/verify_payment", {
        reference,
        listingId,
        checkInDate,
        checkOutDate,
        numPeople,
        numRooms,
        totalPrice,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        if (user?.account_type) {
          if (user.account_type === "administrator") {
            navigate("/administrator");
          } else if (user.account_type === "partner") {
            navigate("/partner");
          } else if (user.account_type === "user") {
            navigate("/user");
          }
        }
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying payment and creating booking:", error);
      if (error.response) {
        toast.error(
          error.response.data.error ||
            "An error occurred. Please try again later."
        );
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <div className="shade_2 df">
        <h1>Search for stays</h1>
        <p>From budget hotels to luxury rooms and everything in between</p>
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
          {/* Display stay details */}
          {stayDetails && (
            <div className="listings_list">
              <div className="list_node">
                <div className="list_1">
                  <img
                    src={
                      stayDetails.images?.[0]?.url
                        ? `https://smashapartments.onrender.com/${stayDetails.images[0].url}`
                        : "/assets/properties (2).png"
                    }
                    alt={stayDetails.property_name || "Property Image"}
                  />
                </div>
                <div className="list_2">
                  <div className="l22">
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h2>{stayDetails.property_name}</h2>
                        <div className="star_holder">
                          {/* Render star rating based on stayDetails rating */}
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`bx bx-star ${
                                index < (stayDetails.ratings || 0)
                                  ? "filled"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="small_1" style={{ marginTop: 10 }}>
                        {stayDetails.city}, {stayDetails.state_name}
                      </h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="n94">
                        <h3>
                          {stayDetails.ratings >= 4.5 ? "Excellent" : "Good"}
                        </h3>
                        <h3>{stayDetails.reviews || "No reviews"}</h3>
                      </div>
                      <div
                        className="button b3"
                        style={{
                          marginLeft: 10,
                          maxWidth: "50px !important",
                          minWidth: "100px !important",
                        }}
                      >
                        {stayDetails.ratings || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="l33">
                    <div className="o93">
                      <h3>{stayDetails.property_type || "Not specified"}</h3>
                      <p>
                        {stayDetails.description || "No description available."}
                      </p>
                    </div>
                    <div>
                      <div className="o33">
                        <div>
                          {discountAmount > 0
                            ? `Discounted NGN ${discountAmount.toLocaleString()}`
                            : "Standard rate"}
                        </div>
                        <div>Daily rate</div>
                      </div>
                      <div className="amount_main">
                        <h1>
                          NGN{" "}
                          {stayDetails.price_per_night?.toLocaleString() ||
                            "0.00"}
                        </h1>
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
                <p>{stayDetails?.contact_email}</p>
              </div>
              <div>
                <h3>Phone</h3>
                <p>{stayDetails?.contact_phone}</p>
              </div>
            </div>
            <div className="l32">{stayDetails?.address}</div>
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
            <div className="form h89">
              <label htmlFor="numPeople">Number of people</label>
              <input
                placeholder="Number of people"
                type="number"
                className="input"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
              />
            </div>
            <div className="form h89">
              <label htmlFor="numRooms">Number of rooms</label>
              <input
                placeholder="Number of rooms"
                type="number"
                className="input"
                value={numRooms}
                onChange={(e) => setNumRooms(e.target.value)}
              />
            </div>

            <div className="l54">
              <div>
                <h3>Check in</h3>
                <p>{checkInDate || "Sat, Aug 24, 2024"}</p>
              </div>
              <div>
                <h3>Check out</h3>
                <p>{checkOutDate || "Wed, Sep 18, 2024"}</p>
              </div>
            </div>
            <br />
            <div className="l54">
              <div>
                <h3>You selected</h3>
                <p>{`${numRooms || "3"} rooms for ${
                  numPeople || "2"
                } people`}</p>
              </div>
            </div>
            <br />
            <h2>Your price summary</h2>
            <br />
            <div className="l02">
              <div className="l02_1">
                <div>Original price</div>
                <div>
                  NGN&nbsp;
                  {stayDetails?.price_per_night?.toLocaleString() || "0.00"}
                </div>
              </div>
              <div className="l02_1">
                <div>Discount</div>
                <div>NGN&nbsp;{discountAmount.toLocaleString() || "0.00"}</div>
              </div>
            </div>
            <h2>Total</h2>
            <br />
            <h2 className="sum">NGN&nbsp;{totalPrice.toLocaleString()}</h2>
            <br />
            <div className="button b3 b2" onClick={handlePayment}>
              Make payment
            </div>
          </div>
          <div className="info_row">
            <div className="l54">
              <div>
                <h3>Cancellation Policy</h3>
                <p>{stayDetails?.cancellation_policy}</p>
              </div>
              <div>
                <h3>Refund Policy</h3>
                <p>{stayDetails?.refund_policy}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
