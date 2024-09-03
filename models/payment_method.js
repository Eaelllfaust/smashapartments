const mongoose = require('mongoose');

const PaymentMethod = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  name_on_card: {
    type: String,
    required: true,
    trim: true,
  },
  card_number: {
    type: String,
    required: true,
    trim: true,
  },
  card_exp_month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  card_exp_year: {
    type: Number,
    required: true,
    min: new Date().getFullYear(), // Ensures the year is not in the past
  },
  cvv: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 4, // CVV is typically 3 or 4 digits
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('PaymentMethod', PaymentMethod);
