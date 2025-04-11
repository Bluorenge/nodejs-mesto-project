import { NextFunction, Request, Response } from 'express';

import CardModel from '../models/card';
import StatusCode from '../constants/status-codes';
import HttpError from '../errors/http-error';

// Получение всех карточек
export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await CardModel.find({});

    res.status(StatusCode.OK).send(cards);
  } catch (err: any) {
    next(err);
  }
};

// Создание новой карточки
export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, link } = req.body;
    const userId = req.user!._id;

    const card = await CardModel.create({ name, link, owner: userId });

    res.status(StatusCode.CREATED).send(card);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(
        new HttpError(
          'Переданы некорректные данные при создании карточки',
          StatusCode.BAD_REQUEST,
        ),
      );
    } else {
      next(err);
    }
  }
};

// Удаление карточки по ID
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const userId = req.user!._id;

    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new HttpError(
        'Карточка с указанным ID не найдена',
        StatusCode.NOT_FOUND,
      );
    }

    // Проверяем, является ли текущий пользователь владельцем карточки
    if (card.owner.toString() !== userId) {
      throw new HttpError(
        'Вы не можете удалить чужую карточку',
        StatusCode.FORBIDDEN,
      );
    }

    await CardModel.findByIdAndDelete(cardId);

    res
      .status(StatusCode.OK)
      .send({ message: 'Карточка успешно удалена', data: card });
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(
        new HttpError(
          'Передан некорректный ID карточки',
          StatusCode.BAD_REQUEST,
        ),
      );
    } else {
      next(err);
    }
  }
};

export const setCardLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user!._id;

    const card = await CardModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      throw new HttpError(
        'Карточка с указанным ID не найдена',
        StatusCode.NOT_FOUND,
      );
    }

    res.status(StatusCode.OK).send(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(
        new HttpError(
          'Передан некорректный ID карточки',
          StatusCode.BAD_REQUEST,
        ),
      );
    } else {
      next(err);
    }
  }
};

export const deleteCardLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user!._id;

    const card = await CardModel.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      throw new HttpError(
        'Карточка с указанным ID не найдена',
        StatusCode.NOT_FOUND,
      );
    }

    res.status(StatusCode.OK).send(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(
        new HttpError(
          'Передан некорректный ID карточки',
          StatusCode.BAD_REQUEST,
        ),
      );
    } else {
      next(err);
    }
  }
};
