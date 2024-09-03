import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

export default function AddStays() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

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
    const newImages = files.filter((file) => file.size <= 4 * 1024 * 1024); // 4MB limit
    if (selectedImages.length + newImages.length > 4) {
      alert("You can only upload up to 4 images.");
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

  const [state, setState] = React.useState({
    propertyName: '',
    city: '',
    state_name: '',
    propertyType: '',
    propertyDescription: '',
    numRooms: '',
    numBathrooms: '',
    maxOccupancy: '',
    pricePerNight: '',
    availableFrom: '',
    availableTo: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    cancellationPolicy: '',
    refundPolicy: '',
    wifi: false,
    pool: false,
    parking: false,
    gym: false,
    pets: false,
    smoking: false,
    meals: false,
    cleaning: false,
    weeklyDiscount: 0,
    monthlyDiscount: 0
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(state).forEach(key => {
      // Convert boolean values to strings
      if (typeof state[key] === 'boolean') {
        formData.append(key, state[key].toString());
      } else {
        formData.append(key, state[key]);
      }
    });
  
    selectedImages.forEach((image, index) => {
      formData.append('images', image);
    });
  
    try {
      const response = await axios.post('/stayslisting', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data.error) {
        toast.error(response.data.error);
        if (response.data.details) {
          response.data.details.forEach(detail => toast.error(detail));
        }
      } else {
        toast.success(response.data.message);
        navigate('/partner/managelistings/');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
      if (error.response?.data?.details) {
        error.response.data.details.forEach(detail => toast.error(detail));
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
                  <p>Upload up to 4 images. 4MB Max per image.</p>
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
        <label htmlFor="propertyName">
            Property name{" "}
            <span className="required">This field is required</span>
        </label>
        <br />
        <input
            id="propertyName"
            name="propertyName"
            className="input"
            type="text"
            placeholder="Property name"
            value={state.propertyName}
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
        <label htmlFor="state">
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
        <label htmlFor="propertyType">
            Property type{" "}
            <span className="required">This field is required</span>
        </label>
        <br />
        <select
            id="propertyType"
            name="propertyType"
            value={state.propertyType}
            onChange={handleChange}
            required
        >
            <option selected  value="Select">Select property type</option>
            <option value="airbnb">Airbnb</option>
            <option value="hotel">Hotel</option>
            <option value="shortTermRental">Short term rental</option>
            <option value="villa">Villa</option>
            <option value="apartments">Apartments</option>
        </select>
        <br />
        <textarea
            id="propertyDescription"
            name="propertyDescription"
            placeholder="Enter property description"
            value={state.propertyDescription}
            onChange={handleChange}
            required
        ></textarea>
        <div className="line" />
        <div className="form">
           
            <h3>Amenities</h3>
            <br />
            
          {['wifi', 'pool', 'parking', 'gym', 'pets', 'smoking', 'meals', 'cleaning'].map(amenity => (
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
            <div>
              <br />
          <label htmlFor="weeklyDiscount">Weekly Discount (%)</label>
          <input
            type="number"
            id="weeklyDiscount"
              className="input"
            name="weeklyDiscount"
            value={state.weeklyDiscount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="monthlyDiscount">Monthly Discount (%)</label>
          <input
            type="number"
            id="monthlyDiscount"
              className="input"
            name="monthlyDiscount"
            value={state.monthlyDiscount}
            onChange={handleChange}
          />
          </div>
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
                To{" "}
                <span className="required">This field is required</span>
            </label>
            <br />
            <input
                id="availableTo"
                name="availableTo"
                className="input"
                type="date"
                placeholder="To"
                value={state.availableTo}
                onChange={handleChange}
                required
            />
            <br />
            <div className="line" />
            <h3>Policies</h3>
            <br />
            <label htmlFor="cancellationPolicy">Cancellation policy</label>
            <br />
            <textarea
                id="cancellationPolicy"
                name="cancellationPolicy"
                placeholder="Cancellation policy"
                value={state.cancellationPolicy || ''}
                onChange={handleChange}
            />
            <br />
            <label htmlFor="refundPolicy">Refund policy</label>
            <br />
            <textarea
                id="refundPolicy"
                name="refundPolicy"
                placeholder="Refund policy"
                value={state.refundPolicy || ''}
                onChange={handleChange}
            />
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
        </div>
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
