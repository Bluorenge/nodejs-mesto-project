import { Router } from 'express';

import { createUser, login } from '../controllers/users';
import { validateCreateUser, validateLogin } from '../validation/user';

const authRouter = Router();

authRouter.post('/signup', validateCreateUser, createUser);
authRouter.post('/signin', validateLogin, login);

export default authRouter;
