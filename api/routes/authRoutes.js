const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  completeProfile,
  loginWithPassword,
  register,
  logout
} = require('../controllers/authController');

router.post('/send-otp', sendOtp);

router.post('/verify-otp', verifyOtp);

router.post('/complete-profile', completeProfile);
router.post('/login-password', loginWithPassword);
router.post('/register', register);
router.post('/login', loginWithPassword);
router.post('/logout', auth, logout);

module.exports = router;