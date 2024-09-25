import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import axios from "axios";
import AirportPickups from "./AiportPickups";
import { toast } from "react-toastify"; // Import React Toastify

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [showPopover1, setShowPopover1] = useState(false);
  const [showPopover2, setShowPopover2] = useState(false);
  const [startDate, endDate] = dateRange;

  const popoverRef1 = useRef(null);
  const popoverRef2 = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [airportQuery, setAirportQuery] = useState("");
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [showAirportPopover, setShowAirportPopover] = useState(false);
  const airportPopoverRef = useRef(null);
  const locationSearch = useLocation(); // Get the current location object to access query params

  const [propertyType, setPropertyType] = useState("");
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
  const rooms_get = params.get("rooms");

  const latitude = params.get("latitude");
  const longitude = params.get("longitude");


  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}&addressdetails=1&limit=5`
      );
      const results = await response.json();
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
  };

  const handleIncrease = (setter, value) => {
    setter(value + 1);
  };

  const handleDecrease = (setter, value) => {
    if (value > 0) {
      setter(value - 1);
    }
  };

  const handleInputClick1 = () => {
    setShowPopover1(true);
    setShowPopover2(false);
  };

  const handleInputClick2 = () => {
    setShowPopover2(true);
    setShowPopover1(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        airportPopoverRef.current &&
        !airportPopoverRef.current.contains(event.target)
      ) {
        setShowAirportPopover(false);
      }
      if (popoverRef1.current && !popoverRef1.current.contains(event.target)) {
        setShowPopover1(false);
      }
      if (popoverRef2.current && !popoverRef2.current.contains(event.target)) {
        setShowPopover2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [airportPopoverRef, popoverRef1, popoverRef2]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    const leftButton = document.querySelector(".left-button");
    const rightButton = document.querySelector(".right-button");
    const rowMain = document.querySelector(".row_main");

    rightButton.addEventListener("click", () => {
      rowMain.scrollBy({ left: 200, behavior: "smooth" });
    });

    leftButton.addEventListener("click", () => {
      rowMain.scrollBy({ left: -200, behavior: "smooth" });
    });

    const menuIcon = document.querySelector(".bx-menu");
    const closeIcon = document.querySelector(".bx-x");
    const smallNav = document.querySelector(".small_nav");

    menuIcon.addEventListener("click", function () {
      smallNav.classList.add("open");
    });

    closeIcon.addEventListener("click", function () {
      smallNav.classList.remove("open");
    });
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (query) queryParams.append("location", query);
    if (startDate) queryParams.append("checkIn", startDate.toISOString());
    if (endDate) queryParams.append("checkOut", endDate.toISOString());
    if (adults > 0) queryParams.append("adults", adults);
    if (children > 0) queryParams.append("children", children);
    if (rooms > 0) queryParams.append("rooms", rooms);

    if (userLocation) {
      queryParams.append("latitude", userLocation.latitude);
      queryParams.append("longitude", userLocation.longitude);
    }

    navigate(`/stays?${queryParams.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("location") || "");
    setDateRange([
      params.get("checkIn") ? new Date(params.get("checkIn")) : null,
      params.get("checkOut") ? new Date(params.get("checkOut")) : null,
    ]);
    const totalPeople = Number(params.get("people") || 0);
    setAdults(Math.floor(totalPeople / 2));
    setChildren(totalPeople % 2);
    setRooms(Number(params.get("rooms") || 0));
    setPropertyType(params.get("propertyType") || "");

    fetchListings();
  }, [location.search]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      params.append("limit", "5");
      params.append("offset", "0");

      const response = await axios.get("/getlistings", { params });
      setListings(response.data);
      setHasMore(response.data.length === 5);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="shade">
        <div className="sa_menu">
          <div className="sa_menu_1">
            <Link to="/stays?propertyType=hotel" className="menu_sa sa_active">
              <img src="assets/ic_outline-local-hotel.svg" alt="" /> Hotels
            </Link>
            <Link to="/stays?propertyType=apartment" className="menu_sa ">
              <img src="assets/heroicons_home.svg" alt="" /> Apartments
            </Link>

            <Link to="/cooffice" className="menu_sa ">
              <img src="assets/ph_building-office.svg" alt="" /> Co-office space
            </Link>
            <Link to="/pickups" className="menu_sa ">
              <img src="assets/cil_flight-takeoff.svg" alt="" /> Airport pickups
            </Link>
            <Link to="/rentals" className="menu_sa ">
              <img src="assets/ph_car.svg" alt="" /> Car rentals
            </Link>
          </div>
        </div>
        <h1>
          Your all-in-one platform{" "}
          <span className="swit"> for seamless bookings. </span>
        </h1>
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
      <br />
      <section className="sa_1 m00">
        <div className="sa_search_max">
          <div className="search_item_max">
            <img src="/assets/bed-regular-84.png" alt="" />
            <input
              type="text"
              placeholder="Location"
              value={query}
              onChange={handleInputChange}
              className="location-input"
            />
            {suggestions.length > 0 && (
              <div className="popover">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="popover-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="search_item_max">
            <img src="/assets/calendar-week-regular-84.png" alt="" />
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check in - Check out"
              onChange={(update) => {
                setDateRange(update);
              }}
              withPortal
            />
          </div>
          <div className="search_item_max" ref={popoverRef1}>
            <img src="/assets/user-regular-84.png" alt="" />
            <input
              type="text"
              placeholder={`Adults: ${adults} | Children: ${children} | Rooms: ${rooms}`}
              readOnly
              onClick={handleInputClick1}
            />

            {showPopover1 && (
              <div className="popover">
                <div className="popover-item new_pop">
                  Adults
                  <div className="value_decision">
                    <i
                      className="bx bx-minus"
                      onClick={() => handleDecrease(setAdults, adults)}
                    ></i>
                    <input type="number" value={adults} readOnly />
                    <i
                      className="bx bx-plus"
                      onClick={() => handleIncrease(setAdults, adults)}
                    ></i>
                  </div>
                </div>
                <div className="popover-item new_pop">
                  Children
                  <div className="value_decision">
                    <i
                      className="bx bx-minus"
                      onClick={() => handleDecrease(setChildren, children)}
                    ></i>
                    <input type="number" value={children} readOnly />
                    <i
                      className="bx bx-plus"
                      onClick={() => handleIncrease(setChildren, children)}
                    ></i>
                  </div>
                </div>
                <div className="popover-item new_pop">
                  Rooms
                  <div className="value_decision">
                    <i
                      className="bx bx-minus"
                      onClick={() => handleDecrease(setRooms, rooms)}
                    ></i>
                    <input type="number" value={rooms} readOnly />
                    <i
                      className="bx bx-plus"
                      onClick={() => handleIncrease(setRooms, rooms)}
                    ></i>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="button b2" onClick={handleSearch}>
            Search
          </div>
        </div>
      </section>
      <br />
      <section className="sa_2">
        <div className="level">
          <h2>Browse by property type</h2>
        </div>
        <div className="row_main_container">
          <button className="scroll-button left-button">&lt;</button>
          <div className="row_main">
            <div className="pt">
              <img src="assets/properties (2).png" alt="" />
              <h3>Hotels</h3>
              <p> Find hotels available in your location</p>
              <Link to="/stays?propertyType=hotel" className="button b2 b3">
                Find yours
              </Link>
            </div>
            <div className="pt">
              <img src="assets/properties (1).png" alt="" />
              <h3>Apartments</h3>
              <p>Find apartments available in your location</p>
              <Link
                to="/stays?propertyType=apartments"
                className="button b2 b3"
              >
                Find yours
              </Link>
            </div>
            <div className="pt">
              <img src="assets/properties (3).png" alt="" />
              <h3>Villas</h3>
              <p>Find villas available in your location</p>
              <Link to="/stays?propertyType=villa" className="button b2 b3">
                Find yours
              </Link>
            </div>
          </div>
          <button className="scroll-button right-button">&gt;</button>
        </div>
      </section>
      <br />
      <br />
      <section className="sa_2">
        <div className="level">
          <h2>Discover listings</h2>
        </div>
        <div className="row_main_container padding_item">
          <div className="listings_list">
            {listings.map((listing) => (
              <div className="list_node" key={listing._id}>
                <div className="list_1">
                  <img
                    src={`http://smashapartments.com/uploads/${listing.images[0]?.media_name}`}
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
                        <div>{listing.weekly_discount || "0"}% discounted</div>
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
                      <Link to={`/stays/staysdetails?id=${listing._id}`}>
                        <div className="button b3 b4 b2">See availability</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/stays" className="button_6 b3 b2 syw ">
              See more
            </Link>
          </div>
        </div>
      </section>

<AirportPickups/>
      <br />
      <section className="sa_3">
        <img src="assets/stays.png" alt="" />
        <div className="shade_flight">
          <div className="shade_4">
            <h1>
              Stays, <span className="swit">Properties</span>
            </h1>
            <p>Discover the best deals for your next travel.</p>
          </div>
          <div className="sa_search_max">
            <div className="search_item_max">
              <img src="/assets/bed-regular-84.png" alt="" />
              <input
                type="text"
                placeholder="Location"
                value={query}
                onChange={handleInputChange}
                className="location-input"
              />
              {suggestions.length > 0 && (
                <div className="popover">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      className="popover-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="search_item_max">
              <img src="/assets/calendar-week-regular-84.png" alt="" />
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                placeholderText="Check in - Check out"
                onChange={(update) => {
                  setDateRange(update);
                }}
                withPortal
              />
            </div>

            <div className="search_item_max" ref={popoverRef2}>
              <img src="/assets/user-regular-84.png" alt="" />
              <input
                type="text"
                placeholder={`Adults: ${adults} | Children: ${children} | Rooms: ${rooms}`}
                readOnly
                onClick={handleInputClick2}
              />

              {showPopover2 && (
                <div className="popover">
                  <div className="popover-item new_pop">
                    Adults
                    <div className="value_decision">
                      <i
                        className="bx bx-minus"
                        onClick={() => handleDecrease(setAdults, adults)}
                      ></i>
                      <input type="number" value={adults} readOnly />
                      <i
                        className="bx bx-plus"
                        onClick={() => handleIncrease(setAdults, adults)}
                      ></i>
                    </div>
                  </div>
                  <div className="popover-item new_pop">
                    Children
                    <div className="value_decision">
                      <i
                        className="bx bx-minus"
                        onClick={() => handleDecrease(setChildren, children)}
                      ></i>
                      <input type="number" value={children} readOnly />
                      <i
                        className="bx bx-plus"
                        onClick={() => handleIncrease(setChildren, children)}
                      ></i>
                    </div>
                  </div>
                  <div className="popover-item new_pop">
                    Rooms
                    <div className="value_decision">
                      <i
                        className="bx bx-minus"
                        onClick={() => handleDecrease(setRooms, rooms)}
                      ></i>
                      <input type="number" value={rooms} readOnly />
                      <i
                        className="bx bx-plus"
                        onClick={() => handleIncrease(setRooms, rooms)}
                      ></i>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="button" onClick={handleSearch}>
              Search
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
