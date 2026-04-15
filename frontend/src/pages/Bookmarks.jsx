import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import "./Bookmarks.css";
import placeholderImage from "../assets/placeholderImage.png";

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5001/api/users/${userId}/bookmarks`);
      setBookmarks(response.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (businessId) => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.delete(`http://localhost:5001/api/users/${userId}/bookmarks/${businessId}`);
      setBookmarks(prev => prev.filter(b => b._id !== businessId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  return (
    <div className="bookmarks-page">
      <Navbar />
      <div className="bookmarks-container">
        <button className="back-btn" onClick={() => navigate("/profile")}>← Back to Profile</button>
        <h1>My Bookmarks</h1>

        {loading ? (
          <p>Loading...</p>
        ) : bookmarks.length === 0 ? (
          <p className="no-bookmarks">You have no bookmarks yet.</p>
        ) : (
          <div className="bookmarks-grid">
            {bookmarks.map((business) => (
              <div key={business._id} className="bookmark-card">
                <img
                  src={business.image_url || placeholderImage}
                  alt={business.business_name}
                  className="bookmark-img"
                  onClick={() => navigate(`/business/${business._id}`)}
                />
                <div className="bookmark-info">
                  <h3 onClick={() => navigate(`/business/${business._id}`)}>
                    {business.business_name}
                  </h3>
                  <p>{business.category}</p>
                  <p>{business.address?.city}, {business.address?.state}</p>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveBookmark(business._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;