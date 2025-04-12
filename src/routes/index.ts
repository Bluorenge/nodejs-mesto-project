import { Router, NextFunction, Request, Response } from 'express';

import usersRouter from './user';
import cardsRouter from './cards';
import authRouter from './auth';
import auth from '../middlewares/auth';
import NotFoundError from '../errors/not-found';

const routes = Router();

routes.use('/', authRouter);

routes.use(auth);
routes.use('/users', usersRouter);
routes.use('/cards', cardsRouter);

// eslint-disable-next-line no-unused-vars
routes.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

export default routes;
