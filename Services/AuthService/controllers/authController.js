const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Auth = require('../models/authModel');
const axios = require('axios');

const USER_SERVICE_URL = 'http://localhost:3002/api/users';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- ULTRA-PREMIUM EMAIL TEMPLATE ---
const getEmailTemplate = (title, message, otp, type = 'general') => {
    // Colors based on type (general = orange, warning/delete = red)
    const brandColor = type === 'danger' ? '#dc2626' : '#ffaa00';
    const bgColor = type === 'danger' ? '#fef2f2' : '#fff8e1';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
            body { margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
            .header { background: #111111; padding: 40px 0; text-align: center; }
            .logo { color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
            .logo span { color: ${brandColor}; }
            .content { padding: 50px 40px; text-align: center; }
            .icon { font-size: 48px; margin-bottom: 20px; display: block; }
            .title { color: #1a1a1a; font-size: 24px; font-weight: 800; margin: 0 0 15px; letter-spacing: -0.5px; }
            .message { color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px; }
            .otp-box { background: ${bgColor}; border: 2px dashed ${brandColor}; border-radius: 16px; padding: 20px; display: inline-block; margin-bottom: 30px; }
            .otp-code { color: ${brandColor}; font-size: 36px; font-weight: 800; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace; }
            .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #eeeeee; }
            .footer p { color: #9ca3af; font-size: 12px; margin: 5px 0; }
            .warning { color: #ef4444; font-size: 13px; font-weight: 600; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">BitMeal<span>.</span></h1>
            </div>
            <div class="content">
                <span class="icon">${type === 'danger' ? '⚠️' : '🔐'}</span>
                <h2 class="title">${title}</h2>
                <p class="message">${message}</p>
                
                ${otp ? `
                <div class="otp-box">
                    <p class="otp-code">${otp}</p>
                </div>
                ` : ''}
                
                <p class="message" style="font-size: 14px; margin-bottom: 0;">This code will expire in 10 minutes.</p>
                ${type === 'danger' ? '<p class="warning">If you did not request to delete your account, please contact support immediately.</p>' : ''}
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} BitMeal Inc. All rights reserved.</p>
                <p>Secure Food Delivery Platform</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// --- CONTROLLERS ---

const register = async (req, res) => {
  const { email, password, phone, name, role, vehicleType, licensePlate } = req.body;
  try {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const allowedRoles = ['customer', 'restaurant_admin', 'delivery_personnel'];
    const userRole = allowedRoles.includes(role) ? role : 'customer';

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new Auth({ email, password: hashedPassword, phone, name, role: userRole, otp: hashedOTP, otpExpires });
    await user.save();

    const otpToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

    try {
        await axios.post(`${USER_SERVICE_URL}/create-profile`, {
            userId: user._id, email, name, phone, role: userRole, vehicleType, licensePlate
        });
    } catch (e) { console.error('Profile creation failed', e.message); }

    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });

    await transporter.sendMail({
      from: `"BitMeal Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Account - BitMeal',
      html: getEmailTemplate('Verify Your Account', 'Welcome to the future of food delivery. Please verify your email to continue.', otp),
    });

    res.status(201).json({ message: 'User registered.', otpToken });
  } catch (error) { res.status(500).json({ error: error.message }); }
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
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const verifyOTP = async (req, res) => {
  const { otp, otpToken } = req.body;
  try {
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    const user = await Auth.findOne({ email: decoded.email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (!user.otp || user.otpExpires < Date.now()) return res.status(400).json({ error: 'OTP expired' });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ error: 'Invalid OTP' });

    user.isVerified = true; user.otp = null; user.otpExpires = null;
    await user.save();
    res.json({ message: 'Verified' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Auth.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const otp = generateOTP();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    await transporter.sendMail({
      from: `"BitMeal Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'New Verification Code',
      html: getEmailTemplate('New Code Requested', 'You requested a new verification code for your account.', otp),
    });

    const otpToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    res.json({ message: 'New OTP sent', otpToken });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Auth.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ role: user.role });
  } catch (error) { res.status(401).json({ error: 'Invalid token' }); }
};

// --- PASSWORD RESET FLOW ---
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Auth.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = generateOTP();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    await transporter.sendMail({
      from: `"BitMeal Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      html: getEmailTemplate('Password Reset Request', 'We received a request to reset your password. Use the code below.', otp),
    });

    res.json({ message: 'OTP sent' });
  } catch (error) { res.status(500).json({ error: 'Failed to send OTP' }); }
};

const verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await Auth.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.otp || user.otpExpires < Date.now()) return res.status(400).json({ error: 'OTP expired' });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ error: 'Invalid OTP' });

    const resetToken = jwt.sign({ userId: user._id, purpose: 'reset_password' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    user.otp = null; user.otpExpires = null;
    await user.save();
    res.json({ message: 'OTP verified', resetToken });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const resetPassword = async (req, res) => {
  const { newPassword, resetToken } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.purpose !== 'reset_password') return res.status(403).json({ error: 'Invalid token' });

    const user = await Auth.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) { res.status(400).json({ error: 'Invalid or expired token' }); }
};

const changePassword = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { oldPassword, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Auth.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect old password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
};

// --- NEW: DELETE ACCOUNT FLOW ---
const requestDeleteOTP = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Auth.findById(decoded.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const otp = generateOTP();
        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        
        // Send Warning Email
        await transporter.sendMail({
            from: `"BitMeal Security" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Delete Account Request',
            html: getEmailTemplate('Delete Account Request', 'We received a request to PERMANENTLY delete your account. This action cannot be undone.', otp, 'danger'),
        });

        res.json({ message: 'Delete OTP sent' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

const confirmDeleteAccount = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const { otp } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Auth.findById(decoded.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.otp || user.otpExpires < Date.now()) return res.status(400).json({ error: 'OTP expired' });
        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) return res.status(400).json({ error: 'Invalid OTP' });

        // 1. Delete from User Service
        try {
            await axios.delete(`${USER_SERVICE_URL}/profile/${user._id}`);
        } catch (e) {
            console.warn("Failed to delete user profile from UserService, deleting Auth anyway.", e.message);
        }

        // 2. Delete from Auth Service
        await Auth.findByIdAndDelete(user._id);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { 
  register, verifyOTP, login, verifyToken, resendOTP,
  forgotPassword, verifyResetOTP, resetPassword, 
  changePassword, requestDeleteOTP, confirmDeleteAccount 
};