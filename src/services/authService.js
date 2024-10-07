const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const createError = require('http-errors');
const nodemailer = require('nodemailer');

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
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw createError(401, 'Invalid refresh token');
  }
};

// Сброс пароля
const verifyResetTokenAndUpdatePassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return user;
  } catch (error) {
    throw createError(401, 'Token is expired or invalid.');
  }
};

// Удаление сессий пользователя
const clearUserSessions = async (userId) => {
  await Session.deleteMany({ userId });
};

// Поиск пользователя по email
const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found');
  }
  return user;
};

// Отправка email для сброса пароля
const sendPasswordResetEmail = async (email, user) => {
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetPasswordUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>To reset your password, please click the following link: <a href="${resetPasswordUrl}">Reset Password</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Письмо успешно отправлено');
  } catch (error) {
    console.error('Ошибка при отправке письма:', error.message);
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};

const logoutUser = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createError(401, 'Invalid session or already logged out.');
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  findUserByEmail,
  sendPasswordResetEmail,
  verifyResetTokenAndUpdatePassword,
  clearUserSessions,
};
