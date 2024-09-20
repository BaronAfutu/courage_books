// Books.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, trim: true },
    discountPercentage: { type: Number, required: true },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;