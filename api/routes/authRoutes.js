const express = require('express');

const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  completeProfile,
  loginWithPassword
} = require('../controllers/authController');

router.post('/send-otp', sendOtp);

router.post('/verify-otp', verifyOtp);

router.post('/complete-profile', completeProfile);
router.post('/login-password', loginWithPassword);

module.exports = router;