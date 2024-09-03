import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../context/userContext'; 

export default function RentalDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await axios.get(`/getrentaldetails/${id}`);
        setRental(response.data);
    
        if (user) {
          const likedResponse = await axios.get(`/checkliked/${id}`);
          setLiked(likedResponse.data.liked);
        }
      } catch (error) {
        setError('Failed to fetch rental data');
      } finally {
        setLoading(false);
      }
    };

    fetchRental();
  }, [id, user]);

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => toast.success("Copied!"))
      .catch(() => toast.error("Failed to copy URL"));
  };

  const handleReserveClick = () => {
    navigate(`/rentals/reserverental?id=${id}`);
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("You need to be signed in to like a rental");
      return;
    }

    try {
      const response = await axios.post('/likeproperty', { listingId: id });
      setLiked(response.data.message === "Property liked");
      toast.success(response.data.message === "Property liked" ? "Rental liked" : "Rental unliked");
    } catch (error) {
      toast.error("Error handling like/unlike action");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!rental) return <p>No rental found</p>;

  return (
    <>
      <div className="shade_2 df">
        <h1>Search for car rentals</h1>
        <p>From budget cars to luxury vehicles and everything in between</p>
        <img src="/assets/linear_bg.png" className="shade_bg" alt="Background" />
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
                <img
                  src={rental.images?.[0]?.url ? 
                       `http://localhost:8000/${rental.images[0].url}` : 
                       '/assets/bg (3).png'}
                  alt={rental.carNameModel || 'Car Rental Image'}
                />
              </div>
              <div className="list_2">
                <div className="l22">
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h2>{rental.carNameModel}</h2>
                      <div className="star_holder">
                        {[...Array(5)].map((_, index) => (
                          <i className={`bx bx-star ${index < (rental.ratings || 0) ? 'filled' : ''}`} key={index} />
                        ))}
                      </div>
                    </div>
                    <h3 className="small_1" style={{ marginTop: 10 }}>
                      {rental.location}
                    </h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="n94">
                      <h3>{rental.ratings >= 4.5 ? 'Excellent' : 'Good'}</h3>
                      <h3>{rental.reviews || 'No reviews'}</h3>
                    </div>
                    <div
                      className="button b3"
                      style={{
                        marginLeft: 10,
                        maxWidth: "50px !important",
                        minWidth: "100px !important"
                      }}
                    >
                      {rental.ratings || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="l33">
                  <div className="o93">
                    <h3>{rental.carType}</h3>
                    <p>{rental.description}</p>
                  </div>
                  <div>
                    <div className="o33">
                      <div>{rental.discount || '0'}% discounted</div>
                      <div>Pricing</div>
                    </div>
                    <div className="amount_main">
                      <h1>NGN {rental.rentalPrice?.toLocaleString()}</h1>
                    </div>
                    <div className="o33">
                      <div>Includes taxes</div>
                    </div>
                    <br />
                    <div onClick={handleReserveClick} className="button b3 b4 b2">Reserve</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="info_row">
            <div className="l54">
              <div>
                <h3>Email</h3>
                <p>{rental.contactEmail}</p>
              </div>
              <div>
                <h3>Phone</h3>
                <p>{rental.contactPhone}</p>
              </div>
            </div>
            <div className="l32">{rental.location}</div>
            <div className="l67">
              <i className="bx bx-share-alt" onClick={handleShare} />
              <i 
                className={`bx ${liked ? 'bxs-heart' : 'bx-heart'}`} 
                onClick={handleLike} 
                style={{ color: liked ? 'red' : 'inherit' }}
              />
            </div>
          </div>
          <div className="action_row">
            <h2 className="action_init">Overview</h2>
          </div>
          <div className="detail">
            <br />
            <p>{rental.description}</p>
            <br />
            <div>
              <h2>Info</h2>
              <br />
              <div className="l02">
                <div className="l02_1">
                  <div>Car make and model</div>
                  <div>{rental.carMakeModel}</div>
                </div>
                <div className="l02_1">
                  <div>Car color</div>
                  <div>{rental.carColor}</div>
                </div>
                <div className="l02_1">
                  <div>Plate number</div>
                  <div>{rental.plateNumber}</div>
                </div>
                <div className="l02_1">
                  <div>Mileage</div>
                  <div>{rental.mileage}</div>
                </div>
                <div className="l02_1">
                  <div>Driver's name</div>
                  <div>{rental.driverName}</div>
                </div>
                <div className="l02_1">
                  <div>Driver license number</div>
                  <div>{rental.driverLicenseNumber}</div>
                </div>
                <div className="l02_1">
                  <div>Driver phone number</div>
                  <div>{rental.driverPhoneNumber}</div>
                </div>
                <div className="l02_1">
                  <div>Driver email address</div>
                  <div>{rental.driverEmail}</div>
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
                  <div>NGN {rental.rentalPrice?.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <h2>Additional charges</h2>
              <br />
              <div className="l02">
                <div className="l02_1">
                  <div>Insurance</div>
                  <div>{rental.insurance}</div>
                </div>
                <div className="l02_1">
                  <div>Fuel</div>
                  <div>{rental.fuel}</div>
                </div>
                <div className="l02_1">
                  <div>Extra driver</div>
                  <div>{rental.extraDriver ? 'Available' : 'Not available'}</div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <h2>Cancellation policy</h2>
              <br />
              <p>{rental.cancellationPolicy}</p>
            </div>
            <br />
            <div>
              <h2>Refund policy</h2>
              <br />
              <p>{rental.refundPolicy}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
