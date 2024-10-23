// users.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: []
  }],
  cart: {
    type: [{
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
      quantity: { type: Number, default: 1 }
    }],
    default: []
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: []
  }],
  address: { type: String, default: "" },
  balance: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  status: { type: Number, default: 1 },
  profileImage: { type: String, default: "" },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
