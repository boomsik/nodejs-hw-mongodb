const authService = require('../services/authService');

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
    const newAccessToken = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken');
    return res.status(204).send();
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
