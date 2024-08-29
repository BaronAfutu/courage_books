// Payments.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    // user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, unique: true, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['successful', 'failed', 'pending','cancelled'], default: 'pending' }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;