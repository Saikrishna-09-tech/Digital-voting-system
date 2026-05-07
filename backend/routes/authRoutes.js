import express from 'express';
import { register, login, sendOTP, verifyOTP, getAllUsers } from '../controllers/authController.js';
import { loginLimiter, otpLimiter } from '../middlewares/rateLimiter.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/send-otp', otpLimiter, sendOTP);
router.post('/verify-otp', otpLimiter, verifyOTP);
router.get('/debug/users', authMiddleware, roleMiddleware(['admin']), getAllUsers);

export default router;
