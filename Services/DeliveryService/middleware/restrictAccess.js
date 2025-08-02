const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('DeliveryService (Authenticate) - Token received:', token ? 'YES' : 'NO'); // Log for debugging
  if (!token) {
    console.warn('DeliveryService (Authenticate) - No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    console.log('DeliveryService (Authenticate) - Decoded token payload:', req.user); // Log for debugging
    next();
  } catch (err) {
    console.error('DeliveryService (Authenticate) - Invalid token or token decoding error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('DeliveryService (restrictTo) - Required roles for this route:', roles); // Log for debugging
    console.log('DeliveryService (restrictTo) - User role:', req.user?.role || 'N/A'); // Log for debugging

    if (!req.user || !roles.includes(req.user.role)) {
      console.warn(`DeliveryService (restrictTo) - Access denied. User ID: ${req.user?.userId || 'N/A'}, Role: ${req.user?.role || 'N/A'}. Required: ${roles.join(', ')}`);
      return res.status(403).json({ error: 'Access denied: Insufficient role' });
    }
    console.log(`DeliveryService (restrictTo) - Access granted for role: ${req.user.role}`);
    next();
  };
};

module.exports = { authenticate, restrictTo };