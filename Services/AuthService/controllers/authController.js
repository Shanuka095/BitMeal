const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

// Register
const register = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Nodemailer Setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const user = new User({ email, password: hashedPassword, role, verificationToken });
    await user.save();

    // Send Verification Email
    const mailOptions = {
        from: `"BitMeal" <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: 'Verify Your BitMeal Account',
        html: `
          <h2>Welcome to BitMeal!</h2>
          <p>Please verify your email by clicking the link below:</p>
          <a href="http://192.168.1.100:5173/verify?token=${verificationToken}">Verify Email</a>
          <p>If the link doesn't work, copy and paste it into your browser.</p>
        `,
      };
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, verificationToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(400).json({ error: 'User not found or email not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, verifyEmail, login };