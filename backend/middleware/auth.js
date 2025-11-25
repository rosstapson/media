const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Verify JWT token from cookies or Authorization header
const verifyToken = (req, res, next) => {
  try {
    // Check for token in cookies first, then Authorization header, then query params
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    // For media streaming, also check query parameter
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Optional auth - adds user to request if token exists, but doesn't require it
const optionalAuth = (req, res, next) => {
  try {
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Silently fail for optional auth
  }
  next();
};

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = {
  verifyToken,
  optionalAuth,
  generateToken,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
