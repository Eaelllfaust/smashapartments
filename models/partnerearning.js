const mongoose = require("mongoose");

const partnerEarningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceBooking",
    required: true,
  },
  listingType: {
    type: String,
    required: true,
  },
  payDate: {
    type: Date,
    required: true,
  },
  payedVia: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PartnerEarning", partnerEarningSchema);