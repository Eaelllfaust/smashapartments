import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function AddCooffice() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [state, setState] = React.useState({
    officeSpaceName: "",
    city: "",
    state_name: "",
    officeType: "",
    description: "",
    size: "",
    numDesks: "",
    wifi: false,
    conferenceRooms: false,
    parking: false,
    printers: false,
    pets: false,
    smoking: false,
    noises: false,
    catering: false,
    support: false,
    pricePerDay: "",
    pricePerWeek: "",
    pricePerMonth: "",
    availableFrom: "",
    availableTo: "",
    cancellationPolicy: "",
    refundPolicy: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.account_type !== "partner") {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.filter((file) => file.size <= 5 * 1024 * 1024); // 5MB limit
    if (selectedImages.length + newImages.length > 5) {
      alert("You can only upload up to 5 images.");
    } else {
      setSelectedImages([...selectedImages, ...newImages]);
    }
    e.target.value = ""; // Clear the input so the same file can be selected again if needed
  };

  const handleImageRemove = (indexToRemove) => {
    setSelectedImages(
      selectedImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(state).forEach((key) => {
      // Convert boolean values to strings
      if (typeof state[key] === "boolean") {
        formData.append(key, state[key].toString());
      } else {
        formData.append(key, state[key]);
      }
    });

    selectedImages.forEach((image, index) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post("/coofficelisting", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.error) {
        toast.error(response.data.error);
        if (response.data.details) {
          response.data.details.forEach((detail) => toast.error(detail));
        }
      } else {
        toast.success(response.data.message);
        navigate("/partner/managelistings/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.error || "An error occurred. Please try again."
      );
      if (error.response?.data?.details) {
        error.response.data.details.forEach((detail) => toast.error(detail));
      }
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Our partner</h1>
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
        <section className="form_area_6">
          <div className="list_holder">
            <div className="list_1">
              <h2 className="support_text">Add images</h2>
              <br />
              <div className="box_of_media" onClick={triggerFileInput}>
                <div>
                  <h3>
                    Upload media <i className="bx bx-plus" />
                  </h3>
                  <p>Upload up to 5 images. 5MB Max per image.</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                />
              </div>
              <div className="image_preview">
                {selectedImages.map((image, index) => (
                  <div key={index} className="image_container">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`preview ${index}`}
                    />
                    <button onClick={() => handleImageRemove(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="list_2 v85">
              <form onSubmit={handleSubmit}>
                <h2 className="support_text">Add information</h2>
                <br />
                <div className="form">
                  <h3>Basic information</h3>
                  <br />
                  <label htmlFor="officeSpaceName">
                    Office space name{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="officeSpaceName"
                    name="officeSpaceName"
                    className="input"
                    type="text"
                    placeholder="Office space name"
                    value={state.officeSpaceName}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="city">
                    City{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="city"
                    name="city"
                    className="input"
                    type="text"
                    placeholder="City"
                    value={state.city}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="state_name">
                    State{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="state_name"
                    name="state_name"
                    className="input"
                    type="text"
                    placeholder="State"
                    value={state.state_name}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="officeType">
                    Office type{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <select
                    id="officeType"
                    name="officeType"
                    value={state.officeType}
                    onChange={handleChange}
                    required
                  >
                    <option value="virtual-office">Virtual office</option>
                    <option value="meeting-room">Meeting room</option>
                    <option value="private-office">Private office</option>
                    <option value="shared-workspace">Shared workspace</option>
                  </select>
                  <br />
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    value={state.description}
                    onChange={handleChange}
                  />
                  <div className="line" />
                  <h3>Details and amenities</h3>
                  <br />
                  <label htmlFor="size">
                    Size of office space (square footage)
                  </label>
                  <br />
                  <input
                    id="size"
                    name="size"
                    className="input"
                    type="number"
                    placeholder="Square footage"
                    value={state.size}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="numDesks">Number of desks</label>
                  <br />
                  <input
                    id="numDesks"
                    name="numDesks"
                    className="input"
                    type="number"
                    placeholder="Number of desks"
                    value={state.numDesks}
                    onChange={handleChange}
                  />
                  <br />
                  <h3>Amenities</h3>
                  <br />
                  <div className="flex_item">
                    <label htmlFor="wifi">Wifi</label>
                    <input
                      className="check"
                      type="checkbox"
                      name="wifi"
                      checked={state.wifi}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex_item">
                    <label htmlFor="conferenceRooms">Conference rooms</label>
                    <input
                      className="check"
                      type="checkbox"
                      name="conferenceRooms"
                      checked={state.conferenceRooms}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex_item">
                    <label htmlFor="parking">Parking</label>
                    <input
                      className="check"
                      type="checkbox"
                      name="parking"
                      checked={state.parking}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex_item">
                    <label htmlFor="printers">Printers</label>
                    <input
                      className="check"
                      type="checkbox"
                      name="printers"
                      checked={state.printers}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="line" />
                  <h3>Office rules</h3>
                  <br />
                  <div className="flex_item">
                    <label htmlFor="pets">Pets</label>
                    <input
                      className="check"
                      type="checkbox"
                      name="pets"
                      checked={state.pets}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex_item">
                    <label htmlFor="smoking">Smoking</label>
                    <input
                      className="check"
                      type="checkbox"
                      name="smoking"
                      checked={state.smoking}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex_item">
                    <label htmlFor="noises">No loud noises</label>
                    <input
                      className="check"
                      type="checkbox"
                      name="noises"
                      checked={state.noises}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="line" />
                  <h3>Additional services</h3>
                  <br />
                  <div className="flex_item">
                    <label htmlFor="catering">Catering</label>
                    <input
                      className="check"
                      type="checkbox"
                      name="catering"
                      checked={state.catering}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex_item">
                    <label htmlFor="support">Administrative support</label>
                    <input
                      className="check"
                      type="checkbox"
                      name="support"
                      checked={state.support}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="line" />
                  <label>Prices</label>
                  <br />
                  <label htmlFor="pricePerDay">
                    Price per day{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="pricePerDay"
                    name="pricePerDay"
                    className="input"
                    type="number"
                    placeholder="Price daily"
                    value={state.pricePerDay}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="pricePerWeek">
                    Price per week{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="pricePerWeek"
                    name="pricePerWeek"
                    className="input"
                    type="number"
                    placeholder="Price weekly"
                    value={state.pricePerWeek}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="pricePerMonth">
                    Price per month{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="pricePerMonth"
                    name="pricePerMonth"
                    className="input"
                    type="number"
                    placeholder="Price monthly"
                    value={state.pricePerMonth}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label>Availability</label>
                  <br />
                  <label htmlFor="availableFrom">
                    Available from{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="availableFrom"
                    name="availableFrom"
                    className="input"
                    type="date"
                    placeholder="Available from"
                    value={state.availableFrom}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="availableTo">
                    To <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="availableTo"
                    name="availableTo"
                    className="input"
                    type="date"
                    placeholder="to"
                    value={state.availableTo}
                    onChange={handleChange}
                    required
                  />
                  <div className="line" />
                  <h3>Policies</h3>
                  <br />
                  <label htmlFor="cancellationPolicy">
                    Cancellation policy{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <textarea
                    id="cancellationPolicy"
                    name="cancellationPolicy"
                    placeholder="Enter cancellation policy"
                    value={state.cancellationPolicy}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="refundPolicy">
                    Refund policy{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <textarea
                    id="refundPolicy"
                    name="refundPolicy"
                    placeholder="Enter payment terms"
                    value={state.refundPolicy}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <div className="line" />
                  <h3>Contact information</h3>
                  <br />
                  <label htmlFor="contactName">
                    Name{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="contactName"
                    name="contactName"
                    className="input"
                    type="text"
                    placeholder="Name"
                    value={state.contactName}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="contactPhone">
                    Phone{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    className="input"
                    type="tel"
                    placeholder="Phone"
                    value={state.contactPhone}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="contactEmail">
                    Email{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={state.contactEmail}
                    onChange={handleChange}
                    required
                  />
                  <br />

                  <button type="submit" className="button b2 stick">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
