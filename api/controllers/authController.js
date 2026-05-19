const jwt = require('jsonwebtoken');

const db = require('../models');

const User = db.users;
const bcrypt = require('bcryptjs');

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOtp = async (req, res) => {

  try {

    const { phone } = req.body;

    const otp = generateOtp();

    const otpExpiry = new Date(Date.now() + 5 * 60000);

    let user = await User.findOne({
      where: { phone }
    });

    if (!user) {

      user = await User.create({
        phone,
        otp,
        otp_expiry: otpExpiry,
      });

    } else {

      await user.update({
        otp,
        otp_expiry: otpExpiry,
      });

    }

    console.log('OTP:', otp);

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

    const user = await User.findOne({
      where: { phone }
    });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: 'User not found',
      });

    }

    if (user.otp !== otp) {

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });

    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    await user.update({
      mobile_verified: true,
      otp: null,
    });

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
        is_profile_completed:
          user.is_profile_completed,
      },

    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

exports.completeProfile = async (req, res) => {

  try {

    const {
      phone,
      first_name,
      last_name,
      email,
      password
    } = req.body;

    const user = await User.findOne({
      where: { phone }
    });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: 'User not found',
      });

    }

    const hashedPassword =
    await bcrypt.hash(password, 10);
    await user.update({
      first_name,
      last_name,
      email,
      is_profile_completed: true,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

exports.loginWithPassword = async (req, res) => {

  try {

    const { phone, password } = req.body;

    const user = await User.findOne({
      where: { phone }
    });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: 'User not found',
      });

    }

    if (!user.password) {

      return res.status(400).json({
        success: false,
        message: 'Password not set',
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: 'Invalid password',
      });

    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({

      success: true,
      token,

      user: {
        id: user.id,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_profile_completed:
          user.is_profile_completed,
      },

    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};