// orders.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], default: 'pending' },
  shippingStatus: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
  shippingAddress: { type: String, default: "" }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
