const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StaysListing",
    required: true,
  },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  numPeople: { type: Number, required: true },
  numRooms: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentReference: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "reserved", "cancelled", "cancelledbyparnter", "cancelledbyadmin", "ended", "checkedin"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
