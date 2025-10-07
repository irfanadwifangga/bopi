import { UserService } from '@/modules/services/user.service';
import { Response, Request, NextFunction } from 'express';
import { ApiResponse } from '@/utils/ApiResponse';

export class UserController {
	constructor(private userService: UserService) {}

	async getAllUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const { skip = 0, take = 10 } = req.query;
			const users = await this.userService.getAllUsers(Number(skip), Number(take));
			res.status(200).json(ApiResponse.success(users, 'Users retrieved successfully', 200));
		} catch (error) {
			next(error);
		}
	}

	async getUserById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const user = await this.userService.getUserById(id);
			res.status(200).json(ApiResponse.success(user, 'User retrieved successfully', 200));
		} catch (error) {
			next(error);
		}
	}

	async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const userData = req.body;
			const newUser = await this.userService.createUser(userData);
			res.status(201).json(ApiResponse.success(newUser, 'User created successfully', 201));
		} catch (error) {
			next(error);
		}
	}

	async updateUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const userData = req.body;
			const updatedUser = await this.userService.updateUser(id, userData);
			res.status(200).json(
				ApiResponse.success(updatedUser, 'User updated successfully', 200),
			);
		} catch (error) {
			next(error);
		}
	}

	async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			await this.userService.deleteUser(id);
			res.status(200).json(ApiResponse.success(null, 'User deleted successfully', 200));
		} catch (error) {
			next(error);
		}
	}
}
