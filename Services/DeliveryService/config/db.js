const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Use MONGO_URI from .env
    console.log('DeliveryService MongoDB connected');
  } catch (error) {
    console.error('DeliveryService MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;