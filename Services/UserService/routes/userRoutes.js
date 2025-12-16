const express = require('express');
const router = express.Router();
const { createProfile, getProfile, updateProfile, deleteProfile } = require('../controllers/userController'); // Ensure deleteProfile is imported

// ... existing routes ...
router.post('/create-profile', createProfile);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// New Internal Route for Deletion (Protected by logic/network usually, or shared secret)
router.delete('/profile/:id', deleteProfile); 

module.exports = router;