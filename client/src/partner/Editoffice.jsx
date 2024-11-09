import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function Editoffice() {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const [existingImages, setExistingImages] = useState([]);
    const [images, setImages] = useState({
      existing: [], 
      new: [], 
    });
    const id = new URLSearchParams(location.search).get("id");
    const [selectedImages, setSelectedImages] = useState([]);
    const fileInputRef = useRef(null);
  
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
    securityDeposit: "",
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
    } else if (user.interface !== "partner") {
      navigate("/");
    } else if (id) {
      fetchListingData(id);
    }
  }, [user, loading, navigate, id]);
  const fetchListingData = async (listingId) => {
    try {
      const response = await axios.get(`/getofficelisting/${listingId}`);
      const data = response.data.officeListing;
      setState({
        officeSpaceName: data.office_space_name,
        city: data.city,
        state_name: data.state_name,
        officeType: data.office_type,
        description: data.description,
        size: data.size_of_office,
        numDesks: data.number_of_desks,
        wifi: data.wifi,
        conferenceRooms: data.conference_room,
        parking: data.parking,
        printers: data.printers,
        pets: data.pets,
        smoking: data.smoking,
        noises: data.no_loud_noises,
        catering: data.catering,
        support: data.administrative_support,
        pricePerDay: data.price_per_day,
        securityDeposit: data.security_levy,
        pricePerWeek: data.price_weekly,
        pricePerMonth: data.price_monthly,
        availableFrom: data.available_from.slice(0, 10), // Formatting to YYYY-MM-DD
        availableTo: data.available_to.slice(0, 10), // Formatting to YYYY-MM-DD
        cancellationPolicy: data.cancellation_policy,
        refundPolicy: data.refund_policy,
        contactName: data.contact_name,
        contactPhone: data.contact_phone,
        contactEmail: data.contact_email,
      });

      setImages((prev) => ({
        ...prev,
        existing: data.images.map((img) => ({
          url: img.location,
          name: img.name,
        })),
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

    setImages((prev) => ({
      ...prev,
      new: [...prev.new, ...newImages],
    }));

    e.target.value = "";
  };


  const handleImageRemove = (index, type) => {

    setImages((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));

    if (type === "new" && images.new[index]?.preview) {
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

    Object.keys(state).forEach((key) => {
      const value = state[key];
      formData.append(
        key,
        typeof value === "boolean" ? value.toString() : value
      );
    });

    images.new.forEach((image) => {
      formData.append("images", image.file);
    });
  
    images.existing.forEach((image) => {
      formData.append("existingImages", image.url); 
    });

    try {
      const response = await axios.put(`/coofficelisting/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
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
                  <p>
                    Upload up to 15 images, and minimum of 4 images. 8MB Max per
                    image.
                  </p>
                </div>
          
              </div>
              <div className="image_preview">
                {images.existing.map((image, index) => (
                  <div key={`existing-${index}`} className="image_container">
                    <img
                      src={`https://smashapartments.com/uploads/${image.name}`}
                      alt={`existing preview ${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index, "existing")}
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
                      onClick={() => handleImageRemove(index, "new")}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />
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
                    {" "}
                    <option value="">Select office type</option>
                    <option value="virtual-office">Virtual office</option>
                    <option value="meeting-room">Meeting room</option>
                    <option value="private-office">Private office</option>
                    <option value="shared-workspace">Shared workspace</option>
                  </select>
                  <br />
                  <label htmlFor="description">
                    Description{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    value={state.description}
                    onChange={handleChange}
                    required
                  />
                  <div className="line" />
                  <h3>Details and amenities</h3>
                  <br />
                  <label htmlFor="size">
                    Size of office space (square footage){" "}
                    <span className="required">This field is required</span>
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
                    required
                  />
                  <br />
                  <label htmlFor="numDesks">
                    Number of desks{" "}
                    <span className="required">This field is required</span>
                  </label>
                  <br />
                  <input
                    id="numDesks"
                    name="numDesks"
                    className="input"
                    type="number"
                    placeholder="Number of desks"
                    value={state.numDesks}
                    onChange={handleChange}
                    required
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
                  <br />
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
                  <br />
                  <div className="line"></div>
                  <label>Availability</label>
                  <br />
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
