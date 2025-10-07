import Joi from 'joi';
import { Role } from '@prisma/client';

export const userValidation = {
	createUserSchema: Joi.object({
		name: Joi.string().trim().min(2).max(100).required().messages({
			'string.empty': 'Name is required',
			'string.min': 'Name must be at least 2 characters',
			'string.max': 'Name must not exceed 100 characters',
		}),

		email: Joi.string().email().trim().lowercase().max(100).required().messages({
			'string.email': 'Please provide a valid email address',
			'string.empty': 'Email is required',
			'string.max': 'Email must not exceed 100 characters',
		}),

		password: Joi.string()
			.min(8)
			.max(255)
			.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
			.required()
			.messages({
				'string.min': 'Password must be at least 8 characters',
				'string.max': 'Password must not exceed 255 characters',
				'string.pattern.base':
					'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
				'string.empty': 'Password is required',
			}),

		role: Joi.string()
			.valid(...Object.values(Role))
			.default(Role.CUSTOMER)
			.messages({
				'any.only': 'Role must be either ADMIN or CUSTOMER',
			}),
	}),

	updateUserSchema: Joi.object({
		name: Joi.string().trim().min(2).max(100).messages({
			'string.min': 'Name must be at least 2 characters',
			'string.max': 'Name must not exceed 100 characters',
		}),

		email: Joi.string().email().trim().lowercase().max(100).messages({
			'string.email': 'Please provide a valid email address',
			'string.max': 'Email must not exceed 100 characters',
		}),

		password: Joi.string()
			.min(8)
			.max(255)
			.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
			.messages({
				'string.min': 'Password must be at least 8 characters',
				'string.max': 'Password must not exceed 255 characters',
				'string.pattern.base':
					'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			}),

		role: Joi.string()
			.valid(...Object.values(Role))
			.messages({
				'any.only': 'Role must be either ADMIN or CUSTOMER',
			}),
	})
		.min(1)
		.messages({
			'object.min': 'At least one field must be provided for update',
		}),

	userIdSchema: Joi.object({
		id: Joi.string().trim().required().messages({
			'string.empty': 'User ID is required',
		}),
	}),

	getUsersQuery: Joi.object({
		skip: Joi.number().min(0).default(0),
		take: Joi.number().min(1).max(100).default(10),
	}),
};
