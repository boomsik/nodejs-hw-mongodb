const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');
const Session = require('../models/Session'); // Импорт модели сессии

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createError(401, 'No access token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw createError(401, 'Invalid access token format');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createError(401, 'Session invalid or access token expired');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      next(createError(401, 'Access token expired'));
    } else {
      next(createError(401, 'Invalid access token'));
    }
  }
};

module.exports = authenticate;
