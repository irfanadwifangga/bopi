import { CreateUserDto, UpdateUserDto } from '@/modules/dtos/user.dto';
import { UserRepository } from '@/modules/repositories/user.repository';
import { ApiError } from '@/utils/ApiResponse';
import { PasswordUtils } from '@/utils/Password';
import httpStatus from 'http-status';

export class UserService {
	constructor(private userRepository: UserRepository) {}

	async getAllUsers(skip = 0, take = 10) {
		const users = await this.userRepository.findAll(skip, take);
		return users.map(({ password, ...user }) => user);
	}

	async getUserById(id: string) {
		if (!id || typeof id !== 'string') {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user ID');
		}

		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
		}

		const { password, ...safeUser } = user;
		return safeUser;
	}

	async createUser(data: CreateUserDto) {
		const existingUser = await this.userRepository.findByEmail(data.email);
		if (existingUser) {
			throw new ApiError(httpStatus.CONFLICT, 'Email already in use');
		}

		const passwordValidation = PasswordUtils.validate(data.password);
		if (!passwordValidation.isValid) {
			throw new ApiError(httpStatus.BAD_REQUEST, passwordValidation.errors.join(', '));
		}

		const hashedPassword = await PasswordUtils.hash(data.password);
		const userData = {
			...data,
			password: hashedPassword,
		};

		const newUser = await this.userRepository.createUser(userData);
		const { password, ...safeUser } = newUser;
		return safeUser;
	}

	async updateUser(id: string, data: UpdateUserDto) {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
		}

		if (data.email && data.email !== user.email) {
			const existingUser = await this.userRepository.findByEmail(data.email);
			if (existingUser) {
				throw new ApiError(httpStatus.CONFLICT, 'Email already in use');
			}
		}

		if (data.password) {
			const passwordValidation = PasswordUtils.validate(data.password);
			if (!passwordValidation.isValid) {
				throw new ApiError(httpStatus.BAD_REQUEST, passwordValidation.errors.join(', '));
			}
			data.password = await PasswordUtils.hash(data.password);
		}

		const updatedUser = await this.userRepository.updateUser(id, data);
		const { password, ...safeUser } = updatedUser;
		return safeUser;
	}

	async deleteUser(id: string) {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
		}

		await this.userRepository.deleteUser(id);
		return { message: 'User deleted successfully' };
	}
}
