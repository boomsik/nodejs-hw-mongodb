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

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
