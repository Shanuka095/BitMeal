const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const multer = require('multer'); // <-- ADD THIS LINE
const fs = require('fs');       // <-- ADD THIS LINE

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

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'profile-uploads/'; // New directory for profile images
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

// Use multer middleware for single file upload on 'profileImage' field
app.use(upload.single('profileImage')); // <-- ADD THIS LINE

app.use(express.json());

// Serve uploaded profile images statically
app.use('/profile-uploads', express.static('profile-uploads')); // <-- ADD THIS LINE

connectDB();

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`UserService running on port ${PORT}`));
