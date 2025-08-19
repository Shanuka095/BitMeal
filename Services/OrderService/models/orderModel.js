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
  deliveryPersonId: { // Field to link to a delivery person
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
  // FIX: Make deliveryAddress NOT required in Mongoose schema
  deliveryAddress: {
    type: String,
    required: false, // Set to false to make it optional
    default: '', // Provide a default empty string if not provided
  },
  
  deliveryLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true, // This must remain true as a map pin is mandatory
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
  isRated: { // To track if this order has been rated by the customer
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Create a geospatial index for efficient location queries
orderSchema.index({ deliveryLocation: '2dsphere' });

module.exports = mongoose.model('Order', orderSchema);
