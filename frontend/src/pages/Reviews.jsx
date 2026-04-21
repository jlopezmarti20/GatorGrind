import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import "./Reviews.css";

const Reviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5001/api/reviews/user/${userId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
    setHoverRating(0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
    setHoverRating(0);
  };

  const saveEdit = async (review) => {
    if (!editRating || editRating < 1 || editRating > 5) {
      showToast("Please select a rating between 1 and 5.", "error");
      return;
    }
    const userId = localStorage.getItem("userId");
    try {
      await axios.put(`http://localhost:5001/api/reviews/${review._id}`, {
        userId,
        rating: editRating,
        comment: editComment,
      });
      cancelEdit();
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  const deleteReview = async (id) => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.delete(`http://localhost:5001/api/reviews/${id}`, {
        data: { userId },
      });
      setDeletingId(null);
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="reviews-page">
      <Navbar />

      <div className="reviews-container">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>
        <h1>My Reviews</h1>

        {loading ? (
          <p>Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="no-reviews-msg">You haven't reviewed any businesses yet.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                {editingId === review._id ? (
                  <div className="review-edit-form">
                    <h3>{review.business?.business_name}</h3>

                    <div className="edit-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= (hoverRating || editRating)
                              ? "star-filled"
                              : "star-empty"
                          }
                          onClick={() => setEditRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{ cursor: "pointer" }}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <textarea
                      className="edit-review-textarea"
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      placeholder="Update your comment..."
                      rows={3}
                    />

                    <div className="review-edit-actions">
                      <button
                        className="save-review-btn"
                        onClick={() => saveEdit(review)}
                      >
                        Save
                      </button>
                      <button className="cancel-review-btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="review-card-clickable"
                      onClick={() => navigate(`/business/${review.business?._id}`)}
                    >
                      <div className="review-card-header">
                        <h3>{review.business?.business_name}</h3>
                        <div className="review-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={star <= review.rating ? "star-filled" : "star-empty"}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="review-category">{review.business?.category}</p>
                      <p className="review-comment">{review.comment || "No comment provided."}</p>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="review-actions">
                      <button
                        className="review-edit-btn"
                        onClick={() => startEdit(review)}
                      >
                        Edit
                      </button>
                      <button
                        className="review-delete-btn"
                        onClick={() => confirmDelete(review._id)}
                      >
                        Delete
                      </button>
                    </div>

                    {/* Inline delete confirmation */}
                    {deletingId === review._id && (
                      <div className="delete-confirm">
                        <p>Are you sure you want to delete this review?</p>
                        <div className="delete-confirm-actions">
                          <button
                            className="confirm-delete-btn"
                            onClick={() => deleteReview(review._id)}
                          >
                            Yes, Delete
                          </button>
                          <button
                            className="cancel-delete-btn"
                            onClick={cancelDelete}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
