import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../context/userContext";

export default function AirportPickupDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchPickup = async () => {
      try {
        const response = await axios.get(`/getpickupdata/${id}`);
        setPickup(response.data);

        if (user) {
          const likedResponse = await axios.get(`/checkliked/${id}`);
          setLiked(likedResponse.data.liked);
        }
      } catch (error) {
        setError("Failed to fetch pickup data");
      } finally {
        setLoading(false);
      }
    };

    fetchPickup();
  }, [id, user]);

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => toast.success("URL copied to clipboard!"))
      .catch(() => toast.error("Failed to copy URL"));
  };

  const handleReserveClick = () => {
    navigate(`/pickups/reservepickup?id=${id}`);
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("You need to be signed in to like a pickup service");
      return;
    }

    try {
      const response = await axios.post("/likeproperty", { listingId: id });
      setLiked(response.data.message === "Property liked");
      toast.success(
        response.data.message === "Property liked"
          ? "Service liked"
          : "Service unliked"
      );
    } catch (error) {
      toast.error("Error handling like/unlike action");
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === pickup.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? pickup.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!pickup) return <p>No pickup service found</p>;

  return (
    <>
      <div className="shade_2 df">
        <h1>Search for airport pickups</h1>
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
          <div className="listings_list">
            <div className="list_node">
              <div className="list_1">
                {pickup.images && pickup.images.length > 0 ? (
                  <>
                    <img
                      src={`http://localhost:8000/uploads/${pickup.images[currentImageIndex].media_name}`}
                      alt={`Pickup Service ${currentImageIndex + 1}`}
                    />
                  </>
                ) : (
                  <img src="/assets/bg (4).png" alt="Default Pickup Service" />
                )}
              </div>
              <div className="list_2">
                <div className="l22">
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h2>{pickup.serviceName}</h2>
                    </div>
                    <h3 className="small_1" style={{ marginTop: 10 }}>
                      {pickup.contactName}
                    </h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="n94">
                      <h3>{pickup.carMakeModel}</h3>
                      <h3>{pickup.carColor}</h3>
                    </div>
                  </div>
                </div>
                <div className="l33">
                  <div className="o93">
                    <h3>Airport Pickup</h3>
                    <p>{pickup.description}</p>
                  </div>
                  <div>
                    <div className="o33">
                      <div>Driver: {pickup.driverName}</div>
                      <div>Pricing</div>
                    </div>
                    <div className="amount_main">
                      <h1>
                        NGN {pickup.pickupPrice?.toLocaleString() || "0.00"}
                      </h1>
                    </div>
                    <div className="o33">
                      <div>
                        {pickup.extraLuggage
                          ? "Extra luggage allowed"
                          : "Standard luggage"}
                      </div>
                     
                    </div>
                    <br />
                    <div
                      onClick={handleReserveClick}
                      className="button b3 b4 b2"
                    >
                      Reserve
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="info_row">
            <div className="l54">
              <div>
                <h3>Email</h3>
                <p>{pickup.contactEmail || "Not provided"}</p>
              </div>
              <div>
                <h3>Phone</h3>
                <p>{pickup.contactPhone || "Not provided"}</p>
              </div>
            </div>
            <div className="l67">
              <i className="bx bx-share-alt" onClick={handleShare} />
              <i
                className={`bx ${liked ? "bxs-heart" : "bx-heart"}`}
                onClick={handleLike}
                style={{ color: liked ? "red" : "inherit" }}
              />
            </div>
          </div>
          <div className="action_row">
            <h2 className="action_init">Overview</h2>
          </div>
          <div className="detail">
            <br />
            <p>{pickup.description || "No detailed description available."}</p>
            <br />
            <div>
              <h2>Info</h2>
              <br />
              <div className="l02">
                <div className="l02_1">
                  <div>Car make and model</div>
                  <div>{pickup.carMakeModel}</div>
                </div>
                <div className="l02_1">
                  <div>Car color</div>
                  <div>{pickup.carColor}</div>
                </div>
                <div className="l02_1">
                  <div>Plate number</div>
                  <div>{pickup.plateNumber}</div>
                </div>
                <div className="l02_1">
                  <div>Driver's name</div>
                  <div>{pickup.driverName}</div>
                </div>
                <div className="l02_1">
                  <div>Driver license number</div>
                  <div>{pickup.driverLicenseNumber}</div>
                </div>
                <div className="l02_1">
                  <div>Driver phone number</div>
                  <div>{pickup.driverPhoneNumber}</div>
                </div>
                <div className="l02_1">
                  <div>Driver email address</div>
                  <div>{pickup.driverEmail}</div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <h2>Additional Services</h2>
              <br />
              <div className="l02">
                <div className="l02_1">
                  <div>Extra luggage</div>
                  <div>{pickup.extraLuggage}</div>
                </div>
                <div className="l02_1">
                  <div>Waiting time</div>
                  <div>{pickup.waitingTime}</div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <h2>Pricing</h2>
              <br />
              <div className="l02">
                <div className="l02_1">
                  <div>Price</div>
                  <div>
                    NGN {pickup.pickupPrice?.toLocaleString() || "0.00"}
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <h2>Availability</h2>
              <br />
              <div className="l02">
                <div className="l02_1">
                  <div>Available from</div>
                  <div>
                    {pickup.availableFrom
                      ? new Date(pickup.availableFrom).toDateString()
                      : "Not specified"}
                  </div>
                </div>
                <div className="l02_1">
                  <div>Available to</div>
                  <div>
                    {pickup.availableTo
                      ? new Date(pickup.availableTo).toDateString()
                      : "Not specified"}
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <h2>Cancellation policy</h2>
              <br />
              <p>
                {pickup.cancellationPolicy ||
                  "No cancellation policy specified."}
              </p>
            </div>
            <br />
            <div>
              <h2>Refund policy</h2>
              <br />
              <p>{pickup.refundPolicy || "No refund policy specified."}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
