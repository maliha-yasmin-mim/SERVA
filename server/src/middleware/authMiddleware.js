import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  // 1. Try Authorization Bearer header first (used by cross-origin API calls)
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  // 2. Fall back to httpOnly cookie (same-origin / local dev)
  if (!token) {
    const cookieToken = req.headers.cookie
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('serva_token='))
      ?.slice('serva_token='.length);
    token = cookieToken;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route. Please log in.' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Authentication is not configured on this server.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized. Invalid or expired token.' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required.' });
  }
};
