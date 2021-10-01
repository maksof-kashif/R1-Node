const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    email_verification_code: {
        type: String,
    },
    phone_number: {
        type: String,
        required: true
    },
    wallet: {
        type: Number,
        default: 0
    },
    updated_at:{
        type: Date, 
        default: new Date() 
    },
    created_at: {
        type: Date,
        default: new Date() 
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;