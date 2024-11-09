const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  carMakeModel: {
    type: String,
    required: true,
  },
  carColor: {
    type: String,
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
  },
  driverName: {
    type: String,
    required: true,
  },
  driverLicenseNumber: {
    type: String,
    required: true,
  },
  driverPhoneNumber: {
    type: String,
    required: true,
  },
  driverEmail: {
    type: String,
    required: true,
  },
  pickupPrice: {
    type: Number,
    required: true,
  },
  extraLuggage: {
    type: String,
    required: true,
  },
  waitingTime: {
    type: String,
    required: true,
  },
  availableFrom: {
    type: Date,
    required: true,
  },
  availableTo: {
    type: Date,
    required: true,
  },
  cancellationPolicy: {
    type: String,
    required: true,
  },
  refundPolicy: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "active",
  },
  approved: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
