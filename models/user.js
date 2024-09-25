const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
    },
    password: {
        type: String,
        required: true,
    },
    account_type: {
        type: String,
        enum: ['user', 'partner', 'user_partner', 'admin'], 
        default: 'user',
    },
    first_name: {
        type: String,
        trim: true,
    },
    last_name: {
        type: String,
        trim: true,
    },
    contact_email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    phone_number: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    date_joined: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        default: "000000"
    },
    role: {
        type: String,
        enum: ['user', 'partner', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true, 
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
