const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('OrderService MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error (OrderService):', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
