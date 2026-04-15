import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import "./GridView.css";
import arrowIcon from "../assets/right-arrow.png";
import axios from "axios";

const categories = [
  "Hair",
  "Tech",
  "Fashion",
  "Art",
  "Food & Drink",
  "Services",
  "Wellness",
  "Education",
  "Entertainment"
];

const UF_CENTER = {
  lat: 29.6436,
  lng: -82.3549
};

const GridView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState(UF_CENTER);
  const [locationSource, setLocationSource] = useState("uf-center");

  console.log(locationSource);

  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.selectedCategory || ""
  );
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("");

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/businesses");
        setBusinesses(res.data);
      } catch (err) {
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(UF_CENTER);
      setLocationSource("uf-center");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationSource("browser");
      },
      (error) => {
        console.error("Geolocation denied or failed, using UF center:", error);
        setUserLocation(UF_CENTER);
        setLocationSource("uf-center");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000
      }
    );
  }, []);

  const getDistanceInMiles = (lat1, lng1, lat2, lng2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const earthRadiusMiles = 3958.8;

    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMiles * c;
  };

  const filteredAndSortedBusinesses = useMemo(() => {
    return businesses
      .map((business) => {
        let distance = null;

        if (
          business.location &&
          business.location.coordinates &&
          business.location.coordinates.length === 2
        ) {
          const [businessLng, businessLat] =
            business.location.coordinates.map(Number);

          distance = getDistanceInMiles(
            userLocation.lat,
            userLocation.lng,
            businessLat,
            businessLng
          );
        }

        return {
          ...business,
          distance
        };
      })
      .filter((business) => {
        const matchesCategory =
          !selectedCategory || business.category === selectedCategory;

        const matchesRating =
          !selectedRating || Number(business.rating) >= Number(selectedRating);

        const matchesDistance =
          !selectedDistance ||
          (business.distance !== null &&
            !isNaN(business.distance) &&
            business.distance <= Number(selectedDistance));

        return matchesCategory && matchesRating && matchesDistance;
      })
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
  }, [businesses, selectedCategory, selectedRating, selectedDistance, userLocation]);

  return (
    <div className="grid-page">
      <Navbar />

      <div className="grid-main">
        <div className="grid-top-section">
          <div className="grid-filters-row">
            <span className="grid-filter-label">Filter By:</span>

            <select
              className="grid-filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="grid-filter-select"
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
            >
              <option value="">Distance</option>
              <option value="1">Under 1 mile</option>
              <option value="5">Under 5 miles</option>
              <option value="10">Under 10 miles</option>
            </select>

            <select
              className="grid-filter-select"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="">Rating</option>
              <option value="1">1 Star & up</option>
              <option value="2">2 Stars & up</option>
              <option value="3">3 Stars & up</option>
              <option value="4">4 Stars & up</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        </div>

        <div className="business-grid">
          {loading ? (
            <p>Loading businesses...</p>
          ) : filteredAndSortedBusinesses.length === 0 ? (
            <p>No businesses match these filters.</p>
          ) : (
            filteredAndSortedBusinesses.map((business) => (
              <div className="business-card" key={business._id}>
                <div className="business-card-footer">
                  <div className="business-card-text">
                    <h3>{business.business_name}</h3>
                    <p>{business.category}</p>
                    <p>{Number(business.rating || 0).toFixed(1)} ★</p>
                    <p>
                      {business.distance !== null && !isNaN(business.distance)
                        ? `${business.distance.toFixed(1)} miles away`
                        : "Distance unavailable"}
                    </p>
                  </div>

                  <button
                    className="business-view-btn"
                    onClick={() => navigate(`/business/${business._id}`)}
                  >
                    View Business
                    <img
                      src={arrowIcon}
                      alt="arrow"
                      className="business-arrow-icon"
                    />
                  </button>
                </div>
              </div>
            ))
          )}
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

export default GridView;