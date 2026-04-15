const express = require("express");
const Business = require("../models/Business");

const router = express.Router();

// creating a business route 
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

    const newBusiness = new Business({
      business_name: businessName,
      owner: owner,
      address: {
        address1,
        address2,
        city,
        state,
        zipCode
      },
      website_url: webAddress,
      description,
      category,
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

// getting a single business route 
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

// fethcing all businesses route
router.get("/", async (req, res) => {
  try {
    const businesses = await Business.find();
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