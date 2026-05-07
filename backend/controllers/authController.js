import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendOTPEmail } from '../utils/emailService.js';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';

// REGISTER
export const register = async (req, res) => {
  try {
    const { fullName, email, password, voterId, aadhaar } = req.body;

    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (!voterId || voterId.trim().length < 4) {
      return res.status(400).json({ message: 'Voter ID is required and must be at least 4 characters' });
    }

    const aadhaarClean = String(aadhaar || '').replace(/\D/g, '');
    if (!aadhaarClean || aadhaarClean.length !== 12) {
      return res.status(400).json({ message: 'Aadhaar number must be 12 digits' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      $or: [
        { email: cleanEmail },
        { voterId: voterId.trim() },
        { aadhaar: aadhaarClean },
      ],
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Account already exists with this email or voter id or aadhaar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName: fullName.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: 'voter',
      voterId: voterId.trim(),
      aadhaar: aadhaarClean,
    });

    await user.save();

    res.status(201).json({ message: 'Registration successful', userId: user._id });
  } catch (error) {
    console.log('❌ Register Error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (role && role !== user.role) {
      return res.status(403).json({ message: `This account is not registered as ${role}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    return res.json({
      token,
      userId: user._id,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    });
  } catch (error) {
    console.log('❌ LOGIN FINAL ERROR:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};


// SEND OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required to send OTP' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'voter') {
      return res.status(403).json({ message: 'Only voters require OTP verification' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send OTP email with proper error handling
    let sent = false;
    try {
      sent = await sendOTPEmail(cleanEmail, otp);
    } catch (emailError) {
      console.error('❌ Email service error:', emailError.message);
      // Continue even if email fails - OTP is still valid in dev/testing
    }

    if (!sent) {
      console.warn('⚠️ OTP email not sent via SMTP. Check EMAIL_USER and EMAIL_PASSWORD in .env');
      console.warn('   Make sure to use Gmail App Password (not regular password)');
    }

    const responsePayload = {
      message: 'OTP generated',
      sentToEmail: sent,
      devOtpWarning: !sent && process.env.NODE_ENV === 'production'
        ? 'Email not configured - check backend logs'
        : undefined,
    };

    if (!sent && process.env.NODE_ENV !== 'production') {
      responsePayload.otp = otp; // Dev mode: return OTP only when email failed
      responsePayload.message += ' (Email failed, showing OTP for testing)';
    }

    return res.json(responsePayload);
  } catch (error) {
    console.log('❌ sendOTP Error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// GET USERS (debug, admin-only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { fullName: 1, email: 1, role: 1, isEmailVerified: 1, isActive: 1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'voter') {
      return res.status(403).json({ message: 'Only voters can verify OTP' });
    }

    // Validate OTP
    const otpExpired = user.otpExpires && new Date() > user.otpExpires;
    const otpMismatch = user.otpCode !== otp;
    
    if (!user.otpCode || !user.otpExpires) {
      return res.status(401).json({ message: 'No OTP found. Request a new OTP.' });
    }

    if (otpExpired) {
      return res.status(401).json({ message: 'OTP has expired. Request a new OTP.' });
    }

    if (otpMismatch) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Mark user as verified
    user.isEmailVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: 'Email verified successfully', isEmailVerified: true });
  } catch (error) {
    console.log('❌ Verify OTP Error:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};
