import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '@/utils/ApiResponse';
import httpStatus from 'http-status';

export const validateRequest = (schema: Joi.ObjectSchema) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const validationTarget = {
			...req.body,
			...req.query,
			...req.params,
		};

		const { error, value } = schema.validate(validationTarget, {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true,
		});

		if (error) {
			const errorMessage = error.details.map((detail) => detail.message).join(', ');
			return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
		}

		// Update request objects with validated values
		if (req.body && Object.keys(req.body).length > 0) {
			Object.keys(req.body).forEach((key) => {
				if (key in value) {
					req.body[key] = value[key];
				}
			});
		}

		if (req.query && Object.keys(req.query).length > 0) {
			Object.keys(req.query).forEach((key) => {
				if (key in value) {
					req.query[key] = value[key];
				}
			});
		}

		if (req.params && Object.keys(req.params).length > 0) {
			Object.keys(req.params).forEach((key) => {
				if (key in value) {
					req.params[key] = value[key];
				}
			});
		}

		next();
	};
};
