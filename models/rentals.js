const mongoose = require("mongoose");

const CarRentalSchema = new mongoose.Schema(
  {
    carNameModel: {
      type: String,
      required: true,
    },
    carType: {
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
    mileage: {
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
    rentalPrice: {
      type: Number,
      required: true,
    },
    insurance: {
      type: String,
      required: true,
    },
    fuel: {
      type: String,
      required: true,
    },
    extraDriver: {
      type: Boolean,
      default: false,
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CarRental", CarRentalSchema);
