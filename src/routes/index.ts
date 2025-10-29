import { Router } from 'express';
// Routes
import userRoutes from './user.routes';

const routes = Router();

routes.use('/auth', userRoutes);

export default routes;