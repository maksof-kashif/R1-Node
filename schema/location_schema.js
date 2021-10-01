const mongoose = require("mongoose");

const LocationsSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
    },
    role: {
        type: String,
        required: true,
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

const Location = mongoose.model("Location", LocationsSchema);

module.exports = Location;