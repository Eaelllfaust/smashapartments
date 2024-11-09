const mongoose = require("mongoose");

const coofficeBookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  officeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OfficeSpace",
    required: true,
  },
  checkInDate: { 
    type: Date, 
    required: true 
  },
  checkOutDate: { 
    type: Date, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  paymentReference: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "reserved", "cancelled", "cancelledbyparnter", "cancelledbyadmin", "ended", "checkedin"],
    default: "pending",
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("CoofficeBooking", coofficeBookingSchema);