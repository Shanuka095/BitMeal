const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Password is not required here as AuthService handles it
  role: { type: String, enum: ['customer', 'restaurant_admin', 'delivery_personnel'], default: 'customer' }, // Updated enum
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