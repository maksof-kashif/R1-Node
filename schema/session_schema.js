const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    session_token: {
        type: String,
        required: true,
    },
    user_id: {
        type: String
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

const Session = mongoose.model("Session", SessionSchema);

module.exports = Session;