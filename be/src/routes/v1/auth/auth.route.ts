import { Router } from 'express';
import { UserRepository } from '@/modules/repositories/user.repository';
import { AuthService } from '@/modules/services/auth.service';
import { AuthController } from '@/modules/controllers/auth.controller';
import { validateRequest } from '@/middleware/validation';
import { authValidation } from '@/modules/validations/auth.validation';
import { requireAuth } from '@/middleware/auth';

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/register', validateRequest(authValidation.registerSchema), (req, res, next) =>
	authController.register(req, res, next),
);

router.post('/login', validateRequest(authValidation.loginSchema), (req, res, next) =>
	authController.login(req, res, next),
);

router.post('/logout', requireAuth, (req, res, next) => authController.logout(req, res, next));
router.get('/me', requireAuth, (req, res, next) => authController.me(req, res, next));

export default router;
