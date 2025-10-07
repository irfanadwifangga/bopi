import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../src/modules/services/auth.service';
import { UserRepository } from '../../src/modules/repositories/user.repository';
import { PasswordUtils } from '../../src/utils/Password';
import { ApiError } from '../../src/utils/ApiResponse';

// Create a fake UserRepository implementation for tests
class FakeUserRepository implements Partial<UserRepository> {
	users: any[] = [];
	async findByEmail(email: string) {
		return this.users.find((u) => u.email === email) || null;
	}
	async createUser(data: any) {
		const newUser = { id: `u${this.users.length + 1}`, ...data };
		this.users.push(newUser);
		return newUser;
	}
}

vi.mock('../../src/utils/Password', () => ({
	PasswordUtils: {
		validate: (p: string) => ({ isValid: true, errors: [] }),
		hash: async (p: string) => `hashed_${p}`,
		compare: async (p: string, hash: string) => hash === `hashed_${p}`,
	},
}));

let repo: any;
let service: AuthService;

beforeEach(() => {
	repo = new FakeUserRepository();
	service = new AuthService(repo as any);
});

describe('AuthService', () => {
	it('registers a new user', async () => {
		const result = await service.register({
			name: 'A',
			email: 'a@b.com',
			password: 'pass',
		} as any);
		expect(result).toBeDefined();
		expect(result.email).toBe('a@b.com');
		// password should not be returned
		expect(result.password).toBeUndefined();
	});

	it('throws on duplicate email', async () => {
		await service.register({ name: 'A', email: 'a@b.com', password: 'pass' } as any);
		await expect(
			service.register({ name: 'B', email: 'a@b.com', password: 'pass' } as any),
		).rejects.toBeInstanceOf(ApiError);
	});

	it('logins successfully and returns token', async () => {
		// create user directly in fake repo
		const created = await repo.createUser({
			name: 'A',
			email: 'a@b.com',
			password: 'hashed_pass',
		});
		const res = await service.login({ email: 'a@b.com', password: 'pass' } as any);
		expect(res).toHaveProperty('token');
		expect(res.user.email).toBe('a@b.com');
	});

	it('throws on invalid login', async () => {
		await expect(
			service.login({ email: 'no@one.com', password: 'x' } as any),
		).rejects.toBeInstanceOf(ApiError);
	});
});
