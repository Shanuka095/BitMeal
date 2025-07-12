const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password -verificationToken');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Return root-level name, phone, and nested profile.address, profileImageUrl, createdAt
    res.json({
      name: user.name || '',
      phone: user.phone || '',
      address: user.profile?.address || '', // Address is nested
      profileImageUrl: user.profile?.profileImageUrl || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // name and phone are now expected at the root level for updates
    const { name, phone, address } = req.body; // Address is still from body
    const profileImageUrl = req.file ? req.file.filename : req.body.profileImageUrl || '';

    const updateFields = {
      name: name,
      phone: phone,
      'profile.address': address, // Update nested address
      'profile.profileImageUrl': profileImageUrl,
    };

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password -verificationToken');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
};

module.exports = { getProfile, updateProfile };
