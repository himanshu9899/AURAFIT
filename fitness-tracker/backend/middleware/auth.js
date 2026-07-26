const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fitness_tracker_secret_key_2026';

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    req.user = { id: 'guest_user_1', email: 'alex.fitness@example.com', name: 'Alex Johnson', isGuest: true };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired', isGuest: true });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
