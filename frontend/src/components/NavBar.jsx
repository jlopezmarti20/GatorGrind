import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import profileIcon from "../assets/profileIcon.png";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div
          className="logo"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          GatorGrind
        </div>

        <div className="search-group">
          <input placeholder="Search Student Businesses" />
          <input placeholder="Where?" />
          <button className="btn view-btn">Grid View</button>
          <button className="btn view-btn">Map View</button>
          <button className="btn add-btn">+ Add a Business</button>
        </div>
      </div>

      <div
        className="profile-wrapper"
        onClick={() => setShowProfileMenu(prev => !prev)}
      >
        <img src={profileIcon} alt="Profile" className="profile-icon" />

        {showProfileMenu && (
          <div className="profile-menu">
            <button
              className="profile-menu-item"
              onClick={() => navigate("/profile")}
            >
              My Account
            </button>
            <button
              className="profile-menu-item"
              onClick={() => navigate("/login")}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;