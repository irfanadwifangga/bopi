import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '@/config/config';
// logger removed: dev bypass logic removed so it's unused
import { TokenBlacklist } from '@/utils/TokenBlacklist';
import { ApiError } from '@/utils/ApiResponse';
import httpStatus from 'http-status';

export interface AuthPayload {
	id: string;
	email: string;
	role?: string;
}

export function requireRole(role: string) {
	return function (req: Request, _res: Response, next: NextFunction) {
		if (!req.user) {
			return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
		}
		const userRole = (req.user.role || '').toString().toLowerCase();
		if (userRole !== role.toLowerCase()) {
			return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
		}
		return next();
	};
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: AuthPayload;
	}
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
	// No dev bypass; require a real token

	// Allow token via Authorization header or cookie (bopi_token)
	const authHeader = req.headers.authorization;
	let token: string | undefined;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		token = authHeader.split(' ')[1];
	} else if (req.headers && typeof req.headers.cookie === 'string') {
		// parse simple cookie string
		const cookies = req.headers.cookie.split(';').map((c) => c.trim());
		for (const c of cookies) {
			if (c.startsWith('bopi_token=')) {
				token = c.substring('bopi_token='.length);
				break;
			}
		}
	}

	if (!token) {
		return next(
			new ApiError(httpStatus.UNAUTHORIZED, 'Missing or invalid authentication token'),
		);
	}
	// Check blacklist first
	if (TokenBlacklist.has(token)) {
		return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token has been revoked'));
	}
	const secret = config.jwtSecret as string;
	if (!secret) return next(new Error('JWT_SECRET not configured in config'));

	try {
		const payload = jwt.verify(token, secret) as AuthPayload;
		req.user = payload;
		return next();
	} catch (err) {
		return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
	}
}
