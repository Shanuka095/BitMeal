const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const restaurantRoutes = require('./routes/restaurantRoutes');
const connectDB = require('./config/db');
const multer = require('multer');
const fs = require('fs');

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
};
app.use(cors(corsOptions));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'Uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Apply express.json() and static files middleware
app.use(express.json());
app.use('/Uploads', express.static('Uploads'));

// Connect to DB
connectDB();

// Apply routes
app.use('/api/restaurants', restaurantRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`RestaurantService running on port ${PORT}`));

// Export only app
module.exports = app;