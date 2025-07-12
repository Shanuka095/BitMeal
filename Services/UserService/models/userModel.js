const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'restaurant_admin', 'delivery_personnel'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },

  name: { type: String },
  phone: { type: String },
  // Removed address from root-level user model
  // address: { type: String },

  profile: {
    // Keep address here as it's updated via profile
    address: { type: String }, // <-- ENSURE 'address' IS HERE IF YOU WANT IT ON PROFILE
    profileImageUrl: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
