import { Router } from 'express';

import {
  createCard,
  deleteCard,
  getCards,
  setCardLike,
  deleteCardLike,
} from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.post('', createCard);
cardsRouter.get('', getCards);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', setCardLike);
cardsRouter.delete('/cards/:cardId/likes', deleteCardLike);

export default cardsRouter;
