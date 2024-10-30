import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { Line, Pie, Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import RevenueReportGenerator from "./RevenueReportGenerator";

export default function ManageReports() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("booking"); 
  const [revenueData, setRevenueData] = useState({});
  const [bookingStatusData, setBookingStatusData] = useState({});
  const [bookingsOverTime, setBookingsOverTime] = useState({});
  const [revenueByListing, setRevenueByListing] = useState({});
  const [userAnalytics, setUserAnalytics] = useState({});
  const [listingPerformance, setListingPerformance] = useState({});
const [joiningOverTime, setJoiningOverTime] = useState([]);
const [bookingData, setBookingData] = useState({
  months: [],
  counts: [],
  statusCounts: {
    pending: 0,
    confirmed: 0,
    reserved: 0,
    cancelled: 0,
    ended: 0,
  },
});
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signinadmin");
    } else if (user.interface !== "admin") {
      navigate("/");
    } else {
      fetchData(reportType); 
      fetchBookingData();
    }
  }, [user, loading, navigate, reportType]);
  const fetchBookingData = async () => {
    try {
      const bookingDataRes = await axios.get("/bookingdata");
      setBookingData(bookingDataRes.data);
    } catch (error) {
      console.error("Error fetching booking data", error);
    }
  };
  const fetchData = async (type) => {
    try {
      if (type === "booking") {
        const revenueRes = await axios.get("/revenue");
        const bookingStatusRes = await axios.get("/bookingstatus");
        const bookingsTimeRes = await axios.get("/bookingsovertime");
        const revenueListingRes = await axios.get("/revenuebylisting");

        setRevenueData(revenueRes.data);
        setBookingStatusData(bookingStatusRes.data);
        setBookingsOverTime(bookingsTimeRes.data);
        setRevenueByListing(revenueListingRes.data);
      } else if (type === "user") {
        const userAnalyticsRes = await axios.get('/useranalytics');
        const joiningOverTimeRes = await axios.get('/userjoiningovertime');  // Fetch joining over time data
        setUserAnalytics(userAnalyticsRes.data);
        setJoiningOverTime(joiningOverTimeRes.data);  // Store joining data
      } else if (type === "listing") {
        const listingPerformanceRes = await axios.get("/listingperformance");
        setListingPerformance(listingPerformanceRes.data);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const generateRevenueChart = () => {
    return {
      labels: revenueData.dates || [],
      datasets: [
        {
          label: "Revenue Over Time",
          data: revenueData.amounts || [],
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.4)",
          fill: true,
        },
      ],
    };
  };

  const generateBookingStatusChart = () => {
    return {
      labels: ["Pending", "Confirmed", "Reserved", "Cancelled", "Ended"],
      datasets: [
        {
          label: "Booking Status Distribution",
          data: bookingStatusData.counts || [],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#cc99ff",
            "#ff9933",
          ],
        },
      ],
    };
  };

  const generateBookingsOverTimeChart = () => {
    return {
      labels: bookingsOverTime.dates || [],
      datasets: [
        {
          label: "Bookings Over Time",
          data: bookingsOverTime.counts || [],
          borderColor: "#42A5F5",
          backgroundColor: "#90CAF9",
          fill: true,
        },
      ],
    };
  };

  const generateRevenueByListingChart = () => {
    return {
      labels: revenueByListing.labels || [],
      datasets: [
        {
          label: "Revenue by Listing Type",
          data: revenueByListing.revenues || [],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#66ff99"],
        },
      ],
    };
  };

  const generateUserAnalyticsChart = () => {
    return {
      labels: ['Total Users', 'Active Users', 'Inactive Users'],
      datasets: [
        {
          label: 'User Activity',
          data: [userAnalytics.totalUsers, userAnalytics.activeUsers, userAnalytics.inactiveUsers],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };
  };
  

  const generateUsersJoiningOverTimeChart = (joiningData) => {
    return {
      labels: joiningData.map(entry => `${entry._id.month}/${entry._id.year}`),  // Format: "month/year"
      datasets: [
        {
          label: 'Users Joining Over Time',
          data: joiningData.map(entry => entry.count),
          borderColor: "#42A5F5",
          backgroundColor: "#90CAF9",
          fill: true,
        },
      ],
    };
  };
  

  const generateListingPerformanceChart = () => {
    return {
      labels: listingPerformance.labels || [],
      datasets: [
        {
          label: "Listing Performance",
          data: listingPerformance.stats || [],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#66ff99"],
        },
      ],
    };
  };
  

  return (
    <>
      <div className="shade_2">
        <h1>Our vendor</h1>
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
      <section className="holder">
        <div className="intro">
          <h2>Hello {user && <span>{user.first_name}</span>}</h2>
          <p>Manage your booking experience</p>
        </div>
        <div className="intro_box">
          <div className="ibox">
            <div className="i2">
              <h2>Revenue</h2>
              <img src="/assets/check.svg" alt="" />
            </div>
            <p>
              {revenueData.total
                ? `NGN ${revenueData.total.toLocaleString()}`
                : "Loading..."}
            </p>
            <RevenueReportGenerator revenueData={revenueData} bookingData={bookingData} />
          </div>
        </div>

        <div className="node_item" style={{ marginBottom: "10px !important" }}>
          <h2>
            Smash reports <img src="/assets/report.svg" alt="" />
          </h2>
        </div>

        <div className="row_item_3">
          <h2>Analytics</h2>
          <div className="row sy">
            <select className="select" onChange={handleReportTypeChange}>
              <option value="booking">Booking Report</option>
              <option value="user">User Analytics</option>
              {/* <option value="listing">Listing Performance</option> */}
            </select>
          </div>
        </div>

        <div className="chart-area">
          {reportType === "booking" && (
            <>
              <div className="chart-container">
                <h3>Revenue Over Time</h3>
                <Line data={generateRevenueChart()} />
              </div>

              <div className="chart-container">
                <h3>Booking Status Distribution</h3>
                <Doughnut data={generateBookingStatusChart()} />
              </div>

              <div className="chart-container">
                <h3>Bookings Over Time</h3>
                <Line data={generateBookingsOverTimeChart()} />
              </div>

              <div className="chart-container">
                <h3>Revenue by Listing Type</h3>
                <Bar data={generateRevenueByListingChart()} />
              </div>
            </>
          )}

{reportType === "user" && (
  <>
    <div className="chart-container">
      <h3>User Analytics</h3>
      <Bar data={generateUserAnalyticsChart()} />
    </div>
    <div className="chart-container">
      <h3>Users Joining Over Time</h3>
      <Line data={generateUsersJoiningOverTimeChart(joiningOverTime)} />
    </div>
  </>
)}


          {reportType === "listing" && (
            <div className="chart-container">
              <h3>Listing Performance</h3>
              <Pie data={generateListingPerformanceChart()} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
