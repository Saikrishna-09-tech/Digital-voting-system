import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Provide a consistent `userId` property for downstream code
    req.user = {
      ...decoded,
      userId: decoded.id || decoded.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

export const otpVerifiedMiddleware = (req, res, next) => {
  if (!req.user.isOTPVerified && req.user.role === 'voter') {
    return res.status(401).json({ message: 'Please verify your email first' });
  }
  next();
};
