const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models/User.model'); 

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Access Denied. No Token Provided.' });
  }

  jwt.verify(token, config.jwtSecret, async (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid Token.' });
    }
    try {
      req.user = await User.findById(user._id).select('-password');
      next();
    } catch (err) {
      res.status(500).send({ message: 'Failed to authenticate user.' });
    }
  });
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: 'Access Denied. You do not have the required role.' });
    }
    next();
  };
}

function generateAccessToken(user) {
  const payload = { _id: user._id, role: user.role };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
}

module.exports = { authenticateToken, authorizeRoles, generateAccessToken };
