const mongoose = require("mongoose");

const likedItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StayListing",
      required: true,
    },
  },
  { timestamps: true }
);

const LikedItem = mongoose.model("LikedItem", likedItemSchema);

module.exports = LikedItem;
