import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import { toast } from "react-toastify";
import ListingDetailsModal from "./ListingDetailsModal";

export default function ManageBookings() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingData, setListingData] = useState([]);
  const [listingType, setListingType] = useState("");
  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [pastBookings, setPastBookings] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signinadmin");
    } else if (user.interface !== "admin") {
      navigate("/");
    } else {
      fetchData();
    }
  }, [user, loading, navigate]);

  const fetchData = async () => {
    try {
      const [upcomingResponse, pastResponse, allBookingsResponse] =
        await Promise.all([
          axios.get(`/upcomingbookingsgeneral`),
          axios.get(`/endedbookingsgeneral`),
          axios.get(`/getallbookingsgeneral`),
        ]);

      setUpcomingBookings(upcomingResponse.data.totalUpcomingBookings);
      setPastBookings(pastResponse.data.totalEndedBookings);
      setBookings(allBookingsResponse.data);
      setFilteredBookings(allBookingsResponse.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    const filtered = bookings.filter(
      (booking) =>
        booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${booking.user.first_name} ${booking.user.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleStatusChange = (bookingId, bookingtype, newStatus) => {
    confirmAlert({
      title: "Confirm Status Change",
      message: `Are you sure you want to change the booking status to ${newStatus}?`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.put(`/updatebookingstatus`, {
                bookingId,
                status: newStatus,
                type: bookingtype,
              });
              setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                  booking._id === bookingId
                    ? { ...booking, status: newStatus }
                    : booking
                )
              );
              toast.success("Status changed");
            } catch (error) {
              console.error("Error updating booking status", error);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
          className: "noButtonStyle",
        },
      ],
    });
  };
  // Function to copy payment reference to clipboard
  const copyToClipboard = (paymentReference) => {
    navigator.clipboard
      .writeText(paymentReference)
      .then(() => {
        toast.success("Payment reference copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
  return (
    <>
      <div className="shade_2">
        <h1>Administrator</h1>
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
              This is the number of upcoming bookings on the platform. The
              vendors are responsible for changing their status.
            </p>
          </div>
          <div className="ibox">
            <div className="i2">
              <h2>{pastBookings} Past Bookings</h2>
              <img src="../assets/time.svg" alt="Past bookings" />
            </div>
            <p>This is the number of ended bookings on the platform.</p>
          </div>
        </div>
        <div className="entry_1">
          <h2>Search in bookings </h2>
        </div>
        <br />
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="text"
            placeholder="Search by ID, customer name"
            className="search_text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="button b2 b3"
            style={{ borderRadius: 10, height: 50 }}
          >
            Search
          </button>
        </form>
        <br />
        <br />
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            if (booking.type === "stay") {
              return (
                <div key={booking._id} className="block_item stay">
                  <div className="row_item_2">
                    <div>
                      User: {booking.user.first_name} {booking.user.last_name}
                    </div>
                    <div
                      className={
                        booking.status === "confirmed" ? "green_thing" : ""
                      }
                    >
                      Status: {booking.status}
                    </div>
                    <div>Type: {booking.type}</div>
                  </div>
                  <br />
                  <div className="row_item_2">
                    <div>Check-in: {booking.checkInDate}</div>
                    <div>Check-out: {booking.checkOutDate}</div>
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
                    <div className="inline">
                      Payment reference: {booking.paymentReference}{" "}
                      <i
                        className="bx bx-copy take_me"
                        onClick={() =>
                          copyToClipboard(booking.paymentReference)
                        }
                        style={{ cursor: "pointer" }}
                      ></i>
                    </div>
                  </div>
                  <br />
                  <div className="row_item_2">
                    <div>Contact: {booking.user.email}</div>
                    <div>Contact: {booking.user.phone_number}</div>
                  </div>
                  <br />
                  <div className="row_item_2">
                    <div
                      className="btn_22"
                      onClick={() => {
                        setListingData(booking.listing);
                        setIsModalOpen(true);
                        setListingType("stay");
                      }}
                    >
                      View listing information
                    </div>
                  </div>

                  <br />
                  <div className="vendor_payout">
                    <h4>Vendor payout details</h4>
                    <br />
                    <div className="row_item_2">
                      <div>Bank name: {booking.ownerPayout.bankName}</div>
                      <div>Account name: {booking.ownerPayout.accountName}</div>
                      <div>
                        Account number: {booking.ownerPayout.accountNumber}
                      </div>
                    </div>
                  </div>

                  <div className="row_item_2">
                    <div className="left_20">Switch booking status</div>
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
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="reserved">reserved</option>
                      <option value="ended">ended</option>
                    </select>
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
                        booking.status === "confirmed" ? "green_thing" : ""
                      }
                    >
                      Status: {booking.status}
                    </div>
                    <div>Type: {booking.type}</div>
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
                    <div className="inline">
                      Payment reference: {booking.paymentReference}{" "}
                      <i
                        className="bx bx-copy take_me"
                        onClick={() =>
                          copyToClipboard(booking.paymentReference)
                        }
                        style={{ cursor: "pointer" }}
                      ></i>
                    </div>
                  </div>
                  <br />
                  <div className="row_item_2">
                    <div>Contact: {booking.user.email}</div>
                    <div>Contact: {booking.user.phone_number}</div>
                  </div>
                  <br />

                  {booking.listing &&
                    Object.keys(booking.listing).length > 0 && (
                      <div
                        className="btn_22"
                        onClick={() => {
                          setListingData(booking.listing);
                          setIsModalOpen(true);
                          setListingType("rental");
                        }}
                      >
                        View listing information
                      </div>
                    )}

                  <br />
                  <div className="vendor_payout">
                    <h4>Vendor payout details</h4>
                    <br />
                    <div className="row_item_2">
                      <div>Bank name: {booking.ownerPayout.bankName}</div>
                      <div>Account name: {booking.ownerPayout.accountName}</div>
                      <div>
                        Account number: {booking.ownerPayout.accountNumber}
                      </div>
                    </div>
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
                      <option value="pending">pending</option>
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
                        booking.status === "confirmed" ? "green_thing" : ""
                      }
                    >
                      Status: {booking.status}
                    </div>
                    <div>Type: {booking.type}</div>
                  </div>
                  <br />
                  <div className="row_item_2">
                    <div>Check-in: {booking.checkInDate}</div>
                    <div>Check-out: {booking.checkOutDate}</div>
                  </div>
                  <br />
                  <div className="row_item_2">
                    <div className="amount_thing">
                      Amount paid: NGN {booking.totalPrice.toLocaleString()}
                    </div>
                    <div className="inline">
                      Payment reference: {booking.paymentReference}{" "}
                      <i
                        className="bx bx-copy take_me"
                        onClick={() =>
                          copyToClipboard(booking.paymentReference)
                        }
                        style={{ cursor: "pointer" }}
                      ></i>
                    </div>
                  </div>
                  <br />
                  <div className="row_item_2">
                    <div>Contact: {booking.user.email}</div>
                    <div>Contact: {booking.user.phone_number}</div>
                  </div>
                  <br />
                  {booking.listing &&
                    Object.keys(booking.listing).length > 0 && (
                      <div
                        className="btn_22"
                        onClick={() => {
                          setListingData(booking.listing);
                          setIsModalOpen(true);
                          setListingType("office");
                        }}
                      >
                        View listing information
                      </div>
                    )}
                  <br />
                  <div className="vendor_payout">
                    <h4>Vendor payout details</h4>
                    <br />
                    <div className="row_item_2">
                      <div>Bank name: {booking.ownerPayout.bankName}</div>
                      <div>Account name: {booking.ownerPayout.accountName}</div>
                      <div>
                        Account number: {booking.ownerPayout.accountNumber}
                      </div>
                    </div>
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
                      <option value="pending">pending</option>
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
                        booking.status === "confirmed" ? "green_thing" : ""
                      }
                    >
                      Status: {booking.status}
                    </div>
                    <div>Type: {booking.type}</div>
                  </div>
                  <br />
                  <div className="row_item_2">
                    <div>Arrival date: {booking.arrivalDate}</div>
                    <div>Arrival time: {booking.arrivalTime}</div>
                  </div>
                  <br />
                  <div className="row_item_2">
                    <div className="amount_thing">
                      Amount paid: NGN {booking.totalPrice.toLocaleString()}
                    </div>
                    <div className="inline">
                      Payment reference: {booking.paymentReference}{" "}
                      <i
                        className="bx bx-copy take_me"
                        onClick={() =>
                          copyToClipboard(booking.paymentReference)
                        }
                        style={{ cursor: "pointer" }}
                      ></i>
                    </div>
                  </div>
                  <br />
                  <div className="row_item_2">
                    <div>Contact: {booking.user.email}</div>
                    <div>Contact: {booking.user.phone_number}</div>
                  </div>
                  <br />
                  {booking.listing &&
                    Object.keys(booking.listing).length > 0 && (
                      <div
                        className="btn_22"
                        onClick={() => {
                          setListingData(booking.listing);
                          setIsModalOpen(true);
                          setListingType("service");
                        }}
                      >
                        View listing information
                      </div>
                    )}
                  <br />
                  <div className="vendor_payout">
                    <h4>Vendor payout details</h4>
                    <br />
                    <div className="row_item_2">
                      <div>Bank name: {booking.ownerPayout.bankName}</div>
                      <div>Account name: {booking.ownerPayout.accountName}</div>
                      <div>
                        Account number: {booking.ownerPayout.accountNumber}
                      </div>
                    </div>
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
                      <option value="pending">pending</option>
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
        <ListingDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          listing={listingData}
          type={listingType}
        />
      </section>
    </>
  );
}
