import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

export default function ManageUsers() {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const [activeUsers, setActiveUsers] = useState(0);
  const [allUsers, setAllUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [payoutDetails, setPayoutDetails] = useState({});

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signinadmin");
    } else if (user.interface !== "admin") {
      navigate("/");
    } else {
      fetchActiveUsers();
      fetchAllUsers();
      fetchUsers();
    }
  }, [user, loading, navigate]);

  const fetchPayoutDetails = async (userId) => {
    try {
      const response = await axios.get(`/payoutdetails/${userId}`);
      setPayoutDetails(prevDetails => ({
        ...prevDetails,
        [userId]: response.data
      }));
    } catch (error) {
      console.error("Error fetching payout details", error);
      toast.error('Failed to fetch payout details. Please try again.');
    }
  };

  const togglePayoutDetails = (userId) => {
    if (payoutDetails[userId]) {
      // If details are already loaded, just toggle visibility
      setPayoutDetails(prevDetails => ({
        ...prevDetails,
        [userId]: {
          ...prevDetails[userId],
          visible: !prevDetails[userId].visible
        }
      }));
    } else {
      // If details are not loaded, fetch them
      fetchPayoutDetails(userId);
    }
  };
  const fetchActiveUsers = async () => {
    try {
      const response = await axios.get(`/activeusers`);
      setActiveUsers(response.data.totalActiveUsers);
    } catch (error) {
      console.error("Error fetching active users", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`/allusers`);
      setAllUsers(response.data.totalActiveUsers);
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    confirmAlert({
      title: 'Confirm Status Change',
      message: `Are you sure you want to set this user's status to ${newStatus}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.post('/updateuserstatus', {
                userId,
                status: newStatus
              });
              toast.success('User status updated successfully');
              fetchUsers(); // Refresh the user list
            } catch (error) {
              console.error("Error updating user status", error);
              toast.error('Failed to update user status. Please try again.');
            }
          }
        },
        {
          label: 'No',
          onClick: () => {
            // Do nothing on "No"
          },
          className: "noButtonStyle",
        }
      ]
    });
  };

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    
    if (trimmedSearchTerm === '') {
      fetchUsers(); // Reset to show all users
      return;
    }
  
    const filteredUsers = users.filter(user => 
      (user.first_name?.toLowerCase().includes(trimmedSearchTerm) ?? false) ||
      (user.last_name?.toLowerCase().includes(trimmedSearchTerm) ?? false) ||
      (user.email?.toLowerCase().includes(trimmedSearchTerm) ?? false)
    );
    setUsers(filteredUsers);
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
              <h2>{activeUsers} Active Users</h2>
              <img src="../assets/check.svg" alt="Check icon" />
            </div>
            <p>There are the number of active users on Smash Apartments</p>
          </div>
          <div className="ibox">
            <div className="i2">
              <h2>{allUsers} Users</h2>
              <img src="../assets/time.svg" alt="Time icon" />
            </div>
            <p>There are the number of users on Smash Apartments</p>
          </div>
        </div>
        <div className="entry_1">
          <h2>Smash Users</h2>
        </div>
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search by user name or email"
            className="search_text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            className="button b2 b3"
            style={{ borderRadius: 10, height: 50 }}
            onClick={handleSearch}
          >
            Search
          </div>
        </div>
        <br />
        <br />
        {users.map((user) => (
          <div className="block_item" key={user._id}>
            <div className="row_item_2">
              <div>
                <div className="title_1">Name</div>
                <div className="light-text">{`${user.first_name} ${user.last_name}`}</div>
              </div>
              <div>
                <div className="title_1">Account Type</div>
                <div className="light-text">{user.account_type}</div>
              </div>
              <div>
                <div className="title_1">ID</div>
                <div className="light-text">{user._id}</div>
              </div>
              <div>
                <div className="title_1">Email</div>
                <div className="light-text">{user.email}</div>
              </div>
              <div>
                <div className="title_1">Status</div>
                <div className="light-text">{user.status}</div>
              </div>
              <div>
                <div className="title_1">Join Date</div>
                <div className="light-text">{new Date(user.date_joined).toLocaleDateString()}</div>
              </div>
            </div>
            <br />
            <div className="row_item_2">
              <div>
                <select 
                  className="select" 
                  value={user.status}
                  onChange={(e) => handleStatusChange(user._id, e.target.value)}
                >
                  <option value="active">active</option>
                  <option value="suspended">suspended</option>
                </select>
              </div>
         
            </div>


          </div>
        ))}
      </section>
    </>
  );
}
