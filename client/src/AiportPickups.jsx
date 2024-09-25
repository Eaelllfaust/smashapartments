import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
const AirportPickups = () => {
  const navigate = useNavigate();
  const [airportQuery, setAirportQuery] = useState("");
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [showAirportPopover, setShowAirportPopover] = useState(false);
  const airportPopoverRef = useRef(null);

  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDestinationPopover, setShowDestinationPopover] = useState(false);
  const destinationPopoverRef = useRef(null);

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

  const handleSearch = () => {
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
    <section className="sa_3">
      <img src="assets/flightnew.jpg" alt="" />
      <div className="shade_flight">
        <div className="shade_4">
          <h1>
            Airport <span className="swit">Pickups</span>
          </h1>
          <br />
          <p>Discover the best deals for your next travel in Nigeria.</p>
        </div>
        <div className="sa_search_max">
          <div className="search_item_max new_max" ref={airportPopoverRef}>
            <input
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
          <div className="search_item_max new_max" ref={destinationPopoverRef}>
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
          <div className="button" onClick={handleSearch}>Search</div>
        </div>
      </div>
    </section>
  );
};

export default AirportPickups;