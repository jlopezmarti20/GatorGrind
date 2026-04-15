const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  business_name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  website_url: {
    type: String
  },
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