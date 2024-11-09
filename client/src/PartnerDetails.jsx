import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const styles = {
  passwordInputWrapper: {
    position: 'relative',
    width: '100%'
  },
  toggleButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
  },
  passwordInput: {
    width: '100%',
    paddingRight: '40px' // Make room for the toggle button
  }
};
// Helper component for phone number validation
const PhoneNumberHelper = ({ phoneNumber }) => {
  const isValid = /^\d{10,}$/.test(phoneNumber);

  return (
    <div className={`password-helper phone-helper ${isValid ? "valid" : "invalid"}`}>
      <ul>
        <li className={/^\d+$/.test(phoneNumber) ? "valid" : "invalid"}>
          Only digits allowed
        </li>
        <li className={phoneNumber.length >= 10 ? "valid" : "invalid"}>
          At least 10 digits long
        </li>
      </ul>
    </div>
  );
};

const PasswordHelper = ({ password }) => {
  const [isValid, setIsValid] = useState(false);

  const validatePassword = () => {
    setIsValid(
      password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  return (
    <div
      className={`password-helper ${isValid ? "valid" : "invalid"}`}
      onBlur={validatePassword}
    >
      <ul>
        <li className={password.length >= 8 ? "valid" : "invalid"}>
          At least 8 characters long
        </li>
        <li className={/[A-Z]/.test(password) ? "valid" : "invalid"}>
          At least one uppercase letter
        </li>
        <li className={/[0-9]/.test(password) ? "valid" : "invalid"}>
          At least one number
        </li>
        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "valid" : "invalid"}>
          At least one special character
        </li>
      </ul>
      {isValid && <p>Suggested password: <code>Passw0rd!</code></p>}
    </div>
  );
};

export default function PartnerDetails() {
  const { state } = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [DOB, setDOB] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Verify if phone number contains only digits and has at least 10 characters
    const phoneNumberIsValid = /^\d{10,}$/.test(phoneNumber);
    if (!phoneNumberIsValid) {
      toast.error("Phone number must contain only digits and be at least 10 digits long.");
      return;
    }

    if (!firstName || !lastName || !phoneNumber || !DOB || !selectedFile) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const passwordIsValid = password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!passwordIsValid) {
      toast.error("Password does not meet the requirements.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      formData.append("DOB", DOB);
      formData.append("password", password);
      formData.append("gId", selectedFile);

      const response = await axios.post("/createpartner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 400 && response.data.error) {
        toast.error(response.data.error);
      } else {
        setPassword("");
        setConfirmPassword("");
        toast.success("Check email for verification code");
        navigate(`/authmevendor?email=${response.data.user.email}`);
      }
    } catch (error) {
      console.error("Frontend error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="shade_2 df">
        <h1>List your property</h1>
        <p>Over 12,000 properties live</p>
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
          <h2>Contact details</h2>
          <br />
          <p>
            Your full name, phone number, and an official document are needed to
            ensure the security of your Smash apartments account.
          </p>
          <br />
          <label htmlFor="firstname">First name</label>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <br />
          <label htmlFor="lastname">Last name</label>
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <br />
          <label htmlFor="dob">Date of birth</label>
          <input
            type="date"
            placeholder="Date of birth"
            value={DOB}
            onChange={(e) => setDOB(e.target.value)}
          />
          
          <label htmlFor="phone">Phone number</label>
          <br />
          <br />
        
          <input
            type="number"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
         
          <br />
          <label htmlFor="address">Address</label>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label htmlFor="ID">Government issued ID</label>
          <div
            onClick={() => document.getElementById("fileInput").click()}
            style={{
              cursor: "pointer",
              padding: "10px",
              backgroundColor: selectedFile ? "green" : "#f89820",
              color: "white",
              borderRadius: "5px",
              textAlign: "center",
              width: "150px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            {selectedFile ? "ID Uploaded" : "Upload ID"}
          </div>

          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          
          <PasswordHelper password={password} />
      <br />
      <label htmlFor="password">Password</label>
      <div style={styles.passwordInputWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={styles.passwordInput}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={styles.toggleButton}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      <label htmlFor="confirm">Confirm password</label>
      <div style={styles.passwordInputWrapper}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="confirm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          style={styles.passwordInput}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.toggleButton}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
          <button className="button_5 stick" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
          <br />
          <p className="sub">
            Already have an account? <a href="signin">Sign in here</a>
          </p>
        </form>
      </section>
    </div>
  );
}