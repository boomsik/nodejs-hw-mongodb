const express = require('express');
const authController = require('../controllers/authController');
const validateBody = require('../middlewares/validateBody');
const {
  userRegisterSchema,
  userLoginSchema,
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

module.exports = router;
