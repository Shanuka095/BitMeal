const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Auth = require('../models/authModel');
const axios = require('axios');

const USER_SERVICE_URL = 'http://localhost:3002/api/users';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ... (Keep register function as is) ...
const register = async (req, res) => {
  // ... (Keep existing register logic) ...
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

    const otpToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

    try {
        await axios.post(`${USER_SERVICE_URL}/create-profile`, {
            userId: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
        });
    } catch (profileError) {
        console.error(`Failed to create basic profile:`, profileError.message);
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"BitMeal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your BitMeal OTP Code',
      html: `<h2>Welcome to BitMeal!</h2><p>Your OTP code is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`,
    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered. OTP sent.', otpToken });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

// --- NEW: Resend OTP Function ---
const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Auth.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'User already verified' });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = hashedOTP;
    user.otpExpires = otpExpires;
    await user.save();

    // Generate a fresh token
    const otpToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"BitMeal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Resend: Your BitMeal OTP Code',
      html: `<h2>New OTP Request</h2><p>Your new OTP code is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: 'New OTP sent successfully', otpToken });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ... (Keep verifyOTP, login, verifyToken as they were) ...
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

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await Auth.findOne({ email });
      if (!user || !user.isVerified) return res.status(400).json({ error: 'User not found or not verified' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, role: user.role });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

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

module.exports = { register, resendOTP, verifyOTP, login, verifyToken };