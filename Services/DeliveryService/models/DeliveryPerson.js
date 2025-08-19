const mongoose = require('mongoose');

const DeliveryPersonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ['Motorcycle', 'Car', 'Bicycle', 'Other'],
    default: 'Motorcycle',
    required: true
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  status: {
    type: String,
    enum: ['available', 'on_delivery', 'offline', 'unavailable'],
    default: 'offline',
  },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0, min: 0 },
  // NEW: Like/Dislike fields for drivers
  totalLikes: { type: Number, default: 0, min: 0 },
  totalDislikes: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

DeliveryPersonSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('DeliveryPerson', DeliveryPersonSchema);
