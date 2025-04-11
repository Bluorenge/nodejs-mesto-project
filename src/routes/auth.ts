import { Router } from 'express';

import { createUser, login } from '../controllers/users';

const authRouter = Router();

authRouter.post('/signup', createUser);
authRouter.post('/signin', login);

export default authRouter;
