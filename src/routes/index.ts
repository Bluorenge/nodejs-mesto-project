import { Router } from 'express';

import usersRouter from './user';
import cardsRouter from './cards';
import authRouter from './auth';
import auth from '../middlewares/auth';

const routes = Router();

routes.use('/', authRouter);

routes.use(auth);
routes.use('/users', usersRouter);
routes.use('/cards', cardsRouter);

routes.use('*', (_req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

export default routes;
