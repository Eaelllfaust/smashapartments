const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  media_name: {
    type: String,
    required: true,
  },
  media_location: {
    type: String,
    required: true,
  },
});

const Receipts = mongoose.model('Receipts', receiptSchema);

module.exports = Receipts;
