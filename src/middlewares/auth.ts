import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { ACCESS_TOKEN } from '../config';
import '../types/express';
import HttpError from '../errors/http-error';
import StatusCode from '../constants/status-codes';

export default function auth(req: Request, res: Response, next: NextFunction) {
  let payload: JwtPayload | null = null;

  try {
    const { authorization } = req.headers;

    if (!authorization?.startsWith('Bearer ')) {
      throw new HttpError('Невалидный токен', StatusCode.UNAUTHORIZED);
    }

    const accessToken = authorization.replace('Bearer ', '');

    payload = jwt.verify(accessToken, ACCESS_TOKEN.secret) as JwtPayload;
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      next(new HttpError('Истек срок действия токена', StatusCode.UNAUTHORIZED));
    } else {
      next(new HttpError('Необходима авторизация', StatusCode.UNAUTHORIZED));
    }
  }
}
