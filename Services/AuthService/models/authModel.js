const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'restaurant_admin', 'delivery_personnel'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String }, // Store hashed OTP
  otpExpires: { type: Date }, // OTP expiration time
});

module.exports = mongoose.model('Auth', authSchema);