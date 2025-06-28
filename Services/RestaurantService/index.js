const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const restaurantRoutes = require('./routes/restaurantRoutes');
const connectDB = require('./config/db');
const multer = require('multer');

dotenv.config();

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

app.use('/api/restaurants', restaurantRoutes);

connectDB();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`RestaurantService running on port ${PORT}`));