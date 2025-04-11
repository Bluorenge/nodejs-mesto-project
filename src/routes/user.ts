import { Router } from 'express';

import {
  getAllUsers,
  getUserById,
  updateUserAvatar,
  updateUser,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('', getAllUsers);
usersRouter.get('/:userId', getUserById);

usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateUserAvatar);

export default usersRouter;
