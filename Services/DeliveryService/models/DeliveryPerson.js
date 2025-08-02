const mongoose = require('mongoose');

const DeliveryPersonSchema = new mongoose.Schema({
  userId: { // Link to the user in AuthService, if they register through auth service
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth', // Refers to the Auth model in AuthService, used for authentication
    required: true,
    unique: true // A user can only be one delivery person
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
  currentLocation: { // For future use with geospatial data
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  },
  status: { // Available for delivery or not
    type: String,
    enum: ['available', 'on_delivery', 'offline', 'unavailable'],
    default: 'offline',
  },
  // Optional: profileImage, rating, numberOfDeliveries, etc.
}, { timestamps: true });

// Create a geospatial index for location for future proximity searches
DeliveryPersonSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('DeliveryPerson', DeliveryPersonSchema);