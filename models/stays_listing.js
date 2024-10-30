const mongoose = require('mongoose');

const staysListingSchema = new mongoose.Schema({
  property_name: {
    type: String,
  },
  city: {
    type: String,
  },
  state_name: {
    type: String,
  },
  property_type: {
    type: String,
  },
  description: {
    type: String,
  },
  number_of_rooms: {
    type: Number,
  },
  number_of_bathrooms: {
    type: Number,
  },
  maximum_occupancy: {
    type: Number,
  },
  wifi: {
    type: Boolean,
    default: false,
  },
  pool: {
    type: Boolean,
    default: false,
  },
  parking: {
    type: Boolean,
    default: false,
  },
  gym: {
    type: Boolean,
    default: false,
  },
  pets: {
    type: Boolean,
    default: false,
  },
  smoking: {
    type: Boolean,
    default: false,
  },
  meals: {
    type: Boolean,
    default: false,
  },
  cleaning: {
    type: Boolean,
    default: false,
  },
  price_per_night: {
    type: Number,
  },
  weekly_discount: {
    type: Number,
    default: 0,
  },
  monthly_discount: {
    type: Number,
    default: 0,
  },
  available_from: {
    type: Date,
  },
  available_to: {
    type: Date,
  },
  cancellation_policy: {
    type: String,
  },
  refund_policy: {
    type: String,
  },
  contact_name: {
    type: String,
  },
  contact_phone: {
    type: String,
  },
  contact_email: {
    type: String,
  },
  security_levy: {
    type: String,
  },
  status: {
    type: String,
    default: 'active',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const StayListing = mongoose.model('StayListing', staysListingSchema);

module.exports = StayListing;
