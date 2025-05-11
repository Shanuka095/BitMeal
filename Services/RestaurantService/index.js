const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const restaurantRoutes = require('./routes/restaurantRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/restaurants', restaurantRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('RestaurantService MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`RestaurantService running on port ${PORT}`));