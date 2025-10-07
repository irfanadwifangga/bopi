import { Request, Response, NextFunction } from 'express';
import {
	PrismaClientKnownRequestError,
	PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { ApiError } from '@/utils/ApiResponse';
import logger from '@/config/logger';
import config from '@/config/config';

export const globalErrorHandler = (
	error: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	let statusCode = 500;
	let message = 'Internal Server Error';

	// Handle known API errors
	if (error instanceof ApiError) {
		statusCode = error.statusCode;
		message = error.message;
	}

	// Handle Prisma known request errors
	else if (error instanceof PrismaClientKnownRequestError) {
		statusCode = 400;
		switch (error.code) {
			case 'P2002':
				message = 'Resource already exists';
				break;
			case 'P2025':
				message = 'Resource not found';
				break;
			case 'P2003':
				message = 'Foreign key constraint failed';
				break;
			default:
				message = 'Database operation failed';
		}
	}

	// Handle Prisma validation errors
	else if (error instanceof PrismaClientValidationError) {
		statusCode = 400;
		message = 'Invalid data provided';
	}

	// Handle unknown errors
	else if (config.env !== 'production') {
		message = error.message;
	}

	res.locals.errorMessage = message;

	// Log error details in development
	if (config.env === 'development') {
		logger.error('Error details:', {
			message: error.message,
			stack: error.stack,
			...(error instanceof PrismaClientKnownRequestError && {
				prismaCode: error.code,
				prismaDetails: error.meta,
			}),
		});
	} else {
		logger.error(message);
	}

	const response = {
		success: false,
		statusCode,
		message,
		...(config.env === 'development' && { stack: error.stack }),
		timestamp: new Date().toISOString(),
	};

	res.status(statusCode).json(response);
};
