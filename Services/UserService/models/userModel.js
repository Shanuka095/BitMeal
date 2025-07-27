const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // <-- FIX: Make password not required in UserService
  role: { type: String, enum: ['customer', 'restaurant_admin', 'delivery_personnel'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },

  name: { type: String, required: true },
  phone: { type: String, required: true },

  profile: {
    address: { type: String },
    profileImageUrl: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
