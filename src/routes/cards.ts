import { Router } from 'express';

import {
  createCard,
  deleteCard,
  getCards,
  setCardLike,
  deleteCardLike,
} from '../controllers/cards';
import { validateCardId, validateCreateCard } from '../validation/card';

const cardsRouter = Router();

cardsRouter.get('', getCards);
cardsRouter.post('', validateCreateCard, createCard);
cardsRouter.delete('/:cardId', validateCardId, deleteCard);
cardsRouter.put('/:cardId/likes', validateCardId, setCardLike);
cardsRouter.delete('/cards/:cardId/likes', validateCardId, deleteCardLike);

export default cardsRouter;
