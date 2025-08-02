const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const deliveryRoutes = require('./routes/deliveryRoutes');

dotenv.config();
const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Allow your frontend to access
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Add PATCH method for status updates
  allowedHeaders: ['Authorization', 'Content-Type'],
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/delivery', deliveryRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('DeliveryService is running!');
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`DeliveryService running on port ${PORT}`));