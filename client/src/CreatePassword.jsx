import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function CreatePassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve email from location state
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
      } else {
        const response = await axios.post("/register", {
          email,
          password,
        });

        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          setPassword(""); // Reset the password field
          setConfirmPassword(""); // Reset the confirm password field
          toast.success("Account created successfully!");
          navigate("/user"); // Navigate only after successful account creation
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Create password</h1>
        <img src="assets/linear_bg.png" className="shade_bg" alt="" />
        <div className="shade_item">
          <img src="assets/bg (2).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (1).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (4).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="assets/bg (3).png" alt="" />
        </div>
      </div>
      <section className="form_area">
        <form className="div" onSubmit={handleSubmit}>
          <h2>Create password</h2>
          <br />
          <p>
            Use a minimum of 10 characters, including uppercase letters,
            lowercase letters, and numbers.
          </p>
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <br />
          <label htmlFor="confirm">Confirm password</label>
          <br />
          <input
            type="password"
            id="confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          <br />
          <button type="submit" className="button_5 stick">
            Create account
          </button>
          <br />
          <p className="legal_text">
            By signing in or creating an account, you agree with our&nbsp;Terms
            &amp; Conditions&nbsp;and&nbsp;Privacy Statement
          </p>
        </form>
      </section>
    </>
  );
}
