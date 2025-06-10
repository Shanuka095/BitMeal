// Services/RestaurantService/middleware/restrictAccess.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token in authenticate:', decoded); // Debug log
    if (!decoded.userId || typeof decoded.userId !== 'string') {
      return res.status(401).json({ error: 'Invalid token: missing or invalid userId' });
    }
    req.user = { userId: decoded.userId, role: decoded.role }; // Explicitly set required fields
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  console.log('User role check:', req.user); // Debug log
  if (!req.user) {
    return res.status(403).json({ error: 'Access denied' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied: Insufficient role' });
  }
  next();
};

module.exports = { authenticate, restrictTo };