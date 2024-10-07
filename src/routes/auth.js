const express = require('express');
const authController = require('../controllers/authController');
const validateBody = require('../middlewares/validateBody');
const {
  userRegisterSchema,
  userLoginSchema,
  emailSchema,
  resetPasswordSchema,
} = require('../schemas/authSchemas');

const router = express.Router();

router.post(
  '/register',
  validateBody(userRegisterSchema),
  authController.registerUser
);

router.post('/login', validateBody(userLoginSchema), authController.loginUser);

router.post('/refresh', authController.refreshToken);

router.post('/logout', authController.logoutUser);

router.post(
  '/send-reset-email',
  validateBody(emailSchema),
  authController.sendResetEmail
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  authController.resetPassword
);

module.exports = router;
