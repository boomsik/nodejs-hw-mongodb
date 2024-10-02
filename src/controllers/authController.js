const authService = require('../services/authService');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.registerUser({ name, email, password });
    res.status(201).json({
      status: 201,
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
    const { accessToken, refreshToken, user } = await authService.loginUser({
      email,
      password,
    });
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const newAccessToken = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        status: 400,
        message: 'Refresh token is required',
      });
    }

    await authService.logoutUser(refreshToken);
    res.status(204).json({
      status: 204,
      message: 'Successfully logged out!',
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
};
