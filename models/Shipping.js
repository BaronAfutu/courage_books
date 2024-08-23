// Books.js
const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    shippingMethod: { type: String, required: true },
    trackingNumber: { type: String, unique: true },
    carrier: { type: String, required: true },
    cost: { type: Number, required: true },
    status: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
    estimatedDeliveryDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;