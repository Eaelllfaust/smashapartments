import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import React Toastify
import { UserContext } from '../context/userContext'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

export default function StaysDetails() {
  const navigate = useNavigate();
  const locationSearch = useLocation();
  const params = new URLSearchParams(locationSearch.search);
  const id = params.get('id');
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`/getlistingdata/${id}`);
        setListing(response.data);
    
        if (user) {
          const likedResponse = await axios.get(`/checkliked/${id}`);
          console.log('Liked Response:', likedResponse.data); // Debugging output
          setLiked(likedResponse.data.liked);
        }
      } catch (error) {
        setError('Failed to fetch listing data');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, user]);
  const handleShare = () => {
    const currentUrl = window.location.href; // Get the current URL
    navigator.clipboard.writeText(currentUrl) // Copy URL to clipboard
      .then(() => {
        toast.success("Copied!"); // Show success toast
      })
      .catch((error) => {
        toast.error("Failed to copy URL"); // Show error toast if something goes wrong
      });
  };
  const handleReserveClick = () => {
    navigate(`/stays/reservestays?id=${id}`);
  };
  const handleLike = async () => {
    if (!user) {
      toast.error("You need to be signed in to like a listing");
      return;
    }

    try {
      const response = await axios.post('/likeproperty', { listingId: id });
      setLiked(response.data.message === "Property liked");
      toast.success(response.data.message === "Property liked" ? "Property liked" : "Property unliked");
    } catch (error) {
      toast.error("Error handling like/unlike action");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!listing) return <p>No listing found</p>;
  return (
    <>
      <div className="shade_2 df">
        <h1>Search for stays</h1>
        <p>From budget hotels to luxury rooms and everything in between</p>
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
                    src={
                      listing.images?.[0]?.url
                        ? `https://smashapartments.com/uploads/${listing.images[0].media_name}`
                        : "/assets/properties (2).png"
                    }
                    alt={listing.property_name || "Property Image"}
                  />
              </div>
              <div className="list_2">
                <div className="l22">
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h2>{listing.property_name}</h2>
                      <div className="star_holder">
                        {/* Render star rating based on listing rating */}
                        {[...Array(5)].map((_, index) => (
                          <i className={`bx bx-star ${index < (listing.ratings || 0) ? 'filled' : ''}`} key={index} />
                        ))}
                      </div>
                    </div>
                    <h3 className="small_1" style={{ marginTop: 10 }}>
                      {listing.city}
                    </h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="n94">
                      <h3>{listing.ratings >= 4.5 ? 'Excellent' : 'Good'}</h3>
                      <h3>{listing.reviews || 'No reviews'}</h3>
                    </div>
                    <div
                      className="button b3"
                      style={{
                        marginLeft: 10,
                        maxWidth: "50px !important",
                        minWidth: "100px !important"
                      }}
                    >
                      {listing.ratings || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="l33">
                  <div className="o93">
                    <h3>{listing.property_type || 'Not specified'}</h3>
                    <p>{listing.description || 'No description available.'}</p>
                  </div>
                  <div>
                    <div className="o33">
                      <div>{listing.weekly_discount || 'No discount'}% discounted</div>
                      <div>Daily rate</div>
                    </div>
                    <div className="amount_main">
                      <h1>NGN {listing.price_per_night?.toLocaleString() || '0.00'}</h1>
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
                <p>{listing.contact_email || 'Not provided'}</p>
              </div>
              <div>
                <h3>Phone</h3>
                <p>{listing.contact_phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="l32">{listing.state_name || 'Not provided'}</div>
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
            <p>
              Located in {listing.city || 'Unknown city'}, {listing.description || 'No detailed description available.'}
            </p>
            <br />
            <div>
              <h2>Info</h2>
              <br />
              <div className="l02">
                <div className="l02_1">
                  <div>Number of guests</div>
                  <div>{listing.maximum_occupancy || 'Not specified'}</div>
                </div>
                <div className="l02_1">
                  <div>Number of rooms</div>
                  <div>{listing.number_of_rooms || 'Not specified'}</div>
                </div>
                <div className="l02_1">
                  <div>Number of bathrooms</div>
                  <div>{listing.number_of_bathrooms || 'Not specified'}</div>
                </div>
                <div className="l02_1">
                  <div>Available from</div>
                  <div>{listing.available_from ? new Date(listing.available_from).toDateString() : 'Not specified'}</div>
                </div>
                <div className="l02_1">
                  <div>To</div>
                  <div>{listing.available_to ? new Date(listing.available_to).toDateString() : 'Not specified'}</div>
                </div>
              </div>
            </div>
            <div>
              <h2>Facilities</h2>
              <br />
              <div className="l05">
                {listing.wifi && <div>Wifi <i className="bx bx-wifi" /></div>}
                {listing.pool && <div>Pool <i className="bx bx-water" /></div>}
                {listing.gym && <div>Gym <i className="bx bx-dumbbell" /></div>}
              </div>
            </div>
            <br />
            <div>
              <h2>Services</h2>
              <br />
              <div className="l05">
                {listing.meals && <div>Meal</div>}
                {listing.cleaning && <div>Cleaning</div>}
              </div>
            </div>
            <br />
            <div>
              <h2>Pricing</h2>
              <br />
              <div className="l02">
                <div className="l02_1">
                  <div>Pricing per night</div>
                  <div>NGN {listing.price_per_night?.toLocaleString() || '0.00'}</div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <h2>Rules</h2>
              <br />
              <div className="l05">
                {listing.smoking ? <div>Smoking allowed</div> : <div>No Smoking</div>}
                {listing.pets ? <div>Pets allowed</div> : <div>No pets</div>}
                <div>No loud noises</div>
              </div>
            </div>
            <br />
            <div>
              <h2>Cancellation policy</h2>
              <br />
              <p>{listing.cancellation_policy || 'No policy specified.'}</p>
            </div>
            <br />
            <div>
              <h2>Refund policy</h2>
              <br />
              <p>{listing.refund_policy || 'No policy specified.'}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
