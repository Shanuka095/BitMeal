const express = require('express');
const router = express.Router();
const { register, verifyOTP, login, verifyToken, resendOTP } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validate');

router.post('/register', validateRegister, register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', validateLogin, login);
router.get('/verify-token', verifyToken);

module.exports = router;