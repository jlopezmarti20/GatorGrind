import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "./Profile.css";
import placeholderImage from "../assets/placeholderImage.png";

const Profile = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User"); // will fetch from MongoDB
  const [profilePic, setProfilePic] = useState(null);

  // placeholder
  useEffect(() => {
    const fetchUser = async () => {
      // const res = await fetch('/api/user'); 
      // const data = await res.json();
      const data = { name: "User", profilePic: null }; // mock
      setUserName(data.name);
      setProfilePic(data.profilePic); 
    };
    fetchUser();
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only PNG or JPEG files are allowed.");
    }
  };

  const handleRemove = () => {
    setProfilePic(null);
  };

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        {/* LEFT SIDE */}
        <div className="profile-left">
          <img
            src={profilePic || placeholderImage}
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-buttons">
            <button className="btn edit-btn">Edit Profile</button>
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
          <h1 className="greeting">Hi, {userName}!</h1>
          <div className="profile-options">
            <button className="option-btn" onClick={() => navigate("/add-business")}>
              Add a Business
            </button>
            <button className="option-btn" onClick={() => navigate("/bookmarks")}>
              Bookmarks
            </button>
            <button className="option-btn" onClick={() => navigate("/reviews")}>
              Reviews
            </button>
            <button className="option-btn" onClick={() => navigate("/account-settings")}>
              Account Settings
            </button>
            <button className="option-btn" onClick={() => navigate("/login")}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;