import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import React Toastify

export default function Rentals() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [initialRentals, setInitialRentals] = useState([]);
  const [filters, setFilters] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  // Search form state
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCarType, setSearchCarType] = useState('');

  // Extract query params
  const params = new URLSearchParams(location.search);
  const locationParam = params.get('location');
  const carTypeParam = params.get('carType');
  const [searchLocationSuggestions, setSearchLocationSuggestions] = useState([]);
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const locationPopoverRef = useRef(null);

  const handleLocationInputChange = async (e) => {
    const value = e.target.value;
    setSearchLocation(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}&addressdetails=1&limit=5`
        );
        const results = await response.json();
        setSearchLocationSuggestions(results);
        setShowLocationPopover(true);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setSearchLocationSuggestions([]);
      setShowLocationPopover(false);
    }
  };
  const handleLocationSuggestionClick = (suggestion) => {
    setSearchLocation(suggestion.display_name);
    setSearchLocationSuggestions([]);
    setShowLocationPopover(false);
  };

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get('/getrentals', {
          params: { limit: 5, offset: 0, location: locationParam, carType: carTypeParam },
        });
        toast.success("Fetched listings");
        setRentals(response.data);
        setInitialRentals(response.data);
        setHasMore(response.data.length === 5);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };

    fetchRentals();
  }, [locationParam, carTypeParam]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const fetchRentalsWithFilters = async () => {
        setLoading(true);
        try {
          const response = await axios.get('/getrentals', {
            params: { 
              ...filters, 
              limit: 5, 
              offset: 0,
              location: locationParam,
              carType: carTypeParam
            },
          });
          setRentals(response.data);
          setHasMore(response.data.length === 5);
        } catch (error) {
          console.error('Error fetching rentals with filters:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchRentalsWithFilters();
    } else {
      setRentals(initialRentals);
      setOffset(0);
    }
  }, [filters, locationParam, carTypeParam]);

  const handleFilterChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePriceChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: Number(e.target.value),
    }));
  };

  const handleSearchSubmit = () => {

    toast("Searching...")
    const queryParams = new URLSearchParams();
    if (searchLocation) queryParams.append('location', searchLocation);
    if (searchCarType) queryParams.append('carType', searchCarType);

    navigate(`/rentals?${queryParams.toString()}`);
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const response = await axios.get('/getrentals', {
        params: { 
          ...filters,
          limit: 5, 
          offset: rentals.length, 
          location: locationParam, 
          carType: carTypeParam 
        },
      });
      setRentals([...rentals, ...response.data]);
      setHasMore(response.data.length === 5);
      setOffset(offset + 5);
    } catch (error) {
      console.error('Error loading more rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowOnMap = () => {
    const location = locationParam || searchLocation || '';
    if (location) {
      const encodedLocation = encodeURIComponent(location);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
    } else {
      alert('Please enter a location to show on the map.');
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationPopoverRef.current &&
        !locationPopoverRef.current.contains(event.target)
      ) {
        setShowLocationPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="shade_2 df">
        <h1>Search for car rentals</h1>
        <p>From budget cars to luxury vehicles and everything in between</p>
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
      <section className="majestic">
        <div className="col_1">
          {locationParam && (
            <>
              <div className="map_area">
                <img className="map_area" src="assets/map.png" alt="Map" />
                <div className="over_item">
                  <div className="button b3" onClick={handleShowOnMap}>Show on map</div>
                </div>
              </div>
              <br />
              <br />
              <br />
            </>
          )}
          <div>
            <h2>Filter by</h2>
            <br />
            <p>NGN {filters.minPrice || 10000} - NGN {filters.maxPrice || 300000}+</p>
            <br />
            <form action="">
              <input
                className="slide"
                type="range"
                name="minPrice"
                min="10000"
                max="300000"
                value={filters.minPrice || 10000}
                onChange={handlePriceChange}
              />
              <input
                className="slide"
                type="range"
                name="maxPrice"
                min="10000"
                max="300000"
                value={filters.maxPrice || 300000}
                onChange={handlePriceChange}
              />
            </form>
            <br />
            <form action="" className="ti">
              <label htmlFor="">Popular filters</label>
              <br />
              <br />
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="cancellationPolicy"
                  checked={filters.cancellationPolicy}
                  onChange={handleFilterChange}
                />
                <label htmlFor="cancellationPolicy">Cancellation policy</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="refundPolicy"
                  checked={filters.refundPolicy}
                  onChange={handleFilterChange}
                />
                <label htmlFor="refundPolicy">Refund policy</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="extraDriver"
                  checked={filters.extraDriver}
                  onChange={handleFilterChange}
                />
                <label htmlFor="extraDriver">Extra driver</label>
              </div>
            </form>
            <br />
            <br />
            <form action="" className="ti">
              <label htmlFor="">Ratings</label>
              <br />
              <br />
              {[1, 2, 3, 4, 5].map((star) => (
                <div className="flex_item" key={star}>
                  <input
                    className="check"
                    type="checkbox"
                    name="ratings"
                    value={star}
                    checked={filters.ratings === star}
                    onChange={handleFilterChange}
                  />
                  <label htmlFor={`star${star}`}>{star} star{star > 1 ? 's' : ''}</label>
                </div>
              ))}
            </form>
          </div>
        </div>
        <div className="col_2">
          <div className="sa_search_1 i98">
          <div className="search_item new_maxi" ref={locationPopoverRef}>
            <input
              type="text"
              placeholder="Enter destination"
              value={searchLocation}
              onChange={handleLocationInputChange}
            />
            {showLocationPopover && searchLocationSuggestions.length > 0 && (
              <div className="popover">
                {searchLocationSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="popover-item"
                    onClick={() => handleLocationSuggestionClick(suggestion)}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
            <div className="button b2 b3" onClick={handleSearchSubmit}>Search</div>
          </div>
          <div className="listings_list">
            {rentals.map((rental) => (
              <div className="list_node" key={rental._id}>
                <div className="list_1">
                  <img src={`https://smashapartments.com/uploads/${rental.images[0].media_name}` || "assets/bg (3).png"} alt={rental.carNameModel} />
                </div>
                <div className="list_2">
                  <div className="l22">
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h2>{rental.carNameModel}</h2>
                        <div className="star_holder">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`bx bx-star ${i < Math.floor(rental.ratings || 0) ? 'filled' : ''}`} />
                          ))}
                        </div>
                      </div>
                      <h3 className="small_1" style={{ marginTop: 10 }}>
                        {rental.location}
                      </h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="n94">
                        <h3>{rental.ratings >= 4.5 ? 'Excellent' : rental.ratings >= 3.5 ? 'Very Good' : rental.ratings >= 2.5 ? 'Good' : 'Average'}</h3>
                        <h3>{rental.reviews || 'No'} reviews</h3>
                      </div>
                      <div
                        className="rating_cont"
                        style={{
                          marginLeft: 10,
                          maxWidth: "50px !important",
                          minWidth: "100px !important"
                        }}
                      >
                        {rental.ratings ? rental.ratings.toFixed(1) : 'N/A'}
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
                        <div>{rental.discount || 0}% discounted</div>
                        <div>Daily rate</div>
                      </div>
                      <div className="amount_main">
                        <h1>NGN {rental.rentalPrice?.toLocaleString() || 'N/A'}</h1>
                      </div>
                      <div className="o33">
                        <div>Includes taxes</div>
                      </div>
                      <br />
                      <Link to={`rentaldetails?id=${rental._id}`}>
                        <div className="button b3 b4 b2">See availability</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {hasMore && (
              <div className="view_more">
                <button onClick={loadMore}>View More</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}