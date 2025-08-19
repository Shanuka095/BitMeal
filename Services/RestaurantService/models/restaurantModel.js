const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  normalPrice: { type: Number, required: true, min: 0 },
  extraPriceForFull: { type: Number, default: 0, min: 0 },
  category: { type: String, required: true },
  imageUrl: { type: String, default: '' },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menu: [menuItemSchema],
  imageUrl: { type: String, default: '' },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0, min: 0 },
  // NEW: Like/Dislike fields
  totalLikes: { type: Number, default: 0, min: 0 },
  totalDislikes: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
