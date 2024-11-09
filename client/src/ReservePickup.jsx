import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";

export default function ReservePickup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [serviceDetails, setServiceDetails] = useState(null);
  const [arrivalDate, setArrivalDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [commission, setCommission] = useState(0);
  const [vat, setVAT] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const { user } = useContext(UserContext);

  const serviceId = searchParams.get("id");

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`/getpickupdata/${serviceId}`);
        setServiceDetails(response.data);
        setTotalPrice(response.data.pickupPrice);
        calculateFinalPrice(response.data.pickupPrice);
      } catch (error) {
        console.error("Error fetching service details:", error);
        toast.error("Failed to load service details. Please try again later.");
      }
    };

    fetchServiceDetails();

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [serviceId]);

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (serviceDetails) {
      const availableFrom = new Date(serviceDetails.availableFrom);
      const availableTo = new Date(serviceDetails.availableTo);

      if (selectedDate >= availableFrom && selectedDate <= availableTo) {
        setArrivalDate(e.target.value);
        calculateFinalPrice(serviceDetails.pickupPrice);
      } else {
        toast.error("Selected date is outside the available range.");
      }
    }
  };

  const handleTimeChange = (e) => {
    setArrivalTime(e.target.value);
    calculateFinalPrice(serviceDetails.pickupPrice);
  };

  const calculateFinalPrice = (price) => {
    const commission = price * 0.1; // 10% commission
    const vat = price * 0.075; // 7.5% VAT
    const finalPrice = price + commission + vat;
    setCommission(commission);
    setVAT(vat);
    setFinalPrice(finalPrice);
  };

  const handlePayment = () => {
    if (!user) {
      toast.error("Please create an account or sign in to continue.");
      return;
    }

    if (user.interface !== "user") {
      toast.error("Please signin as a customer to continue.");
      return;
    }

    if (!arrivalDate || !arrivalTime) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const today = new Date();
    const selectedDate = new Date(arrivalDate);

    if (selectedDate < today) {
      toast.error("Arrival date cannot be in the past.");
      return;
    }

    // Proceed with payment
    const paystack = new window.PaystackPop();
    paystack.newTransaction({
      key: "pk_live_4b0f48fb37a18ddc2f5514ad7b93a1d094f3dda4", // Replace with your public key
      amount: finalPrice * 100, // Amount in kobo
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
      const response = await axios.post("/verify_payment_service", {
        reference,
        serviceId,
        arrivalDate,
        arrivalTime,
        totalPrice: finalPrice,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/user");
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying payment and creating booking:", error);
      toast.error(
        error.response?.data?.error ||
          "An error occurred. Please try again later."
      );
    }
  };

  return (
    <>
      <div className="shade_2 df">
        <h1>Airport pickups</h1>
        <p>From budget rides to luxury cars and everything in between</p>
        <img
          src="/assets/linear_bg.png"
          className="shade_bg"
          alt="Background"
        />
        <div className="shade_item">
          <img src="/assets/bg (2).png" alt="Shade Item 1" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (1).png" alt="Shade Item 2" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (4).png" alt="Shade Item 3" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (3).png" alt="Shade Item 4" />
        </div>
      </div>
      <section className="majestic mml">
        <div className="col_3">
          {serviceDetails && (
            <div className="listings_list">
              <div className="list_node">
                <div className="list_1">
                  {serviceDetails.images &&
                    serviceDetails.images.length > 0 && (
                      <img
                        src={`https://smashapartments.com/uploads/${serviceDetails.images[0].media_name}`}
                        alt="Service"
                      />
                    )}
                </div>
                <div className="list_2">
                  <div className="l22">
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h2>{serviceDetails.serviceName}</h2>
                        <div className="star_holder">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`bx bx-star ${
                                i <
                                Math.floor(serviceDetails.averageRating || 0)
                                  ? "bxs-star"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="small_1" style={{ marginTop: 10 }}>
                        {serviceDetails.contactName}
                      </h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="n94">
                        <h3>
                          {serviceDetails.averageRating >= 4.5
                            ? "Excellent"
                            : "Good"}
                        </h3>
                        <h3>
                          {serviceDetails.reviewCount
                            ? `${serviceDetails.reviewCount} reviews`
                            : "No reviews"}
                        </h3>
                      </div>
                      <div
                        className="rating_cont"
                        style={{
                          marginLeft: 10,
                          maxWidth: "50px !important",
                          minWidth: "100px !important",
                        }}
                      >
                        {serviceDetails.averageRating || "N/A"}{" "}
                        <i className="bx bxs-star"></i>
                      </div>
                    </div>
                  </div>
                  <div className="l33">
                    <div className="o93">
                      <h3>Airport Pickup</h3>
                      <p>{serviceDetails.description}</p>
                    </div>
                    <div>
                      <div className="o33">
                        <div>Driver: {serviceDetails.driverName}</div>
                        <div>Pricing</div>
                      </div>
                      <div className="amount_main">
                        <h1>
                          NGN {serviceDetails.pickupPrice.toLocaleString()}
                        </h1>
                      </div>
                      <div className="o33">
                        <div>
                          {serviceDetails.extraLuggage
                            ? "Extra luggage allowed"
                            : "Standard luggage"}
                        </div>
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
                <h3>Driver</h3>
                <p>{serviceDetails?.driverName}</p>
              </div>
              <div>
                <h3>Phone</h3>
                <p>{serviceDetails?.driverPhoneNumber}</p>
              </div>
            </div>
          </div>
          <div className="detail">
            <br />
            <div>
              <h2>Your booking details</h2>
              <br />
              <div className="form h89">
                <label htmlFor="text">Enter flight arrival date</label>
                <br />
                <input
                  type="date"
                  className="input"
                  value={arrivalDate}
                  onChange={handleDateChange}
                  min={serviceDetails?.availableFrom}
                  max={serviceDetails?.availableTo}
                />
              </div>
              <br />
              <div className="form h89">
                <label htmlFor="text">Enter time</label>
                <br />
                <input
                  type="time"
                  className="input"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
              </div>
              <br />
              <div className="l54">
                <div>
                  <h3>Checking availability</h3>
                  <p>
                    {arrivalDate && arrivalTime
                      ? "Available"
                      : "Please select date and time"}
                  </p>
                </div>
              </div>
              <br />
              <div>
                <h2>Your price summary</h2>
                <br />
                <div className="l02">
                  <div className="l02_1">
                    <div>Pickup price</div>
                    <div>
                      NGN {serviceDetails?.pickupPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="l02_1">
                    <div>Commission (10%)</div>
                    <div>NGN {commission.toLocaleString()}</div>
                  </div>
                  <div className="l02_1">
                    <div>VAT (7.5%)</div>
                    <div>NGN {vat.toLocaleString()}</div>
                  </div>
                </div>
                <br />
                <div>
                  <h2>Total</h2>
                  <br />
                  <h2 className="sum">NGN {finalPrice.toLocaleString()}</h2>
                </div>
                <br />
                <div className="button b3 b2" onClick={handlePayment}>
                  Make payment
                </div>
              </div>
            </div>
          </div>
          <div className="info_row">
            <div className="l54">
              <div>
                <h3>Cancellation Policy</h3>
                <p>{serviceDetails?.cancellationPolicy}</p>
              </div>
              <div>
                <h3>Refund Policy</h3>
                <p>{serviceDetails?.refundPolicy}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
