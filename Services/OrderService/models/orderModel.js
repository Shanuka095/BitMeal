const mongoose = require('mongoose');

// Schema for individual items within an order
const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
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
  size: {
    type: String,
    enum: ['normal', 'full'],
    default: 'normal',
  },
});

// Main Order Schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  deliveryPersonId: { // NEW: Field to link to a delivery person
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPerson', // Refers to the DeliveryPerson model in DeliveryService
    default: null, // Initially, no delivery person is assigned
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryAddress: {
    type: String,
    required: false,
    default: '',
  },
  deliveryLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  isRated: { // NEW: To track if this order has been rated by the customer
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Create a geospatial index for efficient location queries
orderSchema.index({ deliveryLocation: '2dsphere' });

module.exports = mongoose.model('Order', orderSchema);