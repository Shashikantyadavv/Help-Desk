const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'BoostIsMySecret');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  // console.log(req.user);
  if (req.user.role === 'Customer') {
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
