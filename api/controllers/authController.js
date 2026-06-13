const authService = require('../services/authService');

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = await authService.sendOtp(phone);
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const { token, user } = await authService.verifyOtp(phone, otp);
    return res.status(200).json({
      success: true,
      message: 'OTP verified',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_profile_completed: user.is_profile_completed,
      },
    });
  } catch (error) {
    const isNotFound = error.message === 'User not found';
    return res.status(isNotFound ? 404 : 400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.completeProfile = async (req, res) => {
  try {
    const { phone, first_name, last_name, email, password } = req.body;
    await authService.completeProfile({ phone, first_name, last_name, email, password });
    return res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
    });
  } catch (error) {
    const isNotFound = error.message === 'User not found';
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.loginWithPassword = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const { token, user } = await authService.loginWithPassword(phone, password);
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_profile_completed: user.is_profile_completed,
      },
    });
  } catch (error) {
    const isNotFound = error.message === 'User not found';
    return res.status(isNotFound ? 404 : 400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { phone, first_name, last_name, email, password } = req.body;
    const { token, user } = await authService.register({ phone, first_name, last_name, email, password });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_profile_completed: user.is_profile_completed,
      },
    });
  } catch (error) {
    const isValidationError = error.message.includes('required');
    return res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

exports.logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};