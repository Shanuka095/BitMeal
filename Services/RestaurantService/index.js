const express = require('express');
const dotenv = require('dotenv');
const restaurantRoutes = require('./routes/restaurantRoutes');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', restaurantRoutes); // Changed from '/'

connectDB();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`RestaurantService running on port ${PORT}`));