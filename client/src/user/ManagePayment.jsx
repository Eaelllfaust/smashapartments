import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../context/userContext"; // Adjust the path as necessary
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManagePayment() {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name_on_card: "",
    card_number: "",
    card_exp_month: "",
    card_exp_year: "",
    cvv: "",
  });

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const response = await axios.get("/getpaymentmethod"); // Adjust API endpoint as necessary
        if (response.data.payment_method) {
          const {
            name_on_card,
            card_number,
            card_exp_month,
            card_exp_year,
            cvv,
          } = response.data.payment_method;
          setFormData({
            name_on_card,
            card_number,
            card_exp_month,
            card_exp_year,
            cvv,
          });
        }
      } catch (error) {
        console.error("Error fetching payment method:", error);
        toast.error("Failed to load payment method data.");
      }
    };

    if (user) {
      fetchPaymentMethod();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/updatepayment", formData);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(response.data.message);
        // Optionally update user context with new payment method details
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Manage account</h1>
        <img src="../assets/linear_bg.png" className="shade_bg" alt="" />
        <div className="shade_item">
          <img src="../assets/bg (2).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (1).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (4).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (3).png" alt="" />
        </div>
      </div>
      <section className="holder">
        <div className="intro">
          <h2>Hello {user?.first_name || "User"}</h2>
          <p>Manage your booking experience</p>
        </div>
        <section className="form_area">
          <form onSubmit={handleSubmit}>
            <div className="div div_2">
              <div className="node_item">
                <h2>
                  Payment methods <img src="../assets/payment.svg" alt="" />
                </h2>
              </div>
              <label htmlFor="name_on_card">Name on card</label>
              <br />
              <input
                type="text"
                name="name_on_card"
                placeholder="John Doe"
                value={formData.name_on_card}
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="card_number">Card number</label>
              <br />
              <input
                type="text"
                name="card_number"
                placeholder="9405 5948 58495 48540"
                value={formData.card_number}
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="card_exp_month">Card Exp.</label>
              <br />
              <div className="input_split">
                <input
                  type="number"
                  name="card_exp_month"
                  placeholder="MM"
                  value={formData.card_exp_month}
                  onChange={handleChange}
                  required
                  min="1"
                  max="12"
                />
                <input
                  type="number"
                  name="card_exp_year"
                  placeholder="YY"
                  value={formData.card_exp_year}
                  onChange={handleChange}
                  required
                  min={new Date().getFullYear()}
                />
              </div>
              <label htmlFor="cvv">CVV</label>
              <br />
              <input
                type="number"
                name="cvv"
                placeholder="###"
                value={formData.cvv}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={4}
              />
              <button type="submit"  className="button_5">
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
