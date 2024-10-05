const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const createError = require('http-errors');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};

const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  await Session.findOneAndDelete({ userId });

  await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
  });

  return { accessToken, refreshToken };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, 'Email or password is wrong');
  }

  const tokens = await generateTokens(user._id);
  return tokens;
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createError(401, 'Invalid refresh token');
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    await Session.findOneAndDelete({ refreshToken });

    const newAccessToken = jwt.sign({ id: decoded.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    await Session.create({
      userId: decoded.id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw createError(401, 'Invalid refresh token');
  }
};

const logoutUser = async (refreshToken) => {
  await Session.findOneAndDelete({ refreshToken });
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
