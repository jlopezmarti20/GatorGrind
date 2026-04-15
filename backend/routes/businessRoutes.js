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

module.exports = router;