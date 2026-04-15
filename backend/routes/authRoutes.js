const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Business = require('../models/business');

const router = express.Router();

// Sign up route
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Creating Business Route 
router.post("/businesses/create", async (req, res) => {
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
      owner: owner, // ObjectId from user
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
