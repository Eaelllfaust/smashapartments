import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../context/userContext'; 

export default function CoofficeDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const [cooffice, setCooffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCooffice = async () => {
      try {
        const response = await axios.get(`/getcoofficedata/${id}`);
        setCooffice(response.data);
    
        if (user) {
          const likedResponse = await axios.get(`/checkliked/${id}`);
          setLiked(likedResponse.data.liked);
        }
      } catch (error) {
        setError('Failed to fetch cooffice data');
      } finally {
        setLoading(false);
      }
    };

    fetchCooffice();
  }, [id, user]);

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => toast.success("Copied!"))
      .catch(() => toast.error("Failed to copy URL"));
  };

  const handleReserveClick = () => {
    navigate(`/cooffice/reservecooffice?id=${id}`);
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("You need to be signed in to like a cooffice");
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
  if (!cooffice) return <p>No cooffice found</p>;

  return (
    <>
      <div className="shade_2 df">
        <h1>Search for cooffice</h1>
        <p>From budget offices to luxury spaces and everything in between</p>
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
                  src={cooffice.images?.[0]?.url ? 
                       `https://smashapartments.onrender.com/${cooffice.images[0].url}` : 
                       '/assets/bg (1).png'}
                  alt={cooffice.property_name || 'Cooffice Image'}
                />
              </div>
              <div className="list_2">
                <div className="l22">
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h2>{cooffice.office_space_name}</h2>
                      <div className="star_holder">
                        {[...Array(5)].map((_, index) => (
                          <i className={`bx bx-star ${index < (cooffice.ratings || 0) ? 'filled' : ''}`} key={index} />
                        ))}
                      </div>
                    </div>
                    <h3 className="small_1" style={{ marginTop: 10 }}>
                      {cooffice.city}
                    </h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="n94">
                      <h3>{cooffice.ratings >= 4.5 ? 'Excellent' : 'Good'}</h3>
                      <h3>{cooffice.reviews || 'No reviews'}</h3>
                    </div>
                    <div
                      className="button b3"
                      style={{
                        marginLeft: 10,
                        maxWidth: "50px !important",
                        minWidth: "100px !important"
                      }}
                    >
                      {cooffice.ratings || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="l33">
                  <div className="o93">
                    <h3>{cooffice.property_type || 'Cooffice'}</h3>
                    <p>{cooffice.description || 'No description available.'}</p>
                  </div>
                  <div>
                    <div className="o33">
                      <div>{cooffice.discount || '0'}% discounted</div>
                      <div>Daily rate</div>
                    </div>
                    <div className="amount_main">
                      <h1>NGN {cooffice.price_per_day?.toLocaleString() || '0.00'}</h1>
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
                <p>{cooffice.contact_email || 'Not provided'}</p>
              </div>
              <div>
                <h3>Phone</h3>
                <p>{cooffice.contact_phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="l32">{cooffice.state_name || 'Address not provided'}</div>
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
            <p>{cooffice.description || 'No detailed description available.'}</p>
            <br />
            <div>
              <h2>Info</h2>
              <br />
              <div className="l02">
                <div className="l02_1">
                  <div>Size of office</div>
                  <div>{cooffice.size_of_office || 'Not specified'} square foot</div>
                </div>
                <div className="l02_1">
                  <div>Number of desks</div>
                  <div>{cooffice.number_of_desks || 'Not specified'}</div>
                </div>
                <div className="l02_1">
                  <div>Available from</div>
                  <div>{cooffice.available_from ? new Date(cooffice.available_from).toDateString() : 'Not specified'}</div>
                </div>
                <div className="l02_1">
                  <div>To</div>
                  <div>{cooffice.available_to ? new Date(cooffice.available_to).toDateString() : 'Not specified'}</div>
                </div>
              </div>
            </div>
            <div>
              <h2>Facilities</h2>
              <br />
              <div className="l05">
                {cooffice.wifi && <div>Wifi <i className="bx bx-wifi" /></div>}
                {cooffice.conference_room && <div>Conference room <i className="bx bx-group" /></div>}
                {cooffice.printers && <div>Printers <i className="bx bx-printer" /></div>}
                {cooffice.parking && <div>Parking <i className="bx bx-car" /></div>}
              </div>
            </div>
            <br />
            <div>
              <h2>Services</h2>
              <br />
              <div className="l05">
                {cooffice.catering && <div>Catering</div>}
                {cooffice.admin_support && <div>Administrative support</div>}
              </div>
            </div>
            <br />
            <div>
              <h2>Pricing</h2>
              <br />
              <div className="l02">
                <div className="l02_1">
                  <div>Pricing per day</div>
                  <div>NGN {cooffice.price_per_day?.toLocaleString() || '0.00'}</div>
                </div>
                <div className="l02_1">
                  <div>Pricing per week</div>
                  <div>NGN {cooffice.price_weekly?.toLocaleString() || '0.00'}</div>
                </div>
                <div className="l02_1">
                  <div>Pricing per month</div>
                  <div>NGN {cooffice.price_monthly?.toLocaleString() || '0.00'}</div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <h2>Rules</h2>
              <br />
              <div className="l05">
                {!cooffice.smoking && <div>No Smoking</div>}
                {!cooffice.pets && <div>No pets</div>}
                <div>No loud noises</div>
              </div>
            </div>
            <br />
            <div>
              <h2>Cancellation policy</h2>
              <br />
              <p>{cooffice.cancellation_policy || 'No cancellation policy specified.'}</p>
            </div>
            <br />
            <div>
              <h2>Refund policy</h2>
              <br />
              <p>{cooffice.refund_policy || 'No refund policy specified.'}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}