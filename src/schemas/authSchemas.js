const Joi = require('joi');

// Схема регистрации
const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Схема логина
const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Схема для проверки email
const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Схема для сброса пароля
const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  emailSchema,
  resetPasswordSchema,
};
