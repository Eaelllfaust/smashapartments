const mongoose = require("mongoose");

const actionsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    dataId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["listing_approval", "booking", "payment", "accounts", "general", "refund_appeal", "vendor_payment"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["resolved", "pending"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Adminactions', actionsSchema);