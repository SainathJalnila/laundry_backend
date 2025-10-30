import { Router } from 'express';
// Routes
import userRoutes from './user.routes.js';
const routes = Router();
routes.use('/auth', userRoutes);
export default routes;
