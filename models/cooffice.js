const mongoose = require('mongoose');

const OfficeSpaceSchema = new mongoose.Schema({
  office_space_name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state_name: {  // Aligned with frontend and backend field
    type: String,
    required: true,
  },
  office_type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  size_of_office: {
    type: Number,
    required: true,
  },
  number_of_desks: {
    type: Number,
    required: true,
  },
  wifi: {
    type: Boolean,
    default: false,
  },
  conference_room: {
    type: Boolean,
    default: false,
  },
  parking: {
    type: Boolean,
    default: false,
  },
  printers: {
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
  no_loud_noises: {  // Aligned with frontend and backend field
    type: Boolean,
    default: false,
  },
  catering: {
    type: Boolean,
    default: false,
  },
  administrative_support: {  // Aligned with frontend and backend field
    type: Boolean,
    default: false,
  },
  price_per_day: {
    type: Number,
    required: true,
  },
  price_weekly: {
    type: Number,
    required: true,
  },
  price_monthly: {
    type: Number,
    required: true,
  },
  available_from: {
    type: Date,
    required: true,
  },
  available_to: {
    type: Date,
    required: true,
  },
  cancellation_policy: {
    type: String,
    required: true,
  },
  refund_policy: {
    type: String,
    required: true,
  },
  contact_name: {
    type: String,
    required: true,
  },
  contact_phone: {
    type: String,
    required: true,
  },
  contact_email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'active',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('OfficeSpace', OfficeSpaceSchema);
