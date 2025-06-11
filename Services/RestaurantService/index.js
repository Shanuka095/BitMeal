const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const restaurantRoutes = require('./routes/restaurantRoutes');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api/restaurants', restaurantRoutes);

connectDB();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`RestaurantService running on port ${PORT}`));