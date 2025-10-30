import { Router } from 'express';
import { register, login } from '../controllers/user.controller.js';
import { zodValidate } from '../validations/index.js';
import { registerSchema, loginSchema } from '../validations/user.js';
const userRoutes = Router();
userRoutes.post('/register', zodValidate(registerSchema, 'body'), register);
userRoutes.post('/login', zodValidate(loginSchema), login);
export default userRoutes;
