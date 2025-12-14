const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// --- INTERNAL: Create Profile ---
const createProfile = async (req, res) => {
  const { userId, email, name, phone, role } = req.body;
  
  try {
    const existing = await User.findById(userId);
    if (existing) return res.status(200).json({ message: 'Profile exists' });

    const newUser = new User({
      _id: userId,
      email,
      name,
      phone,
      role: role || 'customer'
    });
    
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('UserService Error:', error.message);
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

// --- PUBLIC: Get Profile ---
const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password -verificationToken');
    
    if (!user) return res.status(404).json({ error: 'Profile not found' });

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.profile?.address || '',
      profileImageUrl: user.profile?.profileImageUrl || '',
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// --- PUBLIC: Update Profile (Fix applied here) ---
const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Destructure text fields
    const { name, phone, address } = req.body;
    
    // Build update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData['profile.address'] = address; // Optional if you have address

    // Only update image if a new file is uploaded
    if (req.file) {
        updateData['profile.profileImageUrl'] = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json(user);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createProfile, getProfile, updateProfile };