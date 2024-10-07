const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');

const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Password Reset',
    html: `<p>To reset your password, click the link below:</p><p><a href="${resetLink}">Reset Password</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};

module.exports = sendResetEmail;
