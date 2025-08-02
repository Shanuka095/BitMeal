const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Auth = require('../models/authModel');
const axios = require('axios');

const USER_SERVICE_URL = 'http://localhost:3002/api/users';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const register = async (req, res) => {
  const { email, password, phone, name } = req.body;
  try {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new Auth({ email, password: hashedPassword, phone, name, otp: hashedOTP, otpExpires });
    await user.save();

    // Define otpToken immediately after user is saved, before any other async operations
    const otpToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' }); // <-- DEFINED HERE

    // Attempt to create basic profile in UserService
    try {
        await axios.post(`${USER_SERVICE_URL}/create-profile`, {
            userId: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
        });
        console.log(`Basic profile created in UserService for userId: ${user._id}`);
    } catch (profileError) {
        console.error(`Failed to create basic profile in UserService for ${user._id}:`, profileError.response?.data || profileError.message);
        // Do NOT re-throw or return here.
        // The AuthService registration itself is successful, even if profile creation fails.
        // The user can still verify OTP and then update their profile manually later.
    }

    // Nodemailer Setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP Email
    const mailOptions = {
      from: `"BitMeal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your BitMeal OTP Code',
      html: `
        <h2>Welcome to BitMeal!</h2>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This code is valid for 10 minutes.</p>
      `,
    };
    await transporter.sendMail(mailOptions); // This might also throw an error

    // This line should now always be reached if no unhandled error occurs before it
    res.status(201).json({ message: 'User registered. Please check your email for the OTP code.', otpToken });
  } catch (error) {
    console.error('Register error:', error);
    // If an error occurs here (e.g., user.save() fails, or nodemailer fails),
    // then send a 500 response.
    res.status(500).json({ error: error.message || 'Registration failed due to server error' });
  }
};

// Verify OTP (no changes needed here)
const verifyOTP = async (req, res) => {
  const { otp, otpToken } = req.body;
  try {
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await Auth.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (user.isVerified) return res.status(400).json({ error: 'User already verified' });

    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'OTP expired or invalid' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ error: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login (no changes needed here)
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Auth.findOne({ email });
    if (!user || !user.isVerified) return res.status(400).json({ error: 'User not found or not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log(`Login successful for ${email}, role: ${user.role}`);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Token (no changes needed here)
const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Auth.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ role: user.role });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { register, verifyOTP, login, verifyToken };
