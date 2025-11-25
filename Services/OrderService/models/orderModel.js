const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, enum: ['normal', 'full'], default: 'normal' },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  deliveryPersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPerson', default: null },
  items: [orderItemSchema],
  
  // Monetary Fields
  totalAmount: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  tip: { type: Number, default: 0 },

  deliveryAddress: { type: String, default: '' },
  deliveryLocation: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [long, lat]
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  orderDate: { type: Date, default: Date.now },
  restaurantRated: { type: Boolean, default: false },
  driverRated: { type: Boolean, default: false },
  restaurantLikeStatus: { type: String, enum: ['liked', 'disliked'], default: null },
  driverLikeStatus: { type: String, enum: ['liked', 'disliked'], default: null },
}, { timestamps: true });

orderSchema.index({ deliveryLocation: '2dsphere' });

module.exports = mongoose.model('Order', orderSchema);