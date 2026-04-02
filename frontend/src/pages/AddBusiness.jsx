import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import "./AddBusiness.css";

const AddBusiness = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    webAddress: "",
    description: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Hair",
    "Tech",
    "Fashion",
    "Art",
    "Food & Drink",
    "Services",
    "Wellness",
    "Education",
    "Entertainment"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!formData.businessName || !formData.address1 || !formData.city || 
        !formData.state || !formData.zipCode || !formData.category) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      // Get user ID from localStorage/session (assuming you store it after login)
      const userId = localStorage.getItem("userId");
      
      const response = await axios.post(
        "http://localhost:5001/api/businesses/create",
        {
          ...formData,
          owner: userId,
        }
      );

      setSuccess("Business created successfully!");
      setTimeout(() => {
        navigate(`/business/${response.data.business._id}`);
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Error creating business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-business-page">
      <Navbar />
      
      <div className="add-business-container">
        <div className="add-business-header">
          <h1>Add Your Business</h1>
          <p>Share your student-run business with the Gator community</p>
        </div>

        <form className="add-business-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Business Details</h2>
            
            <div className="form-group">
              <label htmlFor="businessName">Business Name *</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address1">Address Line 1 *</label>
              <input
                type="text"
                id="address1"
                name="address1"
                placeholder="Street address"
                value={formData.address1}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address2">Address Line 2</label>
              <input
                type="text"
                id="address2"
                name="address2"
                placeholder="Apt, suite, unit (optional)"
                value={formData.address2}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select State</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">Zip Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder="Zip code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="webAddress">Website Address</label>
              <input
                type="url"
                id="webAddress"
                name="webAddress"
                placeholder="https://yourbusiness.com"
                value={formData.webAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h2>About Your Business</h2>
            
            <div className="form-group">
              <label htmlFor="category">Category of Service *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Tell the Gator community about your business, what services you offer, and what makes you unique..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/profile")}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Add Business"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBusiness;