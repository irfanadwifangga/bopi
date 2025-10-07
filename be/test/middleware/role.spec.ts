import { describe, it, expect, vi } from 'vitest';
import { requireRole } from '../../src/middleware/auth';
import { ApiError } from '../../src/utils/ApiResponse';

describe('requireRole middleware', () => {
	it('blocks non-admin users', () => {
		const mw = requireRole('admin');
		const req: any = { user: { id: 'u1', role: 'user' } };
		const next = vi.fn();

		mw(req, {} as any, next as any);

		expect(next).toHaveBeenCalled();
		const err = next.mock.calls[0][0];
		expect(err).toBeInstanceOf(ApiError);
		expect(err.statusCode).toBe(403);
	});

	it('allows admin users', () => {
		const mw = requireRole('admin');
		const req: any = { user: { id: 'u1', role: 'admin' } };
		const next = vi.fn();

		mw(req, {} as any, next as any);

		expect(next).toHaveBeenCalledWith();
	});
});
