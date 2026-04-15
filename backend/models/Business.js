const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  business_name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  address: {
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipCode: String
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: undefined
    }
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  website_url: String,
  rating: {
    type: Number,
    default: 0
  },
  is_verified: {
    type: Boolean,
    default: false
  }
});

businessSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Business", businessSchema);