import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios"; // Import axios
import { toast } from "react-toastify";
export default function ManageBookings() {
  const { user, loading } = useContext(UserContext); // Get the user and loading state from context
  const navigate = useNavigate();

  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [pastBookings, setPastBookings] = useState(0);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.account_type !== "partner") {
      navigate("/");
    } else {
      const fetchUpcomingBookings = async () => {
        try {
          const response = await axios.get(`/upcomingbookings/${user._id}`);
          setUpcomingBookings(response.data.totalUpcomingBookings);
        } catch (error) {
          console.error("Error fetching upcoming bookings", error);
        }
      };

      const fetchPastBookings = async () => {
        try {
          const response = await axios.get(`/endedbookings/${user._id}`);
          setPastBookings(response.data.totalEndedBookings);
        } catch (error) {
          console.error("Error fetching past bookings", error);
        }
      };

      const fetchBookings = async () => {
        try {
          const response = await axios.get(`/getallbookings/${user._id}`);
          setBookings(response.data);
        } catch (error) {
          console.error("Error fetching bookings", error);
        }
      };

      fetchBookings();
      fetchUpcomingBookings();
      fetchPastBookings();
    }
  }, [user, loading, navigate]);
  const handleStatusChange = (bookingId, bookingtype, newStatus) => {
    confirmAlert({
      title: "Confirm Status Change",
      message: `Are you sure you want to change the booking status to ${newStatus}?`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.put(`/updatebookingstatus`, { bookingId, status: newStatus, type: bookingtype });
              setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                  booking._id === bookingId ? { ...booking, status: newStatus } : booking
                )
              );
              toast.success("Status changed")
            } catch (error) {
              console.error("Error updating booking status", error);
            }
          }
        },
        {
          label: "No",
          onClick: () => {
            setBookings((prevBookings) =>
              prevBookings.map((booking) =>
                booking._id === bookingId ? { ...booking } : booking
              )
            );
          }
        }
      ]
    });
  };
  return (
    <>
      <div className="shade_2">
        <h1>Our partner</h1>
        <img
          src="../assets/linear_bg.png"
          className="shade_bg"
          alt="Background pattern"
        />
        <div className="shade_item">
          <img src="../assets/bg (2).png" alt="Partner image 1" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (1).png" alt="Partner image 2" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (4).png" alt="Partner image 3" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (3).png" alt="Partner image 4" />
        </div>
      </div>
      <section className="holder">
        <div className="intro">
          <h2>Hello {user && <span>{user.first_name}</span>}</h2>
          <p>Manage your booking experience</p>
        </div>
        <div className="intro_box">
          <div className="ibox">
            <div className="i2">
              <h2>{upcomingBookings} Confirmed Bookings</h2>
              <img src="../assets/check.svg" alt="Upcoming bookings" />
            </div>
            <p>
              This is the number of upcoming bookings you have. You should set
              them to reserve after reserving
            </p>
          </div>
          <div className="ibox">
            <div className="i2">
              <h2>{pastBookings} Past Bookings</h2>
              <img src="../assets/time.svg" alt="Past bookings" />
            </div>
            <p>This is the number of ended bookings you have.</p>
          </div>
        </div>
        <div className="">
          {bookings.length > 0 ? (
            bookings.map((booking) => {
              if (booking.type === "stay") {
                return (
                  <div key={booking._id} className="block_item stay">
                    <div className="row_item_2">
                      <div>
                        User: {booking.user.first_name} {booking.user.last_name}
                      </div>
                      <div
                        className={
                          booking.status == "confirmed" ? "green_thing" : ""
                        }
                      >
                        Status: {booking.status}
                      </div>
                      <div> Type: {booking.type}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>Check-in: {booking.checkInDate}</div>
                      <div>Check-in: {booking.checkOutDate}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>People: {booking.numPeople}</div>
                      <div>Rooms: {booking.numRooms}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div className="amount_thing">
                        Amount paid: NGN {booking.totalPrice.toLocaleString()}
                      </div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>Contact: {booking.user.email}</div>
                      <div>Contact: {booking.user.phone_number}</div>
                    </div>
                    <div className="row_item_2">
                      <select
                        className="select"
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(
                            booking._id,
                            booking.type,
                            e.target.value
                          )
                        }
                      >
                        <option value="confirmed">confirmed</option>
                        <option value="reserved">reserved</option>
                        <option value="ended">ended</option>
                      </select>
                      <div className="left_20">Switch booking status</div>
                    </div>
                    <div className="line"></div>
                  </div>
                );
              } else if (booking.type === "rental") {
                return (
                  <div key={booking._id} className="block_item rental">
                    <div className="row_item_2">
                      <div>
                        User: {booking.user.first_name} {booking.user.last_name}
                      </div>
                      <div
                        className={
                          booking.status == "confirmed" ? "green_thing" : ""
                        }
                      >
                        Status: {booking.status}
                      </div>
                      <div> Type: {booking.type}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>Pickup date: {booking.pickupDate}</div>
                      <div>Pickup time: {booking.pickupTime}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>With driver: {booking.withDriver}</div>
                      <div>Pickup location: {booking.pickupLocation}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>Dropoff location: {booking.dropoffLocation}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div className="amount_thing">
                        Amount paid: NGN {booking.totalPrice.toLocaleString()}
                      </div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>Contact: {booking.user.email}</div>
                      <div>Contact: {booking.user.phone_number}</div>
                    </div>
                    <div className="row_item_2">
                      <select
                        className="select"
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(
                            booking._id,
                            booking.type,
                            e.target.value
                          )
                        }
                      >
                        <option value="confirmed">confirmed</option>
                        <option value="reserved">reserved</option>
                        <option value="ended">ended</option>
                      </select>
                      <div className="left_20">Switch booking status</div>
                    </div>
                    <div className="line"></div>
                  </div>
                );
              } else if (booking.type === "office") {
                return (
                  <div key={booking._id} className="block_item office">
                    <div className="row_item_2">
                      <div>
                        User: {booking.user.first_name} {booking.user.last_name}
                      </div>
                      <div
                        className={
                          booking.status == "confirmed" ? "green_thing" : ""
                        }
                      >
                        Status: {booking.status}
                      </div>
                      <div> Type: {booking.type}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>Check-in: {booking.checkInDate}</div>
                      <div>Check-in: {booking.checkOutDate}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div className="amount_thing">
                        Amount paid: NGN {booking.totalPrice.toLocaleString()}
                      </div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>Contact: {booking.user.email}</div>
                      <div>Contact: {booking.user.phone_number}</div>
                    </div>
                    <div className="row_item_2">
                      <select
                        className="select"
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(
                            booking._id,
                            booking.type,
                            e.target.value
                          )
                        }
                      >
                        <option value="confirmed">confirmed</option>
                        <option value="reserved">reserved</option>
                        <option value="ended">ended</option>
                      </select>
                      <div className="left_20">Switch booking status</div>
                    </div>
                    <div className="line"></div>
                  </div>
                );
              } else if (booking.type === "service") {
                return (
                  <div key={booking._id} className="block_item service">
                    <div className="row_item_2">
                      <div>
                        User: {booking.user.first_name} {booking.user.last_name}
                      </div>
                      <div
                        className={
                          booking.status == "confirmed" ? "green_thing" : ""
                        }
                      >
                        Status: {booking.status}
                      </div>
                      <div> Type: {booking.type}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>Arrival date: {booking.arrivalDate}</div>
                      <div>Arrival time: {booking.arrivaltTime}</div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div className="amount_thing">
                        Amount paid: NGN {booking.totalPrice.toLocaleString()}
                      </div>
                    </div>
                    <br />
                    <div className="row_item_2">
                      <div>Contact: {booking.user.email}</div>
                      <div>Contact: {booking.user.phone_number}</div>
                    </div>
                    <div className="row_item_2">
                      <select
                        className="select"
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(
                            booking._id,
                            booking.type,
                            e.target.value
                          )
                        }
                      >
                        <option value="confirmed">confirmed</option>
                        <option value="reserved">reserved</option>
                        <option value="ended">ended</option>
                      </select>
                      <div className="left_20">Switch booking status</div>
                    </div>
                    <div className="line"></div>
                  </div>
                );
              } else {
                return null;
              }
            })
          ) : (
            <p>No bookings found.</p>
          )}
        </div>
      </section>
    </>
  );
}
