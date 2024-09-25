const mongoose = require("mongoose");

const partnerComplaintSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
  },
  complaint: {
    type: String,
  },
});

module.exports = mongoose.model("UserComplaint", partnerComplaintSchema);