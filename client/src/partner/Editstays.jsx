import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function Editstays() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState({
    existing: [], // for images already on the server
    new: []       // for newly uploaded images
  });
  
  const id = new URLSearchParams(location.search).get("id");

  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const [state, setState] = useState({
    propertyName: "",
    city: "",
    state_name: "",
    propertyType: "",
    propertyDescription: "",
    numRooms: "",
    numBathrooms: "",
    maxOccupancy: "",
    pricePerNight: "",
    availableFrom: "",
    availableTo: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    securityDeposit: "",
    wifi: false,
    pool: false,
    parking: false,
    gym: false,
    pets: false,
    smoking: false,
    meals: false,
    cleaning: false,
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.interface !== "partner") {
      navigate("/");
    } else if (id) {
      fetchListingData(id);
    }
  }, [user, loading, navigate, id]);

  const fetchListingData = async (listingId) => {
    try {
      const response = await axios.get(`/getlisting/${listingId}`);
      const data = response.data.stayListing; // Assuming response format
      setState({
        propertyName: data.property_name,
        city: data.city,
        state_name: data.state_name,
        propertyType: data.property_type,
        propertyDescription: data.description,
        numRooms: data.number_of_rooms,
        numBathrooms: data.number_of_bathrooms,
        maxOccupancy: data.maximum_occupancy,
        pricePerNight: data.price_per_night,
        availableFrom: data.available_from.slice(0, 10),
        availableTo: data.available_to.slice(0, 10),
        contactName: data.contact_name,
        weeklyDiscount: data.weekly_discount,
        monthlyDiscount: data.monthly_discount,
        contactPhone: data.contact_phone,
        contactEmail: data.contact_email,
        securityDeposit: data.security_levy,
        cancellationPolicy: data.cancellation_policy,
        refundPolicy: data.refund_policy,
        wifi: data.wifi || false,
        pool: data.pool || false,
        parking: data.parking || false,
        gym: data.gym || false,
        pets: data.pets || false,
        smoking: data.smoking || false,
        meals: data.meals || false,
        cleaning: data.cleaning || false,
      });

      setImages(prev => ({
        ...prev,
        existing: data.images.map((img) => ({
          url: img.location,
          name: img.name,
        }))
      }));
    } catch (error) {
      toast.error("Failed to load listing data.");
    }
  };

  
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 8 * 1024 * 1024);
    
    if (validFiles.length < files.length) {
      toast.error("Some files exceed the 8MB size limit.");
    }
    
    if (images.existing.length + images.new.length + validFiles.length > 15) {
      toast.error("You can only upload up to 15 images.");
      return;
    }
  
    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    
    setImages(prev => ({
      ...prev,
      new: [...prev.new, ...newImages]
    }));
    
    e.target.value = "";
  };
  
  const handleImageRemove = (index, type) => {
    setImages(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  
    // If removing a new image, revoke its object URL
    if (type === 'new' && images.new[index]?.preview) {
      URL.revokeObjectURL(images.new[index].preview);
    }
  };
  

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState({
      ...state,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(state).forEach((key) => {
      const value = state[key];
      formData.append(key, typeof value === "boolean" ? value.toString() : value);
    });
    
    // Append new images
    images.new.forEach((image) => {
      formData.append("images", image.file);
    });
    
    // Append existing image URLs - Modified to send each URL separately
    images.existing.forEach((image) => {
      formData.append("existingImages", image.url); // Changed from existingImages[] to existingImages
    });
    
    try {
      const response = await axios.put(`/stayslisting/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };
  
  return (
    <>
      <div className="shade_2">
        <h1>Our Vendor</h1>
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
                  <p>Upload up to 15 images, 8MB max per image.</p>
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
    {images.existing.map((image, index) => (
      <div key={`existing-${index}`} className="image_container">
        <img src={`http://localhost:8000/${image.url}`} alt={`existing preview ${index}`} />
        <button 
          type="button" 
          onClick={() => handleImageRemove(index, 'existing')}
          className="remove-btn"
        >
          Remove
        </button>
      </div>
    ))}
    {images.new.map((image, index) => (
      <div key={`new-${index}`} className="image_container">
        <img src={image.preview} alt={`new preview ${index}`} />
        <button 
          type="button" 
          onClick={() => handleImageRemove(index, 'new')}
          className="remove-btn"
        >
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
                  <h3>Basic Information</h3>
                  <br />
                  <label htmlFor="propertyName">
                    Property Name <span className="required">Required</span>
                  </label>
                  <br />

                  <input
                    id="propertyName"
                    name="propertyName"
                    className="input"
                    type="text"
                    placeholder="Property Name"
                    value={state.propertyName}
                    onChange={handleChange}
                    required
                  />
                  <br />

                  {}
                  <label htmlFor="city">
                    City <span className="required">Required</span>
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
                    State <span className="required">Required</span>
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

                  <label htmlFor="propertyType">
                    Property Type <span className="required">Required</span>
                  </label>
                  <br />
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={state.propertyType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select property type</option>
                    <option value="airbnb">Airbnb</option>
                    <option value="hotel">Hotel</option>
                    <option value="shortTermRental">Short-term Rental</option>
                    <option value="villa">Villa</option>
                    <option value="apartments">Apartments</option>
                  </select>
                  <br />

                  <label htmlFor="propertyDescription">
                    Property Description{" "}
                    <span className="required">Required</span>
                  </label>
                  <br />
                  <textarea
                    id="propertyDescription"
                    name="propertyDescription"
                    placeholder="Enter property description"
                    value={state.propertyDescription}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <br />
                  <label htmlFor="numRooms">
                    Number of rooms{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="numRooms"
                    name="numRooms"
                    className="input"
                    type="number"
                    placeholder="Number of rooms"
                    value={state.numRooms}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="numBathrooms">
                    Number of bathrooms{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="numBathrooms"
                    name="numBathrooms"
                    className="input"
                    type="number"
                    placeholder="Number of bathrooms"
                    value={state.numBathrooms}
                    onChange={handleChange}
                    required
                  />
                  <br />

                  <label htmlFor="maxOccupancy">
                    Maximum occupancy{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="maxOccupancy"
                    name="maxOccupancy"
                    className="input"
                    type="number"
                    placeholder="Maximum occupancy"
                    value={state.maxOccupancy}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="pricePerNight">
                    Price per night{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="pricePerNight"
                    name="pricePerNight"
                    className="input"
                    type="number"
                    placeholder="Price per night"
                    value={state.pricePerNight}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="securityDeposit">
                    Security Deposit (optional)
                  </label>
                  <br />
                  <input
                    id="securityDeposit"
                    name="securityDeposit"
                    className="input"
                    type="number"
                    placeholder="Security deposit"
                    value={state.securityDeposit}
                    onChange={handleChange}
                  />
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
                    value={state.availableFrom}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="availableTo">
                    Available to{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="availableTo"
                    name="availableTo"
                    className="input"
                    type="date"
                    value={state.availableTo}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <h3>Amenities</h3>
                  <br />
                  {[
                    "wifi",
                    "pool",
                    "parking",
                    "gym",
                    "pets",
                    "smoking",
                    "meals",
                    "cleaning",
                  ].map((amenity) => (
                    <div className="flex_item" key={amenity}>
                      <input
                        type="checkbox"
                        name={amenity}
                        className="check"
                        checked={state[amenity]}
                        onChange={handleChange}
                      />
                      {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    </div>
                  ))}

                  <br />
                  <label htmlFor="weeklyDiscount">Weekly Discount (%)</label>
                  <br />
                  <input
                    id="weeklyDiscount"
                    name="weeklyDiscount"
                    className="input"
                    type="number"
                    value={state.weeklyDiscount}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="monthlyDiscount">Monthly Discount (%)</label>
                  <br />
                  <input
                    id="monthlyDiscount"
                    name="monthlyDiscount"
                    className="input"
                    type="number"
                    value={state.monthlyDiscount}
                    onChange={handleChange}
                  />
                  <br />
                  <h3>Contact Information</h3>
                  <br />
                  <label htmlFor="contactName">
                    Contact Name{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="contactName"
                    name="contactName"
                    className="input"
                    type="text"
                    placeholder="Contact Name"
                    value={state.contactName}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="contactPhone">
                    Contact Phone{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    className="input"
                    type="tel"
                    placeholder="Contact Phone"
                    value={state.contactPhone}
                    onChange={handleChange}
                    required
                  />
                  <br />

                  <label htmlFor="contactEmail">
                    Contact Email{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />

                  <input
                    id="contactEmail"
                    name="contactEmail"
                    className="input"
                    type="email"
                    placeholder="Contact Email"
                    value={state.contactEmail}
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <br />
                  <h3>Policies</h3>
                  <br />
                  <label htmlFor="cancellationPolicy">
                    Cancellation Policy
                  </label>
                  <br />
                  <textarea
                    id="cancellationPolicy"
                    name="cancellationPolicy"
                    placeholder="Cancellation policy"
                    value={state.cancellationPolicy}
                    onChange={handleChange}
                  />
                  <br />

                  <label htmlFor="refundPolicy">Refund Policy</label>
                  <br />
                  <textarea
                    id="refundPolicy"
                    name="refundPolicy"
                    placeholder="Refund policy"
                    value={state.refundPolicy}
                    onChange={handleChange}
                  />
                  <br />
          
                  <button className="button b2 stick" type="submit">
                    Submit
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
