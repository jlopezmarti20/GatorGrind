import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "./Profile.css";
import placeholderImage from "../assets/placeholderImage.png";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userBio, setUserBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBio, setEditBio] = useState("");
  const [userBusinesses, setUserBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  
  // New business form state
  const [newBusiness, setNewBusiness] = useState({
    business_name: "",
    category: "",
    description: "",
    price_range: "",
    rating: 0,
    location: {
      address: "",
      city: "",
      state: "",
      zip: "",
      coordinates: [0, 0]
    }
  });

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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    // Fetch user data from localStorage or API
    const name = localStorage.getItem("fullName");
    const email = localStorage.getItem("userEmail");
    const bio = localStorage.getItem("userBio");
    const savedProfilePic = localStorage.getItem("profilePic");
    const userId = localStorage.getItem("userId");
    
    if (name) setUserName(name);
    if (email) setUserEmail(email);
    if (bio) setUserBio(bio);
    if (savedProfilePic) setProfilePic(savedProfilePic);
    
    // Fetch user's businesses from backend
    if (userId) {
      fetchUserBusinesses(userId);
    }
  }, []);

  const fetchUserBusinesses = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/api/businesses/user/${userId}`);
      setUserBusinesses(response.data);
    } catch (err) {
      console.error("Error fetching user businesses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        setProfilePic(imageData);
        localStorage.setItem("profilePic", imageData);
      };
      reader.readAsDataURL(file);
    } else {
      setMessage("Only PNG or JPEG files are allowed.");
      setMessageType("error");
    }
  };

  const handleRemove = () => {
    setProfilePic(null);
    localStorage.removeItem("profilePic");
  };

  const handleEditClick = () => {
    setEditName(userName);
    setEditEmail(userEmail);
    setEditBio(userBio);
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    if (editName.trim()) {
      setUserName(editName);
      localStorage.setItem("fullName", editName);
    }
    if (editEmail.trim()) {
      setUserEmail(editEmail);
      localStorage.setItem("userEmail", editEmail);
    }
    if (editBio.trim()) {
      setUserBio(editBio);
      localStorage.setItem("userBio", editBio);
    }
    setIsEditing(false);
    setMessage("Profile updated successfully!");
    setMessageType("success");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName("");
    setEditEmail("");
    setEditBio("");
  };

  const handleAddBusiness = () => {
    setShowAddBusiness(true);
    setEditingBusiness(null);
    setNewBusiness({
      business_name: "",
      category: "",
      description: "",
      price_range: "",
      rating: 0,
      location: {
        address: "",
        city: "",
        state: "",
        zip: "",
        coordinates: [0, 0]
      }
    });
  };

  const handleEditBusiness = (business) => {
    setEditingBusiness(business);
    setNewBusiness({
      business_name: business.business_name,
      category: business.category,
      description: business.description || "",
      price_range: business.price_range || "",
      rating: business.rating || 0,
      location: business.location || {
        address: "",
        city: "",
        state: "",
        zip: "",
        coordinates: [0, 0]
      }
    });
    setShowAddBusiness(true);
  };

  const handleDeleteBusiness = async (businessId) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      try {
        await axios.delete(`http://localhost:5001/api/businesses/${businessId}`);
        setUserBusinesses(userBusinesses.filter(b => b._id !== businessId));
        setMessage("");
        setTimeout(() => {
          setMessage("Business deleted successfully!");
          setMessageType("success");
        }, 10);
  
      } catch (err) {
        console.error("Error deleting business:", err);
        setMessage("");
        setTimeout(() => {
          setMessage("Failed to delete business. Please try again.");
          setMessageType("error");
        }, 10);
      }
    }
  };

  const handleBusinessFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setNewBusiness(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewBusiness(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveBusiness = async () => {
    // Validate required fields
    if (!newBusiness.business_name || !newBusiness.category) {
      setMessage("");
      setTimeout(() => {
        setMessage("Please fill in business name and category.");
        setMessageType("error");
      }, 10);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const businessData = {
        ...newBusiness,
        owner: userId,
        rating: Number(newBusiness.rating) || 0
      };

      if (editingBusiness) {
        // Update existing business
        const response = await axios.put(`http://localhost:5001/api/businesses/${editingBusiness._id}`, businessData);
        setUserBusinesses(userBusinesses.map(b => b._id === editingBusiness._id ? response.data : b));
        setMessage("");
        setTimeout(() => {
          setMessage("Business updated successfully!");
          setMessageType("success");
        }, 10);
      } else {
        // Add new business
        const response = await axios.post("http://localhost:5001/api/businesses", businessData);
        setUserBusinesses([...userBusinesses, response.data]);
        setMessage("");
        setTimeout(() => {
          setMessage("Business added successfully!");
          setMessageType("success");
        }, 10);
      }
      
      setShowAddBusiness(false);
      setEditingBusiness(null);
    } catch (err) {
      console.error("Error saving business:", err);
      setMessage("");
      setTimeout(() => {
        setMessage("Failed to save business. Please try again.");
        setMessageType("error");
      }, 10);
          }
  };

  return (
    <div className="profile-page">
      <Navbar />
      {message && (
        <div className={`toast ${messageType}`}>
          {message}
        </div>
      )}
      <div className="profile-container">
        {/* LEFT SIDE */}
        <div className="profile-left">
          <img
            src={profilePic || placeholderImage}
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-buttons">
            <button className="btn edit-btn" onClick={handleEditClick}>
              Edit Profile
            </button>
            {profilePic ? (
              <button className="btn remove-btn" onClick={handleRemove}>
                Remove Photo
              </button>
            ) : (
              <label className="btn upload-btn">
                Add Photo
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleUpload}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="profile-right">
          {isEditing ? (
            <div className="edit-form">
              <h2 className="edit-title">Edit Profile</h2>
              <div className="edit-field">
                <label>Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="edit-input"
                  placeholder="Enter your name"
                />
              </div>
              <div className="edit-field">
                <label>Email:</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="edit-input"
                  placeholder="Enter your email"
                />
              </div>
              <div className="edit-field">
                <label>Bio:</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="edit-textarea"
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSaveChanges}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : showAddBusiness ? (
            <div className="edit-form">
              <h2 className="edit-title">
                {editingBusiness ? "Edit Business" : "Add New Business"}
              </h2>
              
              <div className="edit-field">
                <label>Business Name *</label>
                <input
                  type="text"
                  name="business_name"
                  value={newBusiness.business_name}
                  onChange={handleBusinessFormChange}
                  className="edit-input"
                  placeholder="Enter business name"
                />
              </div>

              <div className="edit-field">
                <label>Category *</label>
                <select
                  name="category"
                  value={newBusiness.category}
                  onChange={handleBusinessFormChange}
                  className="edit-input"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="edit-field">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newBusiness.description}
                  onChange={handleBusinessFormChange}
                  className="edit-textarea"
                  placeholder="Describe your business..."
                  rows="3"
                />
              </div>

              <div className="edit-field">
                <label>Price Range</label>
                <input
                  type="text"
                  name="price_range"
                  value={newBusiness.price_range}
                  onChange={handleBusinessFormChange}
                  className="edit-input"
                  placeholder="e.g., $, $$, $$$"
                />
              </div>

              <div className="edit-field">
                <label>Rating (0-5)</label>
                <input
                  type="number"
                  name="rating"
                  value={newBusiness.rating}
                  onChange={handleBusinessFormChange}
                  className="edit-input"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0"
                />
              </div>

              <div className="edit-field">
                <label>Address</label>
                <input
                  type="text"
                  name="location.address"
                  value={newBusiness.location.address}
                  onChange={handleBusinessFormChange}
                  className="edit-input"
                  placeholder="Street address"
                />
              </div>

              <div className="edit-row">
                <div className="edit-field">
                  <label>City</label>
                  <input
                    type="text"
                    name="location.city"
                    value={newBusiness.location.city}
                    onChange={handleBusinessFormChange}
                    className="edit-input"
                    placeholder="City"
                  />
                </div>
                <div className="edit-field">
                  <label>State</label>
                  <input
                    type="text"
                    name="location.state"
                    value={newBusiness.location.state}
                    onChange={handleBusinessFormChange}
                    className="edit-input"
                    placeholder="State"
                  />
                </div>
                <div className="edit-field">
                  <label>ZIP</label>
                  <input
                    type="text"
                    name="location.zip"
                    value={newBusiness.location.zip}
                    onChange={handleBusinessFormChange}
                    className="edit-input"
                    placeholder="ZIP"
                  />
                </div>
              </div>

              <div className="edit-actions">
                <button className="save-btn" onClick={handleSaveBusiness}>
                  {editingBusiness ? "Update Business" : "Add Business"}
                </button>
                <button className="cancel-btn" onClick={() => setShowAddBusiness(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="greeting">Hi, {userName}!</h1>
              {userEmail && <p className="user-email">{userEmail}</p>}
              {userBio && <p className="user-bio">{userBio}</p>}
              
              <div className="profile-options">
                <button className="option-btn" onClick={handleAddBusiness}>
                  ➕ Add a Business
                </button>
                <button className="option-btn" onClick={() => navigate("/bookmarks")}>
                  🔖 Bookmarks
                </button>
                <button className="option-btn" onClick={() => navigate("/reviews")}>
                  ⭐ Reviews
                </button>
                <button className="option-btn" onClick={() => navigate("/account-settings")}>
                  ⚙️ Account Settings
                </button>
                <button className="option-btn" onClick={() => navigate("/login")}>
                  🚪 Logout
                </button>
              </div>

              {/* My Businesses Section */}
              {userBusinesses.length > 0 && (
                <div className="my-businesses-section">
                  <h3 className="section-title">My Businesses</h3>
                  <div className="businesses-list">
                    {userBusinesses.map(business => (
                      <div key={business._id} className="business-item">
                        <div className="business-info">
                          <h4>{business.business_name}</h4>
                          <p className="business-category">{business.category}</p>
                          <p className="business-rating">★ {business.rating || 0}</p>
                        </div>
                        <div className="business-actions">
                          <button 
                            className="business-edit-btn"
                            onClick={() => handleEditBusiness(business)}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="business-delete-btn"
                            onClick={() => handleDeleteBusiness(business._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
