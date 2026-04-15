import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/NavBar";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "./MapView.css";
import placeholderImage from "../assets/placeholderImage.png";

// Fix default Leaflet marker icons in Vite/React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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

function FlyToBusiness({ selectedBusiness }) {
  const map = useMap();

  useEffect(() => {
    if (
      selectedBusiness &&
      selectedBusiness.location &&
      selectedBusiness.location.coordinates &&
      selectedBusiness.location.coordinates.length === 2
    ) {
      const [lng, lat] = selectedBusiness.location.coordinates.map(Number);
      map.flyTo([lat, lng], 15, { duration: 1.2 });
    }
  }, [selectedBusiness, map]);

  return null;
}

function MapView() {
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
  const [selectedBusiness, setSelectedBusiness] = useState(null);

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

  const filteredBusinesses = useMemo(() => {
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

  useEffect(() => {
    if (filteredBusinesses.length > 0) {
      const stillExists = filteredBusinesses.find(
        (business) => business._id === selectedBusiness?._id
      );

      if (!stillExists) {
        setSelectedBusiness(filteredBusinesses[0]);
      }
    } else {
      setSelectedBusiness(null);
    }
  }, [filteredBusinesses, selectedBusiness]);

  const mapCenter = useMemo(() => {
    if (
      selectedBusiness &&
      selectedBusiness.location &&
      selectedBusiness.location.coordinates &&
      selectedBusiness.location.coordinates.length === 2
    ) {
      const [lng, lat] = selectedBusiness.location.coordinates.map(Number);
      return [lat, lng];
    }

    return [userLocation.lat, userLocation.lng];
  }, [selectedBusiness, userLocation]);

  return (
    <div className="map-page">
      <Navbar />

      <main className="map-main">
        <section className="map-filters-row">
          <span className="map-filter-label">Filter By:</span>

          <select
            className="map-filter-select"
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
            className="map-filter-select"
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(e.target.value)}
          >
            <option value="">Distance</option>
            <option value="1">Within 1 mile</option>
            <option value="3">Within 3 miles</option>
            <option value="5">Within 5 miles</option>
            <option value="10">Within 10 miles</option>
          </select>

          <select
            className="map-filter-select"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="">Rating</option>
            <option value="5">5 stars</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
          </select>
        </section>

        <section className="map-content">
          <div className="map-list-panel">
            {loading ? (
              <p>Loading businesses...</p>
            ) : filteredBusinesses.length === 0 ? (
              <p>No businesses match these filters.</p>
            ) : (
              filteredBusinesses.map((business) => (
                <div
                  className={`map-business-card ${
                    selectedBusiness?._id === business._id ? "selected" : ""
                  }`}
                  key={business._id}
                  onClick={() => setSelectedBusiness(business)}
                >
                  <img
                    src={placeholderImage}
                    alt={business.business_name}
                    className="map-business-image"
                  />

                  <div className="map-business-info">
                    <h3>{business.business_name}</h3>
                    <p className="map-owner">{business.category}</p>
                    <p className="map-address">
                      {business.address?.address1}, {business.address?.city}
                    </p>

                    <div className="map-tags-row">
                      <span className="map-tag">{business.category}</span>
                      <span className="map-tag">
                        {Number(business.rating || 0).toFixed(1)} ★
                      </span>
                      <span className="map-tag">
                        {business.distance !== null && !isNaN(business.distance)
                          ? `${business.distance.toFixed(1)} mi`
                          : "N/A"}
                      </span>
                    </div>

                    <Link
                      to={`/business/${business._id}`}
                      className="map-view-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Business
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="map-panel">
            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={true}
              className="real-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FlyToBusiness selectedBusiness={selectedBusiness} />

              {filteredBusinesses.map((business) => {
                if (
                  !business.location ||
                  !business.location.coordinates ||
                  business.location.coordinates.length !== 2
                ) {
                  return null;
                }

                const [lng, lat] = business.location.coordinates.map(Number);

                return (
                  <Marker key={business._id} position={[lat, lng]}>
                    <Popup>
                      <strong>{business.business_name}</strong>
                      <br />
                      {business.category}
                      <br />
                      {business.address?.address1}, {business.address?.city}
                      <br />
                      {business.distance !== null && !isNaN(business.distance)
                        ? `${business.distance.toFixed(1)} miles away`
                        : "Distance unavailable"}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MapView;