'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// If already logged in, redirect appropriately
	useEffect(() => {
		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
		fetch(`${apiBase}/v1/auth/me`, { credentials: 'include' })
			.then(async (res) => {
				if (!res.ok) return;
				const payload = await res.json();
				const user = payload?.data || payload;
				const role = (user?.role || 'user').toLowerCase();
				if (role === 'admin') router.replace('/admin/dashboard');
				else router.replace('/');
			})
			.catch(() => {
				// ignore - not logged in
			});
	}, [router]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// simple client-side validation
		if (password.length < 6) {
			setError('Password harus minimal 6 karakter');
			setIsLoading(false);
			return;
		}

		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
		fetch(`${apiBase}/v1/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ email, password }),
		})
			.then(async (res) => {
				const payload = await res.json();
				if (!res.ok) {
					const msg = payload?.message || 'Login failed';
					// If user not found or invalid credentials, try register and then login
					if (
						res.status === 401 ||
						msg.toLowerCase().includes('invalid') ||
						msg.toLowerCase().includes('not found')
					) {
						// attempt register then login
						const regRes = await fetch(`${apiBase}/v1/auth/register`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							credentials: 'include',
							body: JSON.stringify({ name: email.split('@')[0], email, password }),
						});
						if (regRes.ok) {
							// try login again
							return fetch(`${apiBase}/v1/auth/login`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								credentials: 'include',
								body: JSON.stringify({ email, password }),
							});
						}
					}
					throw new Error(msg);
				}

				// The server sets an HttpOnly cookie with token. Fetch current user from /v1/auth/me
				const meRes = await fetch(`${apiBase}/v1/auth/me`, {
					method: 'GET',
					credentials: 'include',
				});
				if (meRes.ok) {
					const meJson = await meRes.json();
					const user = meJson?.data || meJson;
					// redirect based on role
					const role = (user?.role || 'user').toLowerCase();
					if (role === 'admin') {
						router.push('/admin/dashboard');
					} else {
						router.push('/');
					}
				} else {
					setError('Unable to retrieve user after login');
				}
			})
			.catch((err: Error) => {
				setError(err.message || 'Email atau password salah.');
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
				<h1 className="text-3xl font-bold text-center text-gray-800">BOPI Login</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="email" className="text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
						/>
					</div>
					<div>
						<label htmlFor="password" className="text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
						/>
					</div>
					{error && <p className="text-sm text-red-600">{error}</p>}
					<div>
						<button
							type="submit"
							disabled={isLoading}
							aria-busy={isLoading}
							className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none disabled:bg-gray-400"
						>
							{isLoading ? 'Loading...' : 'Login'}
						</button>
					</div>
				</form>
				<div className="text-center mt-2">
					<p>
						Belum punya akun?{' '}
						<Link href="/auth/register" className="text-orange-500 underline">
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
