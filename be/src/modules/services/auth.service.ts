import { UserRepository } from '@/modules/repositories/user.repository';
import { ApiError } from '@/utils/ApiResponse';
import { PasswordUtils } from '@/utils/Password';
import { RegisterDto, LoginDto } from '@/modules/dtos/auth.dto';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import config from '@/config/config';
import { TokenBlacklist } from '@/utils/TokenBlacklist';

export class AuthService {
	constructor(private userRepository: UserRepository) {}

	async register(data: RegisterDto) {
		const existing = await this.userRepository.findByEmail(data.email);
		if (existing) {
			throw new ApiError(httpStatus.CONFLICT, 'Email already in use');
		}

		const passwordValidation = PasswordUtils.validate(data.password);
		if (!passwordValidation.isValid) {
			throw new ApiError(httpStatus.BAD_REQUEST, passwordValidation.errors.join(', '));
		}

		const hashed = await PasswordUtils.hash(data.password);
		const created = await this.userRepository.createUser({
			name: data.name,
			email: data.email,
			password: hashed,
			role: data.role,
		} as any);

		const { password, ...safe } = created as any;
		return safe;
	}

	async login(data: LoginDto) {
		const user = await this.userRepository.findByEmail(data.email);
		if (!user) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
		}

		const matched = await PasswordUtils.compare(data.password, user.password);
		if (!matched) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
		}

		const jwtSecret = config.jwtSecret as string;
		const expiresIn = config.jwtExpiresIn as string;

		if (!jwtSecret) {
			throw new Error('JWT_SECRET not configured in config');
		}

		const payload = { id: user.id, email: user.email, role: user.role } as Record<
			string,
			unknown
		>;
		const token = jwt.sign(payload, jwtSecret as jwt.Secret, { expiresIn } as jwt.SignOptions);

		const { password, ...safe } = user as any;
		return { user: safe, token };
	}

	async logout(token: string) {
		// compute TTL from config.jwtExpiresIn (supports simple values like '7d', '1h', '30m')
		const val = (config.jwtExpiresIn as string) || '7d';
		const ttlMs = this.parseTtlToMs(val);
		TokenBlacklist.add(token, ttlMs);
		return true;
	}

	private parseTtlToMs(ttl: string) {
		// very small parser for common suffixes
		const n = parseInt(ttl, 10);
		if (ttl.endsWith('d')) return n * 24 * 60 * 60 * 1000;
		if (ttl.endsWith('h')) return n * 60 * 60 * 1000;
		if (ttl.endsWith('m')) return n * 60 * 1000;
		if (ttl.endsWith('s')) return n * 1000;
		// plain number in seconds
		if (!isNaN(n)) return n * 1000;
		return 7 * 24 * 60 * 60 * 1000; // fallback 7 days
	}
}
