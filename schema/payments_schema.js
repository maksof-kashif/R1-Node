const mongoose = require("mongoose");

const PaymentsSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    payment_id: {
        type: String,
        required: true,
    },
    trx_id: {
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

const Payments = mongoose.model("Payments", PaymentsSchema);

module.exports = Payments;