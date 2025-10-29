import { Router } from 'express';

import { register, login } from '../controllers/user.controller';

import { zodValidate } from '../validations';
import { registerSchema, loginSchema } from '../validations/user';

const userRoutes = Router();

userRoutes.post('/register', zodValidate(registerSchema, 'body'), register);
userRoutes.post('/login', zodValidate(loginSchema), login)

export default userRoutes;