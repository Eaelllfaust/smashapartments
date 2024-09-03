import React, { useEffect, useState , useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  // State for user location
  const [userLocation, setUserLocation] = useState(null);

  // State for sa_search_1 form
  const [location1, setLocation1] = useState('');
  const [date1, setDate1] = useState('');
  const [people1, setPeople1] = useState('');
  const [rooms1, setRooms1] = useState('');

  // State for sa_search_3 form
  const [location2, setLocation2] = useState('');
  const [date2, setDate2] = useState('');
  const [people2, setPeople2] = useState('');
  const [rooms2, setRooms2] = useState('');

  // Fetch user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
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

  // Handle search for sa_search_1
  const handleSearch1 = () => {
    const queryParams = new URLSearchParams();
    if (location1) queryParams.append('location', location1);
    if (date1) queryParams.append('date', date1);
    if (people1) queryParams.append('people', people1);
    if (rooms1) queryParams.append('rooms', rooms1);

    // Append user location if available
    if (userLocation) {
      queryParams.append('latitude', userLocation.latitude);
      queryParams.append('longitude', userLocation.longitude);
    }

    navigate(`/stays?${queryParams.toString()}`);
  };

  // Handle search for sa_search_3
  const handleSearch2 = () => {
    const queryParams = new URLSearchParams();
    if (location2) queryParams.append('location', location2);
    if (date2) queryParams.append('date', date2);
    if (people2) queryParams.append('people', people2);
    if (rooms2) queryParams.append('rooms', rooms2);

    // Append user location if available
    if (userLocation) {
      queryParams.append('latitude', userLocation.latitude);
      queryParams.append('longitude', userLocation.longitude);
    }

    navigate(`/stays?${queryParams.toString()}`);
  };

  const handleLocationBasedLink = (path) => {
    const queryParams = new URLSearchParams();
    if (userLocation) {
      queryParams.append('latitude', userLocation.latitude);
      queryParams.append('longitude', userLocation.longitude);
    }
    navigate(`${path}?${queryParams.toString()}`);
  };
  const [isMockHidden, setIsMockHidden] = useState(false);
  const locationInputRef = useRef(null); // Create a ref for the location input

  const handleMockClick = () => {
    setIsMockHidden(true);
  };

  useEffect(() => {
    if (isMockHidden && locationInputRef.current) {
      locationInputRef.current.focus(); 
      // Focus on the location input when the mock is hidden
    }
  }, [isMockHidden]); // Run this effect when `isMockHidden` changes

  return (
    <>
      <div className="shade">
        <h1>Your all-in-one platform for seamless bookings.</h1>
        <img src="assets/linear_bg.png" className="shade_bg" alt="" />
        <div className="shade_item">
          <img src="assets/bg (2).png" alt="" />
          <div className="shade_box">
            <h3>Properties</h3>
            <div className="button_light" onClick={() => handleLocationBasedLink('/stays')}>Find yours</div>
          </div>
        </div>
        <div className="shade_item">
          <img src="assets/bg (1).png" alt="" />
          <div className="shade_box">
            <h3>Co-office Spaces</h3>
            <div className="button_light" onClick={() => handleLocationBasedLink('/cooffice')}>Find yours</div>
          </div>
        </div>
        <div className="shade_item">
          <img src="assets/bg (4).png" alt="" />
          <div className="shade_box">
            <h3>Airport Pickups</h3>
            <div className="button_light" onClick={() => handleLocationBasedLink('/pickups')}>Find yours</div>
          </div>
        </div>
        <div className="shade_item">
          <img src="assets/bg (3).png" alt="" />
          <div className="shade_box">
            <h3>Car Rentals</h3>
            <div className="button_light" onClick={() => handleLocationBasedLink('/rentals')}>Find yours</div>
          </div>
        </div>
      </div>
      <br />
      <section className="sa_1 m00">
        <p>
          Discover exceptional properties, reliable car rentals, flexible office
          spaces, and convenient airport pickups tailored to your needs—all in one
          place.
        </p>
        <div className={`sa_search_1 mock ${isMockHidden ? 'hide' : ''}`} onClick={handleMockClick}>
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
      
      <div className={`sa_search_1 p00 ${isMockHidden ? '' : 'hide'}`}>
        <div className="search_item">
          <input 
            type="text" 
            placeholder="Location" 
            ref={locationInputRef} // Attach the ref to the location input
            value={location1} 
            onChange={(e) => setLocation1(e.target.value)} 
          />
        </div>
        <div className="search_item">
          <input 
            type="date" 
            placeholder="Date" 
            value={date1} 
            onChange={(e) => setDate1(e.target.value)} 
          />
        </div>
        <div className="search_item">
          <input 
            type="number" 
            placeholder="People" 
            value={people1} 
            onChange={(e) => setPeople1(e.target.value)} 
          />
        </div>
        <div className="search_item">
          <input 
            type="number" 
            placeholder="Rooms" 
            value={rooms1} 
            onChange={(e) => setRooms1(e.target.value)} 
          />
        </div>
        <div className="button b2 b3" onClick={handleSearch1}>
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
              <div className="button b2 b3" onClick={() => handleLocationBasedLink('/stays')}>Find yours</div>
            </div>
            <div className="pt">
              <img src="assets/properties (1).png" alt="" />
              <h3>Apartments</h3>
              <p>Find apartments available in your location</p>
              <div className="button b2 b3" onClick={() => handleLocationBasedLink('/stays')}>Find yours</div>
            </div>
            <div className="pt">
              <img src="assets/properties (3).png" alt="" />
              <h3>Villas</h3>
              <p>Find villas available in your location</p>
              <div className="button b2 b3" onClick={() => handleLocationBasedLink('/stays')}>Find yours</div>
            </div>
          </div>
          <button className="scroll-button right-button">&gt;</button>
        </div>
      </section>
      <br />
      <br />
      <section className="sa_3">
        <img src="assets/flight.png" alt="" />
        <div className="shade_flight">
          <div className="shade_4">
            <h1>Flight & Airport Pickup</h1>
            <br />
            <p>Discover the best deals for your next travel.</p>
          </div>
          <div className="sa_search_2">
            <div className="search_item">
              <input type="text" placeholder="Airport" />
            </div>            <div className="button ">Search</div>
          </div>
        </div>
      </section>
      <section className="sa_3">
        <img src="assets/stays.png" alt="" />
        <div className="shade_flight">
          <div className="shade_4">
            <h1>Stays, properties</h1>
            <br />
            <p>Discover the best deals for your next travel.</p>
          </div>
          <div className="sa_search_3 p00">
            <div className="search_item">
              <input 
                type="text" 
                placeholder="Location" 
                value={location2} 
                onChange={(e) => setLocation2(e.target.value)} 
              />
            </div>
            <div className="search_item">
              <input 
                type="date" 
                placeholder="Date" 
                value={date2} 
                onChange={(e) => setDate2(e.target.value)} 
              />
            </div>
            <div className="search_item">
              <input 
                type="number" 
                placeholder="People" 
                value={people2} 
                onChange={(e) => setPeople2(e.target.value)} 
              />
            </div>
            <div className="search_item">
              <input 
                type="number" 
                placeholder="Rooms" 
                value={rooms2} 
                onChange={(e) => setRooms2(e.target.value)} 
              />
            </div>
            <div className="button " onClick={handleSearch2}>
              Search
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
