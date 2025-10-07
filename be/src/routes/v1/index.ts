import { Router } from 'express';
import healthRoutes from '@/routes/v1/health/health.route';
import userRoutes from '@/routes/v1/users/users.route';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);

export default router;
