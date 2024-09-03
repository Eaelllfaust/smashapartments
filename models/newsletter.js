const mongoose = require("mongoose");

const letterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  toReceive: {
    type: Boolean,
    default: true
  }
});


module.exports = mongoose.model('Newsletter', letterSchema);