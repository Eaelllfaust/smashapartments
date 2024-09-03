const mongoose = require('mongoose');

const mediaTagSchema = new mongoose.Schema({
  listing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StaysListing',
    required: true,
  },
  media_name: {
    type: String,
    required: true,
  },
  media_location: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  }
});

const MediaTag = mongoose.model('MediaTag', mediaTagSchema);

module.exports = MediaTag;
