import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../context/userContext"; // Adjust the path as necessary
import { toast } from "react-toastify";

export default function PayoutSettings() {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  useEffect(() => {
    const fetchPayoutSettings = async () => {
      try {
        const response = await axios.get("/getpayoutsettings");
        if (response.data.payoutSettings) {
          const { accountName, accountNumber, bankName } = response.data.payoutSettings;
          setFormData({
            accountName,
            accountNumber,
            bankName,
          });
        }
      } catch (error) {
        console.error("Error fetching payout settings:", error);
        toast.error("Failed to load payout settings.");
      }
    };

    if (user) {
      fetchPayoutSettings();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/updatepayoutsettings", formData);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(response.data.message);
        // Optionally update user context with new payout settings details
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Manage account</h1>
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
        <h2>Hello {user && (<span>{user.first_name}</span>)}</h2>
          <p>Manage your booking experience</p>
        </div>
        <section className="form_area">
          <form onSubmit={handleSubmit}>
            <div className="div">
              <div className="node_item">
                <h2>
                  Payout settings <img src="../assets/payment.svg" alt="" />
                </h2>
              </div>
              <label htmlFor="accountName">Account name</label>
              <br />
              <input
                type="text"
                name="accountName"
                placeholder="Account name"
                value={formData.accountName}
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="accountNumber">Account number</label>
              <br />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="bankName">Bank name</label>
              <br />
              <input
                type="text"
                name="bankName"
                placeholder="Bank name"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
              <br />
              <button type="submit" className="button_5">
                Update
              </button>
              <br />
            </div>
          </form>
        </section>
      </section>
    </>
  );
}
