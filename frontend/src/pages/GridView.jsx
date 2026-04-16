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
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Parse URL parameters on component mount and when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    const loc = params.get('location');
    
    if (query) {
      setSearchQuery(query);
    }
    if (loc) {
      setSearchLocation(loc);
    }
  }, [location.search]);

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  // Listen for custom search events from NavBar
  useEffect(() => {
    const handleSearchEvent = (event) => {
      const { business, location } = event.detail;
      setSearchQuery(business || "");
      setSearchLocation(location || "");
    };

    window.addEventListener('search', handleSearchEvent);
    
    return () => {
      window.removeEventListener('search', handleSearchEvent);
    };
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
  
        const res = await axios.get(
          "http://localhost:5001/api/businesses",
          {
            params: selectedCategory ? { category: selectedCategory } : {}
          }
        );
  
        setBusinesses(res.data);
      } catch (err) {
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBusinesses();
  }, [selectedCategory]);

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
    let filtered = businesses
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
            
        // Search query filter (searches business name, description, and category)
        const matchesSearchQuery = !searchQuery || 
          business.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.category?.toLowerCase().includes(searchQuery.toLowerCase());
          
        // Search location filter (checks if business location info includes search location)
        const matchesSearchLocation = !searchLocation ||
          business.location?.address?.toLowerCase().includes(searchLocation.toLowerCase()) ||
          business.location?.city?.toLowerCase().includes(searchLocation.toLowerCase()) ||
          business.location?.state?.toLowerCase().includes(searchLocation.toLowerCase()) ||
          business.location?.zip?.toString().includes(searchLocation);

        return matchesCategory && matchesRating && matchesDistance && 
               matchesSearchQuery && matchesSearchLocation;
      })
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
      
    return filtered;
  }, [businesses, selectedCategory, selectedRating, selectedDistance, userLocation, searchQuery, searchLocation]);

  // Clear search function
  const clearSearch = () => {
    setSearchQuery("");
    setSearchLocation("");
    // Optional: Clear URL parameters without reloading
    navigate('/grid-view', { replace: true });
  };

  return (
    <div className="grid-page">
      <Navbar />

      <div className="grid-main">
        <div className="grid-top-section">
          {/* Display active search filters */}
          {(searchQuery || searchLocation) && (
            <div className="active-search-filters">
              <div className="search-summary">
                {searchQuery && (
                  <span>
                    🔍 Business: "{searchQuery}"
                  </span>
                )}
                {searchLocation && (
                  <span>
                    📍 Location: "{searchLocation}"
                  </span>
                )}
              </div>
              <button className="clear-search-btn" onClick={clearSearch}>
                Clear Search
              </button>
            </div>
          )}
          
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
            <p>No businesses match these filters or search criteria.</p>
          ) : (
            filteredAndSortedBusinesses.map((business, index) => (
              <div className="business-card" key={business._id} style={{ animationDelay: `${index * 0.05}s` }}>
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
