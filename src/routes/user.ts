import { Router } from 'express';

import {
  getAllUsers,
  getUserById,
  updateUserAvatar,
  updateUser,
} from '../controllers/users';
import { validateUpdateUser, validateUpdateAvatar, validateUserId } from '../validation/user';

const usersRouter = Router();

usersRouter.get('', getAllUsers);
usersRouter.get('/:userId', validateUserId, getUserById);

usersRouter.patch('/me', validateUpdateUser, updateUser);
usersRouter.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

export default usersRouter;
