const mongoose = require("mongoose");

const serviceBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  arrivalTime: {
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

module.exports = mongoose.model("ServiceBooking", serviceBookingSchema);
