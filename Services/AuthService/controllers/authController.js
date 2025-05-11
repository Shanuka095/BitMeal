const bcrypt = require('bcrypt');
     const jwt = require('jsonwebtoken');
     const nodemailer = require('nodemailer');
     const Auth = require('../models/authModel');

     // Generate 6-digit OTP
     const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

     // Register
     const register = async (req, res) => {
       const { email, password, role } = req.body;
       try {
         const existingUser = await Auth.findOne({ email });
         if (existingUser) return res.status(400).json({ error: 'User already exists' });

         const hashedPassword = await bcrypt.hash(password, 10);
         const otp = generateOTP();
         const hashedOTP = await bcrypt.hash(otp, 10);
         const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
         const otpToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

         const user = new Auth({ email, password: hashedPassword, role, otp: hashedOTP, otpExpires });
         await user.save();

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
         await transporter.sendMail(mailOptions);

         res.status(201).json({ message: 'User registered. Please check your email for the OTP code.', otpToken });
       } catch (error) {
         console.error('Register error:', error);
         res.status(500).json({ error: error.message });
       }
     };

     // Verify OTP
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

     // Login
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

     module.exports = { register, verifyOTP, login };