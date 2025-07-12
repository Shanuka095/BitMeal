const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Ideally this should not be here if AuthService is the source of truth
  role: { type: String, enum: ['customer', 'restaurant_admin', 'delivery_personnel'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },

  name: { type: String },    // <-- Ensure 'name' is here (from registration)
  phone: { type: String },   // <-- Ensure 'phone' is here (from registration)

  profile: {
    address: { type: String }, // <-- 'address' remains in profile, updated separately
    profileImageUrl: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
