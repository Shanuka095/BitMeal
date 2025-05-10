const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'restaurant_admin', 'delivery_personnel'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  profile: {
    name: { type: String },
    phone: { type: String },
    address: { type: String },
  },
});

module.exports = mongoose.model('User', userSchema);