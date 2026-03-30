import React, { useState, useEffect } from "react";
import "./Home.css";
import profileIcon from "../assets/profileIcon.png";
import placeholderImage from "../assets/placeholderImage.png";
import leftArrow from "../assets/left-arrow.png";
import rightArrow from "../assets/right-arrow.png";

const categories = [
  "Food & Drink",
  "Tech",
  "Fashion",
  "Art",
  "Services"
];

const Home = () => {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Using placeholder image for demo
    setImages([placeholderImage, placeholderImage, placeholderImage]);
  }, []);

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">GatorGrind</div>

          <div className="search-group">
            <input placeholder="Search Student Businesses" />
            <input placeholder="Where?" />

            <button className="btn view-btn">Grid View</button>
            <button className="btn view-btn">Map View</button>
            <button className="btn add-btn">+ Add a Business</button>
          </div>
        </div>

        <img src={profileIcon} alt="Profile" className="profile-icon" />
      </nav>

      {/* MAIN CONTENT */}
      <div className="main">

        {/* CAROUSEL */}
        <div className="carousel">
          {images.length > 0 && (
            <div className="carousel-wrapper">
              <button className="arrow left" onClick={prev}>‹</button>

              <div className="carousel-slide">
                <img src={images[current]} alt={`Business ${current + 1}`} />
                <div className="carousel-text-top">
                  Business {current + 1} Name & Owner
                </div>
                <button className="carousel-btn-bottom">
                  View Business
                </button>
              </div>

              <button className="arrow right" onClick={next}>›</button>
            </div>
          )}
        </div>

        {/* ABOUT / INFO SECTION */}
        <div className="about-section">
          <h2>Welcome to GatorGrind!</h2>
          <p>
            GatorGrind connects students with amazing student-run businesses across campus. 
            Explore, discover, and support local student entrepreneurs. Use the search bar to 
            find businesses by category or location, and easily add your own business to be 
            discovered by fellow Gators!
          </p>
        </div>

        {/* CATEGORIES */}
        <div className="categories">
          <h2>Browse by Category</h2>
          <div className="category-list">
            {categories.map((cat, i) => (
              <button key={i} className="category-btn">
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;