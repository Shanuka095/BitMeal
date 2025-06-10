const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token in authenticate:', decoded); // Debug log
    req.user = decoded;
    next();
  } catch (error) {
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