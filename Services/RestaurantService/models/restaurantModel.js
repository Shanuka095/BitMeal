const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  available: { type: Boolean, default: true },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  cuisine: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  menu: [menuItemSchema],
});

module.exports = mongoose.model('Restaurant', restaurantSchema);