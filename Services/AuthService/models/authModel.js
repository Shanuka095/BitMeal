const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  name: { type: String, required: true }, // <-- ADD THIS LINE
  role: { type: String, enum: ['customer', 'restaurant_admin', 'delivery_personnel'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Auth', authSchema);
