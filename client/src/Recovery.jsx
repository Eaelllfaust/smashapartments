import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Recovery() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    try {
      const response = await axios.post("/resetpassword", { email });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(response.data.message);
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Account recovery</h1>
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
      <section className="form_area">
        <form className="div" onSubmit={handleSubmit}>
          <h2>Password reset</h2>
          <br />
          <p>
            Enter your email address to recover your account
          </p>
          <br />
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <br />
          <button type="submit" className="button_5 stick">
            Reset Password
          </button>  
        </form>
      </section>
    </>
  );
}