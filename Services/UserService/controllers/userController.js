const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); //

// New: Create a basic user profile when notified by AuthService
const createProfile = async (req, res) => {
  const { userId, email, name, phone } = req.body; //
  console.log(`UserService (createProfile) - Received request for userId: ${userId}`); // NEW LOG
  try {
    // Check if profile already exists to prevent duplicates
    const existingProfile = await User.findById(userId); //
    if (existingProfile) {
      console.warn(`UserService (createProfile) - Profile for userId ${userId} already exists. Skipping creation.`);
      return res.status(200).json({ message: 'Profile already exists' });
    }

    // Create a new User document in UserService's DB
    // Use the userId from AuthService as the _id for consistency
    const newUserProfile = new User({
      _id: userId, // Set _id to match the userId from AuthService
      email: email, //
      name: name, //
      phone: phone, //
      // Default values for other fields will be set by the schema
    });
    await newUserProfile.save(); //
    console.log(`UserService (createProfile) - New profile successfully created for userId: ${userId}`); // NEW LOG
    res.status(201).json(newUserProfile); //
  } catch (error) {
    console.error(`UserService (createProfile) - Error creating basic profile for userId ${userId}:`, error.message); // NEW LOG
    res.status(500).json({ error: error.message || 'Failed to create basic user profile' }); //
  }
};


const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('UserService (getProfile) - Request received to fetch profile.'); // NEW LOG
    console.log('UserService (getProfile) - Authorization header present:', !!req.headers.authorization); // NEW LOG

    if (!token) {
      console.log('UserService (getProfile) - No token provided in header.'); //
      return res.status(401).json({ error: 'No token provided' }); //
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET); //
        console.log('UserService (getProfile) - Token decoded successfully. userId:', decoded.userId); // NEW LOG
    } catch (jwtError) {
        console.error('UserService (getProfile) - JWT verification failed:', jwtError.message); // NEW LOG
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Use decoded.userId to find the user in UserService's DB
    const user = await User.findById(decoded.userId).select('-password -verificationToken'); //
    console.log(`UserService (getProfile) - Database query for userId: ${decoded.userId}`); // NEW LOG

    if (!user) {
      console.warn(`UserService (getProfile) - User NOT found in database for userId: ${decoded.userId}`); // This is what the frontend says
      return res.status(404).json({ error: 'User not found' }); //
    }

    console.log(`UserService (getProfile) - User found in database: ${user.email}`); // NEW LOG
    res.json({
      name: user.name || '', //
      phone: user.phone || '', //
      address: user.profile?.address || '', //
      profileImageUrl: user.profile?.profileImageUrl || '', //
      createdAt: user.createdAt, //
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    // This catch block would typically only hit if there's an unexpected error
    // after successful JWT verification, or if the initial token check fails.
    console.error('UserService (getProfile) - Unexpected error fetching profile:', error); //
    res.status(500).json({ error: error.message || 'Failed to fetch profile' }); //
  }
};

const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; //
    if (!token) return res.status(401).json({ error: 'No token provided' }); //

    const decoded = jwt.verify(token, process.env.JWT_SECRET); //
    const { name, phone, address } = req.body; //
    const profileImageUrl = req.file ? req.file.filename : req.body.profileImageUrl || ''; //

    const updateFields = {
      name: name, //
      phone: phone, //
      'profile.address': address, //
      'profile.profileImageUrl': profileImageUrl, //
    };

    const user = await User.findByIdAndUpdate(
      decoded.userId, //
      updateFields, //
      { new: true, runValidators: true } //
    ).select('-password -verificationToken');

    if (!user) return res.status(404).json({ error: 'User not found' }); //
    res.json(user); //
  } catch (error) {
    console.error('UserService (updateProfile) - Error updating profile:', error); //
    res.status(500).json({ error: error.message || 'Failed to update profile' }); //
  }
};

module.exports = { getProfile, updateProfile, createProfile }; //