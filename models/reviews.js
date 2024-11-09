const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    review: { type: String },
    rating: {
      type: String,
      default: "0",
    },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Reviews', reviewsSchema);