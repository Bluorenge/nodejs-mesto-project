import { NextFunction, Request, Response } from 'express';

import CardModel from '../models/card';
import StatusCode from '../constants/status-codes';
import BadRequestError from '../errors/bad-requrst';
import NotFoundError from '../errors/not-found';
import ForbiddenError from '../errors/forbidden';

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
        new BadRequestError(
          'Переданы некорректные данные при создании карточки',
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

    const card = await CardModel.findById(cardId).orFail(
      new NotFoundError(
        'Карточка с указанным ID не найдена',
      ),
    );

    // Проверяем, является ли текущий пользователь владельцем карточки
    if (card.owner.toString() !== userId) {
      throw new ForbiddenError(
        'Вы не можете удалить чужую карточку',
      );
    }

    await CardModel.findByIdAndDelete(cardId);

    res
      .status(StatusCode.OK)
      .send({ message: 'Карточка успешно удалена', data: card });
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(
        new BadRequestError(
          'Передан некорректный ID карточки',
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
    ).orFail(new NotFoundError('Карточка с указанным ID не найдена'));

    res.status(StatusCode.OK).send(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(
        new BadRequestError(
          'Передан некорректный ID карточки',
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
    ).orFail(new NotFoundError('Карточка с указанным ID не найдена'));

    res.status(StatusCode.OK).send(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(
        new BadRequestError(
          'Передан некорректный ID карточки',
        ),
      );
    } else {
      next(err);
    }
  }
};
