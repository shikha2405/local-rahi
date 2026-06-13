const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

class AuthService {
  async sendOtp(phone) {
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60000);

    let user = await userRepository.findByPhone(phone);
    if (!user) {
      user = await userRepository.create({
        phone,
        otp,
        otp_expiry: otpExpiry,
      });
    } else {
      await userRepository.update(user, {
        otp,
        otp_expiry: otpExpiry,
      });
    }

    console.log('OTP:', otp);
    return otp;
  }

  async verifyOtp(phone, otp) {
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    await userRepository.update(user, {
      mobile_verified: true,
      otp: null,
    });

    return { token, user };
  }

  async completeProfile({ phone, first_name, last_name, email, password }) {
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.update(user, {
      first_name,
      last_name,
      email,
      is_profile_completed: true,
      password: hashedPassword,
    });

    return true;
  }

  async register({ phone, first_name, last_name, email, password }) {
    if (!phone || !password || !first_name || !last_name || !email) {
      throw new Error('All registration fields (phone, password, first_name, last_name, email) are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await userRepository.findByPhone(phone);
    if (!user) {
      user = await userRepository.create({
        phone,
        first_name,
        last_name,
        email,
        password: hashedPassword,
        is_profile_completed: true,
        mobile_verified: true,
      });
    } else {
      await userRepository.update(user, {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        is_profile_completed: true,
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    return { token, user };
  }

  async loginWithPassword(phone, password) {
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.password) {
      throw new Error('Password not set');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    return { token, user };
  }
}

module.exports = new AuthService();
