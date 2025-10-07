// Simple in-memory token blacklist with expiry. For production use Redis or similar.

type Entry = {
	expiresAt: number;
};

const store = new Map<string, Entry>();

// Cleanup interval (ms)
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
setInterval(() => {
	const now = Date.now();
	for (const [token, entry] of store.entries()) {
		if (entry.expiresAt <= now) store.delete(token);
	}
}, CLEANUP_INTERVAL).unref?.();

export const TokenBlacklist = {
	add(token: string, ttlMs: number) {
		const expiresAt = Date.now() + ttlMs;
		store.set(token, { expiresAt });
	},
	has(token: string) {
		const entry = store.get(token);
		if (!entry) return false;
		if (entry.expiresAt <= Date.now()) {
			store.delete(token);
			return false;
		}
		return true;
	},
};
