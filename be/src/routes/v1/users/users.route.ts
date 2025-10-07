import { Router } from 'express';
import { UserController } from '@/modules/controllers/user.controller';
import { UserService } from '@/modules/services/user.service';
import { UserRepository } from '@/modules/repositories/user.repository';
import { userValidation } from '@/modules/validations/user.validation';
import { validateRequest } from '@/middleware/validation';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const router = Router();

router.get('/', validateRequest(userValidation.getUsersQuery), (req, res, next) =>
	userController.getAllUsers(req, res, next),
);
router.get('/:id', validateRequest(userValidation.userIdSchema), (req, res, next) =>
	userController.getUserById(req, res, next),
);
router.post('/', validateRequest(userValidation.createUserSchema), (req, res, next) =>
	userController.createUser(req, res, next),
);
router.put('/:id', validateRequest(userValidation.updateUserSchema), (req, res, next) =>
	userController.updateUser(req, res, next),
);
router.delete('/:id', validateRequest(userValidation.userIdSchema), (req, res, next) =>
	userController.deleteUser(req, res, next),
);

export default router;
