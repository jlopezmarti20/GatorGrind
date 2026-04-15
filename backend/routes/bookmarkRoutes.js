const express = require("express");
const User = require("../models/User");
const Business = require("../models/Business");

const router = express.Router();

// get
router.get("/:userId/bookmarks", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("bookmarks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookmarks" });
  }
});

// add
router.post("/:userId/bookmarks", async (req, res) => {
  try {
    const { businessId } = req.body;

    const user = await User.findById(req.params.userId);
    const business = await Business.findById(businessId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const alreadyBookmarked = user.bookmarks.some(
      (id) => id.toString() === businessId
    );

    if (!alreadyBookmarked) {
      user.bookmarks.push(businessId);
      await user.save();
    }

    res.status(200).json({ message: "Bookmark added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding bookmark" });
  }
});

// delete
router.delete("/:userId/bookmarks/:businessId", async (req, res) => {
  try {
    const { userId, businessId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== businessId
    );

    await user.save();

    res.status(200).json({ message: "Bookmark removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing bookmark" });
  }
});

module.exports = router;