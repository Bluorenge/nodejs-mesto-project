import { celebrate, Joi, Segments } from 'celebrate';

import { URL_REGEX } from '../constants/validation';

// Валидация для создания пользователя
export const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(URL_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// Валидация для обновления пользователя
export const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

// Валидация для обновления аватара
export const validateUpdateAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(URL_REGEX).required(),
  }),
});

// Валидация для входа пользователя
export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Валидация для получения пользователя по ID
export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});
