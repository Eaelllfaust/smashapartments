// Import mongoose
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rentalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CarRental",
    required: true,
  },
  withDriver: {
    type: Boolean,
    default: false,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  pickupTime: {
    type: String,
    required: true,
  },
  dropoffLocation: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentReference: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "reserved", "cancelled", "cancelledbyparnter", "cancelledbyadmin", "ended", "checkedin"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports  = mongoose.model("Rental", rentalSchema);
