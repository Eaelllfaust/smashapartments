const mongoose = require("mongoose");

const payoutsSchema = new mongoose.Schema({
    vendor: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    booking: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    listing: { 
        type: mongoose.Schema.Types.ObjectId 
    },
    date: { 
        type: Date, 
        required: true 
    },
    remark: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('vendorPayouts', payoutsSchema);
