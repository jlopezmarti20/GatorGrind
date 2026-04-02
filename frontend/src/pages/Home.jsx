import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "./Home.css";
import placeholderImage from "../assets/placeholderImage.png";
import arrowIcon from "../assets/right-arrow.png";

const mainCategories = [
  "Hair",
  "Tech",
  "Fashion",
  "Art",
  "Food & Drink"
];

const extraCategories = [
  "Services",
  "Wellness",
  "Education",
  "Entertainment"
];

const Home = () => {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    <Navbar />

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
            Explore, discover, and support local student entrepreneurs. Use the search bars to 
            find businesses by category or location, and easily add your own business to be 
            discovered by fellow Gators!
          </p>
        </div>

        {/* CATEGORIES */}
        <div className="categories">
          <h2>Browse by Category</h2>
          <div className="category-list">
            {mainCategories.map((cat, i) => (
              <button key={i} className="category-btn">{cat}</button>
            ))}

            {showMore && extraCategories.map((cat, i) => (
              <button key={`extra-${i}`} className="category-btn">{cat}</button>
            ))}

            <button
              className="category-btn more-btn"
              onClick={() => setShowMore(prev => !prev)}
            >
              {showMore ? "Show Less" : "More"}
            </button>
          </div>

          <div
            className="view-all-businesses"
            onClick={() => navigate("/map-view")}
          >
            View All Businesses
            <img src={arrowIcon} alt="arrow" className="arrow-icon" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} GatorGrind. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>

    </div>
  );
};

export default Home;