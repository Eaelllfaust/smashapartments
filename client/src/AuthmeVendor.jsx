import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function AuthmeVendor() {
 const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setEmail(urlParams.get("email"));
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    
    if (queryParams.has('user')) {
      navigate('/user');  
    } else if (queryParams.has('partner')) {
      navigate('/partner'); 
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/verifyaccountpartner", {
        email,
        code: verificationCode,
      });
      toast.success(response.data.message);

      document.cookie = `token=${response.data.token}`;

      window.location.href = "/signin?partner";
    } catch (error) {
      toast.error(error.response?.data?.error || "Verification failed");
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Verify account</h1>
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
          <h2>Authentication</h2>
          <br />
          <p>
            Enter the six digit code you were sent. Also check your spam folder.
          </p>
          <br />
          <label htmlFor="verificationCode">Verification Code</label>
          <br />
          <input
            type="number"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter code"
            required
          />
          <br />
      
          <button type="submit" className="button_5 stick">
            Verify
          </button>  
        </form>
      </section>
    </>
  );
}