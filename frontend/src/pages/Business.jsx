import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import "./Business.css";

const Business = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchBusiness();
    fetchReviews();
    checkBookmarkStatus();
  }, [id]);

  const fetchBusiness = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/businesses/${id}`);
      setBusiness(response.data);
    } catch (error) {
      setError("Business not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/businesses/${id}/reviews`);
      setReviews(response.data);
      
      // Calculate average rating
      if (response.data.length > 0) {
        const avg = response.data.reduce((sum, review) => sum + review.rating, 0) / response.data.length;
        setRating(avg);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const checkBookmarkStatus = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    
    try {
      const response = await axios.get(`http://localhost:5001/api/users/${userId}/bookmarks`);
      setIsBookmarked(response.data.some(bookmark => bookmark._id === id));
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const handleRatingSubmit = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!userRating) {
      alert("Please select a rating");
      return;
    }

    try {
      await axios.post(`http://localhost:5001/api/businesses/${id}/reviews`, {
        userId,
        rating: userRating,
        comment: reviewText
      });
      
      // Refresh reviews
      fetchReviews();
      setReviewText("");
      setUserRating(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    }
  };

  const handleBookmark = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      if (isBookmarked) {
        await axios.delete(`http://localhost:5001/api/users/${userId}/bookmarks/${id}`);
        setIsBookmarked(false);
      } else {
        await axios.post(`http://localhost:5001/api/users/${userId}/bookmarks`, { businessId: id });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="business-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="business-page">
        <Navbar />
        <div className="error-container">
          <h2>{error || "Business not found"}</h2>
          <button onClick={() => navigate("/home")} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="business-page">
      <Navbar />
      
      <div className="business-container">
        {/* Navigation */}
        <div className="business-nav">
          <Link to="/grid-view" className="back-link">
            ← Back to Businesses
          </Link>
        </div>

        {/* Business Header */}
        <div className="business-header">
          <div className="business-title-section">
            <h1 className="business-name">{business.businessName}</h1>
            <button 
              className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={handleBookmark}
            >
              {isBookmarked ? '★' : '☆'} Bookmark
            </button>
          </div>
          
          <div className="business-address">
            <p>{business.address1}</p>
            {business.address2 && <p>{business.address2}</p>}
            <p>{business.city}, {business.state} {business.zipCode}</p>
          </div>
          
          <div className="business-rating-category">
            <div className="rating-display">
              <span className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={star <= Math.round(rating) ? "star-filled" : "star-empty"}>
                    ★
                  </span>
                ))}
              </span>
              <span className="rating-value">{rating.toFixed(1)}</span>
              <span className="review-count">({reviews.length} reviews)</span>
            </div>
            <div className="category-badge">{business.category}</div>
          </div>
        </div>

        {/* Business Description */}
        <div className="business-description">
          <h2>Description</h2>
          <p>{business.description || "No description provided yet."}</p>
        </div>

        {/* Website Link */}
        {business.webAddress && (
          <div className="business-website">
            <a href={business.webAddress} target="_blank" rel="noopener noreferrer" className="website-link">
              Visit Business Website →
            </a>
          </div>
        )}

        {/* Rating Section */}
        <div className="rating-section">
          <h2>Rate Business</h2>
          <div className="rating-input">
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`star-btn ${star <= (hoverRating || userRating) ? "active" : ""}`}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="review-input"
              placeholder="Write a review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="3"
            />
            <button className="submit-review-btn" onClick={handleRatingSubmit}>
              Submit Review
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <span className="reviewer-name">{review.user?.fullName || "Anonymous"}</span>
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={star <= review.rating ? "star-filled" : "star-empty"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.comment || "No comment provided."}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Business;