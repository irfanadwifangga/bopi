import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '../../src/modules/services/auth.service';
import { UserRepository } from '../../src/modules/repositories/user.repository';
import { UserService } from '../../src/modules/services/user.service';
import { PasswordUtils } from '../../src/utils/Password';
import * as jwt from 'jsonwebtoken';
import config from '../../src/config/config';
import { TokenBlacklist } from '../../src/utils/TokenBlacklist';
import { requireAuth } from '../../src/middleware/auth';

// Minimal fake repository
class FakeUserRepo implements Partial<UserRepository> {
	users: any[] = [];
	async findByEmail(email: string) {
		return this.users.find((u) => u.email === email) || null;
	}
	async createUser(data: any) {
		const u = { id: `u${this.users.length + 1}`, ...data };
		this.users.push(u);
		return u;
	}
}

vi.mock('../../src/utils/Password', () => ({
	PasswordUtils: {
		validate: (p: string) => ({ isValid: true, errors: [] }),
		hash: async (p: string) => `hashed_${p}`,
		compare: async (p: string, hash: string) => hash === `hashed_${p}`,
	},
}));

describe('logout and blacklist', () => {
	it('revokes token and middleware rejects it', async () => {
		const repo = new FakeUserRepo() as any;
		const authService = new AuthService(repo);

		// create user
		const created = await repo.createUser({
			name: 'A',
			email: 'a@b.com',
			password: 'hashed_x',
		});

		// create token manually
		const token = jwt.sign(
			{ id: created.id, email: created.email },
			config.jwtSecret as any,
			{ expiresIn: '1h' } as any,
		);

		// ensure not blacklisted
		expect(TokenBlacklist.has(token)).toBe(false);

		// logout -> add to blacklist
		await authService.logout(token);
		expect(TokenBlacklist.has(token)).toBe(true);

		// now simulate middleware
		const req: any = { headers: { authorization: `Bearer ${token}` } };
		const res: any = {};
		const next = vi.fn();

		requireAuth(req, res, next as any);

		expect(next).toHaveBeenCalled();
		const err = next.mock.calls[0][0];
		expect(err).toBeTruthy();
		expect(err.message).toMatch(/revoked/);
	});
});
