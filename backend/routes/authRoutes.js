const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

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

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      fullName: user.fullName,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update account settings
router.put("/update/:userId", async (req, res) => {
  try {
    const { fullName, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // update localStorage name if changed
    res
      .status(200)
      .json({
        message: "Account updated successfully",
        fullName: user.fullName,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
