const authService = require('../services/authService');
const createError = require('http-errors');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.registerUser({ name, email, password });
    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.loginUser({
      email,
      password,
    });
    res
      .status(200)
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .json({
        status: 'success',
        message: 'Successfully logged in a user!',
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, 'No refresh token provided');
    }

    const tokens = await authService.refreshAccessToken(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await authService.logoutUser(refreshToken);

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('Email из запроса:', email);

    const user = await authService.findUserByEmail(email);
    if (!user) {
      throw createError(404, 'User not found!');
    }

    await authService.sendPasswordResetEmail(user.email, user);

    res.status(200).json({
      status: 'success',
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const user = await authService.verifyResetTokenAndUpdatePassword(
      token,
      password
    );

    await authService.clearUserSessions(user.id);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  sendResetEmail,
  resetPassword,
};
