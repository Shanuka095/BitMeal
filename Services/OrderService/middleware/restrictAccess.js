const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Backend (Authenticate) - Token received:', token ? 'YES' : 'NO');
  if (!token) {
    console.warn('Backend (Authenticate) - No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    console.log('Backend (Authenticate) - Decoded token payload:', req.user);
    next();
  } catch (err) {
    console.error('Backend (Authenticate) - Invalid token or token decoding error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('Backend (restrictTo) - Required roles for this route:', roles);
    console.log('Backend (restrictTo) - req.user object received:', req.user);

    if (!req.user || !roles.includes(req.user.role)) {
      console.warn(`Backend (restrictTo) - Access denied. User ID: ${req.user?.userId || 'N/A'}, Role: ${req.user?.role || 'N/A'}. Required: ${roles.join(', ')}`);
      return res.status(403).json({ error: 'Access denied: Insufficient role' });
    }
    console.log(`Backend (restrictTo) - Access granted for role: ${req.user.role}`);
    next();
  };
};

module.exports = { authenticate, restrictTo };
