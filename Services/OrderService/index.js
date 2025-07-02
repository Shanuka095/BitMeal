const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Allow your frontend to access
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
};
app.use(cors(corsOptions));

app.use(express.json()); // For parsing application/json

// Connect to MongoDB
connectDB();

// Order routes
app.use('/api/orders', orderRoutes);

// Basic route for health check
app.get('/', (req, res) => {
  res.send('OrderService is running!');
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`OrderService running on port ${PORT}`));
