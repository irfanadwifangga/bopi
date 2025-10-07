'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
		fetch(`${apiBase}/v1/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ name, email, password }),
		})
			.then(async (res) => {
				const payload = await res.json();
				if (!res.ok) {
					const msg = payload?.message || 'Register failed';
					throw new Error(msg);
				}
				// on success, redirect to login
				router.push('/auth/login');
			})
			.catch((err: Error) => setError(err.message || 'Register failed'))
			.finally(() => setIsLoading(false));
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
				<h1 className="text-3xl font-bold text-center text-gray-800">Register</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="name" className="text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
						/>
					</div>
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
							className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none disabled:bg-gray-400"
						>
							{isLoading ? 'Loading...' : 'Register'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
