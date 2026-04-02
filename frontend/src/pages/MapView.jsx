import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "./MapView.css";

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

const businesses = [
  {
    id: 1,
    name: "Student Business 1",
    owner: "Maria Silva",
    address: "UF Campus Area",
    tags: ["Hair", "Tag"],
    image:
      "https://via.placeholder.com/160x110/e5e7eb/9ca3af?text=Business+1",
    coords: [29.6516, -82.3248],
  },
  {
    id: 2,
    name: "Student Business 2",
    owner: "Lucas Costa",
    address: "Downtown Gainesville",
    tags: ["Food", "Tag"],
    image:
      "https://via.placeholder.com/160x110/e5e7eb/9ca3af?text=Business+2",
    coords: [29.6487, -82.325],
  },
  {
    id: 3,
    name: "Student Business 3",
    owner: "Ana Souza",
    address: "University Ave",
    tags: ["Art", "Tag"],
    image:
      "https://via.placeholder.com/160x110/e5e7eb/9ca3af?text=Business+3",
    coords: [29.6552, -82.332],
  },
  {
    id: 4,
    name: "Student Business 4",
    owner: "João Lima",
    address: "Midtown",
    tags: ["Tech", "Tag"],
    image:
      "https://via.placeholder.com/160x110/e5e7eb/9ca3af?text=Business+4",
    coords: [29.662, -82.337],
  },
];

function FlyToBusiness({ selectedBusiness }) {
  const map = useMap();

  if (selectedBusiness) {
    map.flyTo(selectedBusiness.coords, 15, {
      duration: 1.2,
    });
  }

  return null;
}

function MapView() {
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0]);

  const mapCenter = useMemo(() => [29.6516, -82.3248], []);

  return (
    <div className="map-page">
      <header className="map-navbar">
        <Link to="/home" className="map-logo">
          GatorGrind
        </Link>

        <input
          type="text"
          placeholder="Search Student Businesses"
          className="map-nav-search"
        />

        <input
          type="text"
          placeholder="Where?"
          className="map-nav-location"
        />

        <div className="map-nav-buttons">
         <button className="map-nav-btn" disabled>
           Grid View
         </button>

         <button className="map-nav-btn active">Map View</button>

         <button className="map-add-btn">+ Add a Business</button>
        </div>

        <button className="map-profile-btn" aria-label="Profile">
          <span className="map-profile-icon">👤</span>
        </button>
      </header>

      <main className="map-main">
              <section className="map-filters-row">
                  <span className="map-filter-label">Filter By:</span>

                  <select className="map-filter-select">
                      <option value="">Category</option>
                      <option value="hair">Hair</option>
                      <option value="tech">Tech</option>
                      <option value="fashion">Fashion</option>
                      <option value="art">Art</option>
                      <option value="food-drink">Food & Drink</option>
                      <option value="services">Services</option>
                      <option value="wellness">Wellness</option>
                      <option value="education">Education</option>
                      <option value="entertainment">Entertainment</option>
                  </select>

                  <select className="map-filter-select">
                      <option value="">Distance</option>
                      <option value="1">Within 1 mile</option>
                      <option value="3">Within 3 miles</option>
                      <option value="5">Within 5 miles</option>
                      <option value="10">Within 10 miles</option>
                  </select>

                  <select className="map-filter-select">
                      <option value="">Rating</option>
                      <option value="5">5 stars</option>
                      <option value="4">4+ stars</option>
                      <option value="3">3+ stars</option>
                      <option value="2">2+ stars</option>
                  </select>
              </section>

        <section className="map-content">
          <div className="map-list-panel">
            {businesses.map((business) => (
              <div
                className={`map-business-card ${
                  selectedBusiness?.id === business.id ? "selected" : ""
                }`}
                key={business.id}
                onClick={() => setSelectedBusiness(business)}
              >
                <img
                  src={business.image}
                  alt={business.name}
                  className="map-business-image"
                />

                <div className="map-business-info">
                  <h3>{business.name}</h3>
                  <p className="map-owner">{business.owner}</p>
                  <p className="map-address">{business.address}</p>

                  <div className="map-tags-row">
                    {business.tags.map((tag, index) => (
                      <span className="map-tag" key={index}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/business/${business.id}`}
                    className="map-view-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Business
                  </Link>
                </div>
              </div>
            ))}
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

              {businesses.map((business) => (
                <Marker key={business.id} position={business.coords}>
                  <Popup>
                    <strong>{business.name}</strong>
                    <br />
                    {business.owner}
                    <br />
                    {business.address}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MapView;