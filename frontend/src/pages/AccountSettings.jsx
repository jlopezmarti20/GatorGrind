import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import "./AccountSettings.css";

const AccountSettings = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setMessage("");
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:5001/api/auth/update/${userId}`,
        { fullName, email, currentPassword, newPassword }
      );

      // update fullName in localStorage if changed
      localStorage.setItem("fullName", response.data.fullName);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating account");
    }
  };

  return (
    <div className="settings-page">
      <Navbar />
      <div className="settings-container">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>
        <h1>Account Settings</h1>

        <div className="settings-card">
          <div className="settings-field">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="settings-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your UF email"
            />
          </div>

          <hr className="settings-divider" />

          <h2>Change Password</h2>

          <div className="settings-field">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="settings-field">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}

          <button className="save-btn" onClick={handleUpdate}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;