import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Pickups() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pickups, setPickups] = useState([]);
  const [initialPickups, setInitialPickups] = useState([]);
  const [filters, setFilters] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  // Search form state
  const [searchAirport, setSearchAirport] = useState("");

  // Extract query params
  const params = new URLSearchParams(location.search);
  const airportParam = params.get("airport");

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await axios.get("/getpickups", {
          params: { limit: 5, offset: 0, airport: airportParam },
        });
        setPickups(response.data);
        setInitialPickups(response.data);
        setHasMore(response.data.length === 5);
      } catch (error) {
        console.error("Error fetching pickups:", error);
      }
    };

    fetchPickups();
  }, [airportParam]);

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

  const handleSearchSubmit = () => {
    const queryParams = new URLSearchParams();
    if (searchAirport) queryParams.append("airport", searchAirport);

    navigate(`/pickups?${queryParams.toString()}`);
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
            <div className="search_item">
              <input
                type="text"
                placeholder="Airport"
                value={searchAirport}
                onChange={(e) => setSearchAirport(e.target.value)}
              />
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
                      `https://smashapartments.onrender.com/uploads/${pickup.images?.[0]?.media_name}` ||
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
