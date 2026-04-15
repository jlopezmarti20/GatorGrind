import React, { useState, useEffect, useMemo } from "react";
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
  const [businesses, setBusinesses] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/businesses");
        if (!response.ok) {
          throw new Error("Failed to fetch businesses");
        }

        const data = await response.json();
        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const featuredBusinesses = useMemo(() => {
    return businesses.slice(0, 3);
  }, [businesses]);

  const next = () => {
    if (featuredBusinesses.length === 0) return;
    setCurrent((prev) => (prev + 1) % featuredBusinesses.length);
  };

  const prev = () => {
    if (featuredBusinesses.length === 0) return;
    setCurrent((prev) => (prev - 1 + featuredBusinesses.length) % featuredBusinesses.length);
  };

  const handleCategoryClick = (category) => {
    navigate("/grid-view", { state: { selectedCategory: category } });
  };

  const handleViewBusiness = (businessId) => {
    navigate(`/business/${businessId}`);
  };

  const currentBusiness = featuredBusinesses[current];

  return (
    <div className="home">
      <Navbar />

      <div className="main">
        <div className="carousel">
          {loading ? (
            <p>Loading businesses...</p>
          ) : featuredBusinesses.length > 0 ? (
            <div className="carousel-wrapper">
              <button className="arrow left" onClick={prev}>‹</button>

              <div className="carousel-slide">
                <img
                  src={placeholderImage}
                  alt={currentBusiness.business_name}
                />

                <div className="carousel-text-top">
                  {currentBusiness.business_name}{" "}
                  {currentBusiness.owner?.fullName
                    ? `• ${currentBusiness.owner.fullName}`
                    : ""}
                </div>

                <button
                  className="carousel-btn-bottom"
                  onClick={() => handleViewBusiness(currentBusiness._id)}
                >
                  View Business
                </button>
              </div>

              <button className="arrow right" onClick={next}>›</button>
            </div>
          ) : (
            <p>No businesses found.</p>
          )}
        </div>

        <div className="about-section">
          <h2>Welcome to GatorGrind!</h2>
          <p>
            GatorGrind connects students with amazing student-run businesses across campus.
            Explore, discover, and support local student entrepreneurs. Use the search bars to
            find businesses by category or location, and easily add your own business to be
            discovered by fellow Gators!
          </p>
        </div>

        <div className="categories">
          <h2>Browse by Category</h2>
          <div className="category-list">
            {mainCategories.map((cat, i) => (
              <button
                key={i}
                className="category-btn"
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}

            {showMore && extraCategories.map((cat, i) => (
              <button
                key={`extra-${i}`}
                className="category-btn"
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}

            <button
              className="category-btn more-btn"
              onClick={() => setShowMore((prev) => !prev)}
            >
              {showMore ? "Show Less" : "More"}
            </button>
          </div>

          <div
            className="view-all-businesses"
            onClick={() => navigate("/grid-view")}
          >
            View All Businesses
            <img src={arrowIcon} alt="arrow" className="arrow-icon" />
          </div>
        </div>
      </div>

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