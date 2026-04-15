const express = require("express");
const Review = require("../models/Review");
const Business = require("../models/Business");
const User = require("../models/User");

const router = express.Router();

// get
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ business: req.params.id })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// add
router.post("/:id/reviews", async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    const businessId = req.params.id;

    const business = await Business.findById(businessId);
    const user = await User.findById(userId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const existingReview = await Review.findOne({
      business: businessId,
      user: userId,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment || "";
      await existingReview.save();
    } else {
      await Review.create({
        business: businessId,
        user: userId,
        rating,
        comment: comment || "",
      });
    }

    const reviews = await Review.find({ business: businessId });
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    business.rating = averageRating;
    await business.save();

    res.status(201).json({ message: "Review saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting review" });
  }
});

// get reviews by user
router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate("business", "business_name category address")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user reviews" });
  }
});

module.exports = router;
