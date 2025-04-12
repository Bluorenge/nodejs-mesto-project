import { celebrate, Joi, Segments } from 'celebrate';
import URL_REGEX from '../constants/validation';

// Валидация для создания карточки
export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEX),
  }),
});

// Валидация для получения/удаления/лайка/дизлайка карточки по ID
export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
