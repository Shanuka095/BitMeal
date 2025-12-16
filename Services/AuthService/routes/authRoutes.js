const express = require('express');
const router = express.Router();
const { 
  register, verifyOTP, login, verifyToken, resendOTP,
  forgotPassword, verifyResetOTP, resetPassword,
  changePassword, 
  requestDeleteOTP,       // <--- NEW
  confirmDeleteAccount    // <--- NEW
} = require('../controllers/authController');

const { 
  validateRegister, validateLogin, validateForgotPassword, validateResetPassword, validateChangePassword 
} = require('../middleware/validate');

// Auth Routes
router.post('/register', validateRegister, register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', validateLogin, login);
router.get('/verify-token', verifyToken);

// Password Reset
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', validateResetPassword, resetPassword);

// Authenticated Actions
router.post('/change-password', validateChangePassword, changePassword);
router.post('/request-delete-otp', requestDeleteOTP);          // <--- NEW
router.post('/confirm-delete-account', confirmDeleteAccount);  // <--- NEW

module.exports = router;