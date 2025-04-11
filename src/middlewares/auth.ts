import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { ACCESS_TOKEN } from '../config';
import '../types/express';
import UnauthorizedError from '../errors/unauthorized';

export default function auth(req: Request, res: Response, next: NextFunction) {
  let payload: JwtPayload | null = null;

  try {
    const { authorization } = req.headers;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Невалидный токен');
    }

    const accessToken = authorization.replace('Bearer ', '');

    payload = jwt.verify(accessToken, ACCESS_TOKEN.secret) as JwtPayload;
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Истек срок действия токена'));
    } else {
      next(new UnauthorizedError('Необходима авторизация'));
    }
  }
}
