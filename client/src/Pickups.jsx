import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'; 


const airports = [
  {
    id: 1,
    name: "Nnamdi Azikiwe International Airport",
    code: "ABV",
    city: "Abuja",
  },
  {
    id: 2,
    name: "Murtala Muhammed International Airport",
    code: "LOS",
    city: "Lagos",
  },
  {
    id: 3,
    name: "Port Harcourt International Airport",
    code: "PHC",
    city: "Port Harcourt",
  },
  {
    id: 4,
    name: "Mallam Aminu Kano International Airport",
    code: "KAN",
    city: "Kano",
  },
  {
    id: 5,
    name: "Akanu Ibiam International Airport",
    code: "ENU",
    city: "Enugu",
  },
  {
    id: 6,
    name: "Margaret Ekpo International Airport",
    code: "CBQ",
    city: "Calabar",
  },
  {
    id: 7,
    name: "Sadiq Abubakar III International Airport",
    code: "SKO",
    city: "Sokoto",
  },
  {
    id: 8,
    name: "Maiduguri International Airport",
    code: "MIU",
    city: "Maiduguri",
  },
  { id: 9, name: "Kaduna Airport", code: "KAD", city: "Kaduna" },
  { id: 10, name: "Ilorin International Airport", code: "ILR", city: "Ilorin" },
  { id: 11, name: "Akure Airport", code: "AKR", city: "Akure" },
  {
    id: 12,
    name: "Sam Mbakwe International Cargo Airport",
    code: "QOW",
    city: "Owerri",
  },
  { id: 13, name: "Asaba International Airport", code: "ABB", city: "Asaba" },
  { id: 14, name: "Benin Airport", code: "BNI", city: "Benin City" },
  { id: 15, name: "Yakubu Gowon Airport", code: "JOS", city: "Jos" },
  { id: 16, name: "Yola Airport", code: "YOL", city: "Yola" },
  { id: 17, name: "Kebbi Airport", code: "BKO", city: "Birnin Kebbi" },
  {
    id: 18,
    name: "Sir Abubakar Tafawa Balewa Airport",
    code: "BCU",
    city: "Bauchi",
  },
  { id: 19, name: "Ibadan Airport", code: "IBA", city: "Ibadan" },
  { id: 20, name: "Makurdi Airport", code: "MDI", city: "Makurdi" },
  { id: 21, name: "Warri Airport", code: "QRW", city: "Warri" },
  { id: 22, name: "Zaria Airport", code: "ZAR", city: "Zaria" },
  { id: 23, name: "Minna Airport", code: "MXJ", city: "Minna" },
  { id: 24, name: "Dutse International Airport", code: "DUT", city: "Dutse" },
  {
    id: 25,
    name: "Gombe Lawanti International Airport",
    code: "GMO",
    city: "Gombe",
  },
  { id: 26, name: "Jalingo Airport", code: "JAL", city: "Jalingo" },
];

export default function Pickups() {
 const location = useLocation();
  const navigate = useNavigate();
  const [pickups, setPickups] = useState([]);
  const [initialPickups, setInitialPickups] = useState([]);
  const [filters, setFilters] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  // Airport search state
  const [airportQuery, setAirportQuery] = useState("");
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [showAirportPopover, setShowAirportPopover] = useState(false);
  const airportPopoverRef = useRef(null);

  // Destination search state
  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDestinationPopover, setShowDestinationPopover] = useState(false);
  const destinationPopoverRef = useRef(null);

  // Extract query params
  const params = new URLSearchParams(location.search);
  const airportParam = params.get("airport");
  const destinationParam = params.get("destination");

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await axios.get("/getpickups", {
          params: { limit: 5, offset: 0, airport: airportParam, destination: destinationParam },
        });
        toast.success("Fetched listings")
        setPickups(response.data);
        setInitialPickups(response.data);
        setHasMore(response.data.length === 5);
      } catch (error) {
        console.error("Error fetching pickups:", error);
      }
    };

    fetchPickups();
  }, [airportParam, destinationParam]);


  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const fetchPickupsWithFilters = async () => {
        setLoading(true);
        try {
          const response = await axios.get("/getpickups", {
            params: {
              ...filters,
              limit: 5,
              offset: 0,
              airport: airportParam,
            },
          });
          setPickups(response.data);
          setHasMore(response.data.length === 5);
        } catch (error) {
          console.error("Error fetching pickups with filters:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPickupsWithFilters();
    } else {
      setPickups(initialPickups);
      setOffset(0);
    }
  }, [filters, airportParam]);

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

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const response = await axios.get("/getpickups", {
        params: {
          ...filters,
          limit: 5,
          offset: pickups.length,
          airport: airportParam,
        },
      });
      setPickups([...pickups, ...response.data]);
      setHasMore(response.data.length === 5);
      setOffset(offset + 5);
    } catch (error) {
      console.error("Error loading more pickups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowOnMap = () => {
    const airport = airportParam || searchAirport || "";
    if (airport) {
      const encodedAirport = encodeURIComponent(airport);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAirport}+airport`,
        "_blank"
      );
    } else {
      alert("Please enter an airport to show on the map.");
    }
  };
  const handleAirportInputChange = (e) => {
    const value = e.target.value;
    setAirportQuery(value);

    if (value.length > 1) {
      const filteredAirports = airports
        .filter(
          (airport) =>
            airport.name.toLowerCase().includes(value.toLowerCase()) ||
            airport.code.toLowerCase().includes(value.toLowerCase()) ||
            airport.city.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setAirportSuggestions(filteredAirports);
      setShowAirportPopover(true);
    } else {
      setAirportSuggestions([]);
      setShowAirportPopover(false);
    }
  };
  const handleAirportSuggestionClick = (airport) => {
    setAirportQuery(`${airport.name} (${airport.code}), ${airport.city}`);
    setAirportSuggestions([]);
    setShowAirportPopover(false);
  };
  const handleDestinationInputChange = async (e) => {
    const value = e.target.value;
    setDestinationQuery(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}&addressdetails=1&limit=5`
        );
        const results = await response.json();
        setDestinationSuggestions(results);
        setShowDestinationPopover(true);
      } catch (error) {
        console.error("Error fetching destination suggestions:", error);
      }
    } else {
      setDestinationSuggestions([]);
      setShowDestinationPopover(false);
    }
  };
  const handleDestinationSuggestionClick = (suggestion) => {
    setDestinationQuery(suggestion.display_name);
    setDestinationSuggestions([]);
    setShowDestinationPopover(false);
  };

  const handleSearchSubmit = () => {
    toast("Searching...")
    const queryParams = new URLSearchParams();
    if (airportQuery) queryParams.append("airport", airportQuery);
    if (destinationQuery) queryParams.append("destination", destinationQuery);

    navigate(`/pickups?${queryParams.toString()}`);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        airportPopoverRef.current &&
        !airportPopoverRef.current.contains(event.target)
      ) {
        setShowAirportPopover(false);
      }
      if (
        destinationPopoverRef.current &&
        !destinationPopoverRef.current.contains(event.target)
      ) {
        setShowDestinationPopover(false);
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
        <h1>Search for pickups</h1>
        <p>From budget rides to luxury transfers and everything in between</p>
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
          {airportParam && (
            <>
              <div className="map_area">
                <img className="map_area" src="assets/map.png" alt="Map" />
                <div className="over_item">
                  <div className="button b3" onClick={handleShowOnMap}>
                    Show on map
                  </div>
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
              NGN {filters.minPrice || 10000} - NGN {filters.maxPrice || 300000}
              +
            </p>
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
              <label htmlFor="">Extra Features</label>
              <br />
              <br />
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="extraLuggage"
                  checked={filters.extraLuggage}
                  onChange={handleFilterChange}
                />
                <label htmlFor="extraLuggage">Extra Luggage</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="waitingTime"
                  checked={filters.waitingTime}
                  onChange={handleFilterChange}
                />
                <label htmlFor="waitingTime">Waiting Time</label>
              </div>
            </form>
          </div>
        </div>
        <div className="col_2">
        <div className="sa_search_1 i98">
            <div className="search_item" ref={airportPopoverRef}>
              <input
              className='new_maxi'
                type="text"
                placeholder="Enter airport name, code, or city"
                value={airportQuery}
                onChange={handleAirportInputChange}
              />
              {showAirportPopover && airportSuggestions.length > 0 && (
                <div className="popover">
                  {airportSuggestions.map((airport) => (
                    <div
                      key={airport.id}
                      className="popover-item"
                      onClick={() => handleAirportSuggestionClick(airport)}
                    >
                      {airport.name} ({airport.code}), {airport.city}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="search_item" ref={destinationPopoverRef}>
              <input
                type="text"
                placeholder="Enter destination"
                value={destinationQuery}
                onChange={handleDestinationInputChange}
              />
              {showDestinationPopover && destinationSuggestions.length > 0 && (
                <div className="popover">
                  {destinationSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      className="popover-item"
                      onClick={() => handleDestinationSuggestionClick(suggestion)}
                    >
                      {suggestion.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="button b2 b3" onClick={handleSearchSubmit}>
              Search
            </div>
          </div>
          <div className="listings_list">
            {pickups.map((pickup) => (
              <div className="list_node" key={pickup._id}>
                <div className="list_1">
                  <img
                    src={
                      `https://smashapartments.com/uploads/${pickup.images?.[0]?.media_name}` ||
                      "/assets/bg (4).png"
                    }
                    alt={pickup.serviceName}
                  />
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
                        <h1>NGN {pickup.pickupPrice.toLocaleString()}</h1>
                      </div>
                      <div className="o33">
                        <div>
                          {pickup.extraLuggage
                            ? "Extra luggage allowed"
                            : "Standard luggage"}
                        </div>
                        <div>
                          {pickup.waitingTime
                            ? `Waiting time: ${pickup.waitingTime.toLocaleString()}`
                            : "No waiting time"}
                        </div>
                      </div>
                      <br />
                      <Link to={`pickupdetails?id=${pickup._id}`}>
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
