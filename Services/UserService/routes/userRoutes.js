const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, createProfile } = require('../controllers/userController'); // <-- IMPORT new controller

router.post('/create-profile', createProfile); // <-- ADD THIS LINE (no auth needed, called internally)
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
