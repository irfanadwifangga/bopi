export class ApiResponse {
	static success<T>(
		data: T,
		message = 'Request successful',
		statusCode = 200,
		meta: Record<string, any> = {},
	) {
		return {
			success: true,
			statusCode,
			message,
			data,
			meta,
			timestamp: new Date().toISOString(),
		};
	}
}

export class ApiError extends Error {
	statusCode: number;
	isOperational: boolean;

	constructor(statusCode: number, message: string, isOperational = true, stack = '') {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
