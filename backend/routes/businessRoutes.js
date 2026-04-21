const express = require("express");
const axios = require("axios");
const Business = require("../models/Business");

const router = express.Router();

async function geocodeAddress({ address1, address2, city, state, zipCode }) {
  const fullAddress = [address1, address2, city, state, zipCode]
    .filter(Boolean)
    .join(", ");

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: fullAddress,
        format: "jsonv2",
        limit: 1
      },
      headers: {
        "User-Agent": "GatorGrind/1.0 (student project)"
      }
    });

    if (!response.data || response.data.length === 0) {
      return null;
    }

    return {
      latitude: Number(response.data[0].lat),
      longitude: Number(response.data[0].lon)
    };
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return null;
  }
}

// create a business
router.post("/create", async (req, res) => {
  try {
    const {
      businessName,
      address1,
      address2,
      city,
      state,
      zipCode,
      webAddress,
      description,
      category,
      owner
    } = req.body;

    const geo = await geocodeAddress({
      address1,
      address2,
      city,
      state,
      zipCode
    });

    const newBusiness = new Business({
      business_name: businessName,
      owner,
      address: {
        address1,
        address2,
        city,
        state,
        zipCode
      },
      location: geo
        ? {
            type: "Point",
            coordinates: [geo.longitude, geo.latitude]
          }
        : undefined,
      category,
      description,
      website_url: webAddress,
      rating: 0,
      is_verified: false
    });

    await newBusiness.save();

    res.status(201).json({
      message: "Business created successfully",
      business: newBusiness
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating business" });
  }
});

// get a business
router.get("/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching business" });
  }
});


// get all businesses with filtering
router.get("/", async (req, res) => {
  try {
    const { category, rating, distance, lat, lng } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    if (distance) {
      const userLat = lat ? Number(lat) : UF_CENTER.lat;
      const userLng = lng ? Number(lng) : UF_CENTER.lng;
      const maxDistanceInMeters = Number(distance) * 1609.34;

      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [userLng, userLat]
          },
          $maxDistance: maxDistanceInMeters
        }
      };
    }

    const businesses = await Business.find(filter);
    res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching businesses" });
  }
});

// filtering businesses
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    const businesses = await Business.find(filter);

    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching businesses" });
  }
});

module.exports = router;