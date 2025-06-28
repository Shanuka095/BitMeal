const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  imageUrl: { type: String, default: '' }, // Optional image URL for menu item
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menu: [menuItemSchema],
  imageUrl: { type: String, default: '' }, // Optional image URL for restaurant
});

module.exports = mongoose.model('Restaurant', restaurantSchema);