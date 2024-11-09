const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Assuming you have a User model that this refers to
  },
  currency: {
    type: String,
  },
  language: {
    type: String,
    required: true,
  },
  notifications: {
    type: String,
  }
});

module.exports = mongoose.model("UserPreference", userPreferenceSchema);
