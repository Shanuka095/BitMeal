const mongoose = require('mongoose');

// Schema for individual items within an order
const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the actual menu item
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: { // New field to store selected size (e.g., 'normal', 'full')
    type: String,
    enum: ['normal', 'full'],
    default: 'normal',
  },
  // You might add other fields like imageUrl, notes, etc.
});

// Main Order Schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who placed the order
    ref: 'Auth', // Assuming 'Auth' is the user model in AuthService
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the restaurant
    ref: 'Restaurant', // Assuming 'Restaurant' is the restaurant model in RestaurantService
    required: true,
  },
  items: [orderItemSchema], // Array of items in the order
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  // Optional: deliveryPersonId, paymentStatus, etc.
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

module.exports = mongoose.model('Order', orderSchema);
