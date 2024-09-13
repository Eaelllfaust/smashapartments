import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Stays() {
  const locationSearch = useLocation(); // Get the current location object to access query params
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [initialListings, setInitialListings] = useState([]); // Store initial listings
  const [filters, setFilters] = useState({}); // Initialize filters as an empty object
  const [hasMore, setHasMore] = useState(true); // Flag to indicate if there are more listings
  const [loading, setLoading] = useState(false); // Flag to indicate if the component is loading more listings
  const [offset, setOffset] = useState(0); // Offset for pagination

  // State for sa_search_1 form inputs
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchPeople, setSearchPeople] = useState("");
  const [searchRooms, setSearchRooms] = useState("");

  // Extract query params from URL
  const params = new URLSearchParams(locationSearch.search);
  const locationParam = params.get("location");
  const date = params.get("date");
  const people = params.get("people");
  const rooms = params.get("rooms");

  const latitude = params.get("latitude");
  const longitude = params.get("longitude");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("/getlistings", {
          params: {
            limit: 5,
            offset: 0,
            location: locationParam,
            date,
            people,
            rooms,
          },
        });
        setListings(response.data);
        setHasMore(response.data.length === 5);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [locationParam, date, people, rooms]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      // If filters are applied
      const fetchListingsWithFilters = async () => {
        try {
          const response = await axios.get("/getlistings", {
            params: { ...filters, limit: 5, offset: 0 }, // Fetch 5 listings at a time
          });
          setListings(response.data);
          setHasMore(response.data.length === 5); // Check if there are more listings
        } catch (error) {
          console.error("Error fetching listings with filters:", error);
        }
      };

      fetchListingsWithFilters();
    } else {
      // If all filters are removed, reset to initial listings
      setListings(initialListings); // Reset listings to initial value
      setOffset(0); // Reset offset to 0
    }
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: Number(e.target.value),
    }));
  };

  const handleSearchSubmit = () => {
    const queryParams = new URLSearchParams();
    if (searchLocation) queryParams.append("location", searchLocation);
    if (searchDate) queryParams.append("date", searchDate);
    if (searchPeople) queryParams.append("people", searchPeople);
    if (searchRooms) queryParams.append("rooms", searchRooms);

    navigate(`/stays?${queryParams.toString()}`);
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const response = await axios.get("/getlistings", {
        params: {
          limit: 5,
          offset: listings.length,
          location: locationParam,
          date,
          people,
          rooms,
        },
      });
      setListings([...listings, ...response.data]);
      setHasMore(response.data.length === 5);
    } catch (error) {
      console.error("Error loading more listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const [isMockHidden, setIsMockHidden] = useState(false);

  const handleMockClick = () => {
    setIsMockHidden(true);
  };
  return (
    <>
      <div className="shade_2 df">
        <h1>Search for stays</h1>
        <p>From budget hotels to luxury rooms and everything in between</p>
        <img src="assets/linear_bg.png" className="shade_bg" alt="" />
        <div className="shade_item">
          <img src="assets/bg (2).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (1).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (4).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (3).png" alt="" />
        </div>
      </div>
      <section className="majestic">
        <div className="col_1">
          {locationParam && (
            <>
              <div className="map_area">
                <img className="map_area" src="assets/map.png" alt="Map" />
                <div className="over_item">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      locationParam
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button b3"
                  >
                    Show on map
                  </a>
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
            <p>
              NGN {filters.minPrice || 200} - NGN {filters.maxPrice || 1000}+
            </p>
            <br />
            <form action="">
              <input
                className="slide"
                type="range"
                name="minPrice"
                value={filters.minPrice || 200}
                min="200"
                max="300"
                onChange={handlePriceChange}
              />
              <input
                className="slide"
                type="range"
                name="maxPrice"
                value={filters.maxPrice || 1000}
                min="10"
                max="1000"
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
                  name="wifi"
                  checked={filters.wifi}
                  onChange={handleFilterChange}
                />
                <label htmlFor="wifi">Wifi</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="pool"
                  checked={filters.pool}
                  onChange={handleFilterChange}
                />
                <label htmlFor="pool">Pool</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="parking"
                  checked={filters.parking}
                  onChange={handleFilterChange}
                />
                <label htmlFor="parking">Parking</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="gym"
                  checked={filters.gym}
                  onChange={handleFilterChange}
                />
                <label htmlFor="gym">Gym</label>
              </div>
            </form>
            <br />
            <br />
            <form action="" className="ti">
              <label htmlFor="">Ratings</label>
              <br />
              <br />
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="ratings"
                  value="1"
                  checked={filters.ratings === 1}
                  onChange={handleFilterChange}
                />
                <label htmlFor="ratings">1 star</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="ratings"
                  value="2"
                  checked={filters.ratings === 2}
                  onChange={handleFilterChange}
                />
                <label htmlFor="ratings">2 stars</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="ratings"
                  value="3"
                  checked={filters.ratings === 3}
                  onChange={handleFilterChange}
                />
                <label htmlFor="ratings">3 stars</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="ratings"
                  value="4"
                  checked={filters.ratings === 4}
                  onChange={handleFilterChange}
                />
                <label htmlFor="ratings">4 stars</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="ratings"
                  value="5"
                  checked={filters.ratings === 5}
                  onChange={handleFilterChange}
                />
                <label htmlFor="ratings">5 stars</label>
              </div>
            </form>
          </div>
        </div>
        <div className="col_2">
        <div className={`sa_search_1 i98 mock ${isMockHidden ? 'hide' : ''}`} onClick={handleMockClick}>
        <div className="search_item doom">
          <input
            type="text"
            placeholder="Search for your next getaway"
          />
        </div>
        <div className="button b2 b3">
          Search
        </div>
      </div>

      {/* Detailed Search Container */}
      <div className={`sa_search_1 i98 k99 p00 ${isMockHidden ? '' : 'hide'}`}>
        <div className="search_item">
          <input 
            type="text" 
            placeholder="Location" 
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
        <div className="search_item">
          <input 
            type="date" 
            placeholder="Date" 
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
        <div className="search_item">
          <input 
            type="number" 
            placeholder="People" 
            value={searchPeople}
            onChange={(e) => setSearchPeople(e.target.value)}
          />
        </div>
        <div className="search_item">
          <input 
            type="number" 
            placeholder="Rooms" 
            value={searchRooms}
            onChange={(e) => setSearchRooms(e.target.value)}
          />
        </div>
        <div className="button b2 b3" onClick={handleSearchSubmit}>Search</div>
      </div>
          <div className="listings_list">
            {listings.map((listing) => (
              <div className="list_node" key={listing._id}>
                <div className="list_1">
                  <img
                    src={`https://smashapartments-kyto.onrender.com/uploads/${listing.images[0]?.media_name}`}
                    alt={listing.property_name}
                  />
                </div>
                <div className="list_2">
                  <div className="l22">
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h2>{listing.property_name}</h2>
                        <div className="star_holder">
                          <i className="bx bx-star" />
                          <i className="bx bx-star" />
                          <i className="bx bx-star" />
                          <i className="bx bx-star" />
                          <i className="bx bx-star" />
                        </div>
                      </div>
                      <h3 className="small_1" style={{ marginTop: 10 }}>
                        {listing.city}, {listing.state_name}
                      </h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="n94">
                        <h3>{listing.ratings >= 4.5 ? "Excellent" : "Good"}</h3>
                        <h3>{listing.reviews || "No reviews"}</h3>
                      </div>
                      <div
                        className="button b3"
                        style={{
                          marginLeft: 10,
                          maxWidth: "50px !important",
                          minWidth: "100px !important",
                        }}
                      >
                        {listing.ratings || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="l33">
                    <div className="o93">
                      <h3>{listing.property_type || "Not specified"}</h3>
                      <p>
                        {listing.description || "No description available."}
                      </p>
                    </div>
                    <div>
                      <div className="o33">
                        <div>
                          {listing.weekly_discount || "No discount"}% discounted
                        </div>
                        <div>Daily rate</div>
                      </div>
                      <div className="amount_main">
                        <h1>
                          NGN{" "}
                          {listing.price_per_night?.toLocaleString() || "0.00"}
                        </h1>
                      </div>
                      <div className="o33">
                        <div>Includes taxes</div>
                      </div>
                      <br />
                      <Link to={`staysdetails?id=${listing._id}`}>
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
