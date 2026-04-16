import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import profileIcon from "../assets/profileIcon.png";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [businessSearch, setBusinessSearch] = useState("");
  const navigate = useNavigate();

  const handleBusinessSearch = (e) => {
    setBusinessSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = () => {
    const searchParams = new URLSearchParams();
    if (businessSearch.trim()) {
      searchParams.append('query', businessSearch.trim());
    }
    
    navigate(`/grid-view?${searchParams.toString()}`);
    
    window.dispatchEvent(new CustomEvent('search', { 
      detail: { 
        business: businessSearch.trim(),
        location: "" 
      } 
    }));
  };

  const handleSearchClick = () => {
    performSearch();
  };

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
          <input 
            placeholder="Search Student Businesses" 
            value={businessSearch}
            onChange={handleBusinessSearch}
            onKeyPress={handleSearchSubmit}
          />
          <button className="btn view-btn" onClick={() => navigate("/grid-view")}>Grid View</button>
          <button className="btn view-btn" onClick={() => navigate("/map-view")}>Map View</button>
          <button className="btn add-btn" onClick={() => navigate("/add-business")}>Add a Business</button>
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
              My Profile
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
