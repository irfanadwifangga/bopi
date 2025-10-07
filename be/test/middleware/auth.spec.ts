import { describe, it, expect, vi } from 'vitest';
import { requireAuth } from '../../src/middleware/auth';
import config from '../../src/config/config';
import * as jwt from 'jsonwebtoken';

function mockReq(headers: Record<string, string | undefined>) {
	return { headers } as any;
}
function mockRes() {
	return {} as any;
}

describe('requireAuth middleware', () => {
	it('attaches user and calls next for valid token', () => {
		const payload = { id: 'u1', email: 'a@b.com' };
		const token = jwt.sign(payload as any, config.jwtSecret as any, { expiresIn: '1h' } as any);

		const req: any = mockReq({ authorization: `Bearer ${token}` });
		const res = mockRes();
		const next = vi.fn();

		requireAuth(req, res, next as any);

		expect(next).toHaveBeenCalledTimes(1);
		expect(req.user).toBeDefined();
		expect(req.user.id).toBe('u1');
	});

	it('calls next with error when no header', () => {
		const req: any = mockReq({});
		const res = mockRes();
		const next = vi.fn();

		requireAuth(req, res, next as any);

		expect(next).toHaveBeenCalled();
		const err = next.mock.calls[0][0];
		expect(err).toBeInstanceOf(Error);
	});
});
