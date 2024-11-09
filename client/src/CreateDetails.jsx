import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

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

export default function CreateDetails() {
  const { state } = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [DOB, setDOB] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Data checks
    if (!firstName || !lastName || !phoneNumber || !DOB || !selectedFile) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    // Password validation check
    const passwordIsValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!passwordIsValid) {
      toast.error("Password does not meet the requirements.");
      return;
    }

    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
      } else {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("phoneNumber", phoneNumber);
        formData.append("DOB", DOB);
        formData.append("password", password);
        formData.append("gId", selectedFile);

        const response = await axios.post("/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.error) {
          toast.error(response.data.error);
        } else {
            setPassword("");
            setConfirmPassword("");
            toast.success("Check email for verification code");
            navigate(`/authme?email=${response.data.user.email}`);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="shade_2 df">
        <h1>Create account</h1>
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
          <input
            type="text"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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

          {/* {selectedFile && <p>Selected file: {selectedFile.name}</p>} */}
          
          <PasswordHelper password={password} />
          <br />
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
        
          </div>
 
          <label htmlFor="confirm">Confirm password</label>
          <input
            type="password"
            id="confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
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
    </div>
  );
}