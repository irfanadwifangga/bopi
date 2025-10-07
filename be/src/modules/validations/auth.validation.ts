import { Role } from '@prisma/client';
import Joi from 'joi';

export const loginSchema = Joi.object({
	email: Joi.string().email().trim().lowercase().required().messages({
		'string.email': 'Please provide a valid email address',
		'string.empty': 'Email is required',
	}),

	password: Joi.string().required().messages({
		'string.empty': 'Password is required',
	}),
});

export const registerSchema = Joi.object({
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
});
