import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';
import StatusCode from '../constants/status-codes';
import { ACCESS_TOKEN } from '../config';
import BadRequestError from '../errors/bad-requrst';
import NotFoundError from '../errors/not-found';
import ConflictError from '../errors/conflict';

// Получение всех пользователей
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await UserModel.find({});

    res.status(StatusCode.OK).send(users);
  } catch (err: any) {
    next(err);
  }
};

// Создание нового пользователя
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name, about, avatar, email, password: hashPassword,
    });

    res.status(StatusCode.CREATED).send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при создании пользователя',
        ),
      );
    } else if (err.code === 11000) {
      next(
        new ConflictError(
          'Пользователь с таким email уже существует',
        ),
      );
    } else {
      next(err);
    }
  }
};

// Получение пользователя по ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId).orFail(
      new NotFoundError(
        'Пользователь с указанным ID не найден',
      ),
    );

    res.status(StatusCode.OK).send(user);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(
        new BadRequestError(
          'Передан некорректный ID пользователя',
        ),
      );
    } else {
      next(err);
    }
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.user!._id;

    const user = await UserModel.findById(userId).orFail(
      new NotFoundError(
        'Пользователь с указанным ID не найден',
      ),
    );

    res.status(StatusCode.OK).send(user);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(
        new BadRequestError(
          'Передан некорректный ID пользователя',
        ),
      );
    } else {
      next(err);
    }
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, about } = req.body;
    const userId = req.user!._id;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(new NotFoundError('Пользователь с указанным ID не найден'));

    res.status(StatusCode.OK).send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении пользователя',
        ),
      );
    } else {
      next(err);
    }
  }
};

export const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { avatar } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(new NotFoundError('Пользователь с указанным ID не найден'));

    res.status(StatusCode.OK).send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении аватара',
        ),
      );
    } else {
      next(err);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, ACCESS_TOKEN.secret, { expiresIn: '7d' });

    res.status(StatusCode.OK).send({ token });
  } catch (err: any) {
    next(err);
  }
};
