const mongoose = require('mongoose');

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
  category: String,
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

module.exports = mongoose.model('Business', businessSchema);