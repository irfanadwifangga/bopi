import { AuthService } from '@/modules/services/auth.service';
import { Response, Request, NextFunction } from 'express';
import config from '@/config/config';
import { ApiResponse, ApiError } from '@/utils/ApiResponse';
import httpStatus from 'http-status';

export class AuthController {
	constructor(private authService: AuthService) {}

	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const created = await this.authService.register(req.body);
			res.status(201).json(ApiResponse.success(created, 'User registered', 201));
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.authService.login(req.body);
			// set HttpOnly cookie for session (token)
			try {
				if (result?.token) {
					// derive maxAge from JWT_EXPIRES_IN (supports '7d','1h','30m','60s' or seconds)
					const ttl = (config.jwtExpiresIn as string) || '7d';
					const n = parseInt(ttl, 10);
					let maxAge = 7 * 24 * 60 * 60 * 1000; // default 7 days
					if (ttl.endsWith('d')) maxAge = n * 24 * 60 * 60 * 1000;
					else if (ttl.endsWith('h')) maxAge = n * 60 * 60 * 1000;
					else if (ttl.endsWith('m')) maxAge = n * 60 * 1000;
					else if (ttl.endsWith('s')) maxAge = n * 1000;
					else if (!isNaN(n)) maxAge = n * 1000;

					res.cookie('bopi_token', result.token, {
						httpOnly: true,
						secure:
							config.cookie?.secure ??
							(req.secure || req.headers['x-forwarded-proto'] === 'https'),
						maxAge,
						sameSite: (config.cookie?.sameSite as any) || 'lax',
						path: '/',
					});
				}
			} catch (e) {
				// ignore cookie set failures
			}
			res.status(200).json(ApiResponse.success(result, 'Login successful', 200));
		} catch (error) {
			next(error);
		}
	}

	async me(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
			}
			res.status(200).json(ApiResponse.success(req.user, 'Current user', 200));
		} catch (error) {
			next(error);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			// Allow token via Authorization header or cookie
			let token: string | undefined;
			const authHeader = req.headers.authorization;
			if (authHeader && authHeader.startsWith('Bearer ')) {
				token = authHeader.split(' ')[1];
			} else if (req.headers && typeof req.headers.cookie === 'string') {
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
					new ApiError(
						httpStatus.UNAUTHORIZED,
						'Missing or invalid authentication token',
					),
				);
			}
			await this.authService.logout(token);
			// Clear HttpOnly cookie (best-effort). Use clearCookie if available.
			try {
				res.clearCookie?.('bopi_token', {
					path: '/',
					secure: config.cookie?.secure,
					sameSite: config.cookie?.sameSite,
				});
				// fallback: set expired cookie with attributes
				res.header?.(
					'Set-Cookie',
					`bopi_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=${config.cookie?.sameSite};`,
				);
			} catch (e) {
				// ignore
			}
			res.status(200).json(ApiResponse.success(null, 'Logged out', 200));
		} catch (error) {
			next(error);
		}
	}
}
