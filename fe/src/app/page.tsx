'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
	const [status, setStatus] = useState<number | null>(null);
	const [headersObj, setHeadersObj] = useState<Record<string, string>>({});
	const [body, setBody] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refresh = () => {
		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
		setLoading(true);
		setError(null);
		fetch(`${apiBase}/v1/auth/me`, { credentials: 'include' })
			.then(async (res) => {
				setStatus(res.status);
				const h: Record<string, string> = {};
				res.headers.forEach((value, key) => (h[key] = value));
				setHeadersObj(h);
				try {
					const json = await res.json();
					setBody(json?.data ?? json);
				} catch (e) {
					setBody(null);
				}
			})
			.catch((err) => setError(String(err)))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		refresh();
	}, []);

	const handleLogout = async () => {
		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
		try {
			await fetch(`${apiBase}/v1/auth/logout`, { method: 'POST', credentials: 'include' });
		} catch (e) {
			// ignore
		}
		// refresh inspector state
		refresh();
	};

	useEffect(() => {
		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
		setLoading(true);
		fetch(`${apiBase}/v1/auth/me`, { credentials: 'include' })
			.then(async (res) => {
				setStatus(res.status);
				const h: Record<string, string> = {};
				res.headers.forEach((value, key) => (h[key] = value));
				setHeadersObj(h);
				try {
					const json = await res.json();
					setBody(json?.data ?? json);
				} catch (e) {
					setBody(null);
				}
			})
			.catch((err) => setError(String(err)))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="min-h-screen p-8">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold">BOPI — Auth inspector</h1>
				<nav className="space-x-4">
					<Link href="/auth/login" className="text-orange-500 underline">
						Login
					</Link>
					<Link href="/auth/register" className="text-gray-600 underline">
						Register
					</Link>
				</nav>
			</header>

			<main>
				<section className="mb-6">
					<h2 className="text-lg font-semibold">HTTP /v1/auth/me</h2>
					{loading ? (
						<p>Checking authentication...</p>
					) : error ? (
						<pre className="bg-red-50 p-4 rounded">{error}</pre>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 mt-4">
							<div className="p-4 bg-white rounded shadow">
								<h3 className="font-medium">Status</h3>
								<pre className="mt-2">{String(status)}</pre>
							</div>
							<div className="p-4 bg-white rounded shadow">
								<h3 className="font-medium">Response Headers</h3>
								<pre className="mt-2 text-sm">
									{JSON.stringify(headersObj, null, 2)}
								</pre>
							</div>
							<div className="p-4 bg-white rounded shadow sm:col-span-2">
								<h3 className="font-medium">Body (parsed)</h3>
								<pre className="mt-2 text-sm">{JSON.stringify(body, null, 2)}</pre>
							</div>
						</div>
					)}
				</section>

				<section className="mt-8">
					<h2 className="text-lg font-semibold">Actions</h2>
					<div className="mt-4 flex gap-4">
						{body ? (
							// when logged in, show role-aware navigation
							<>
								<Link
									href={
										((body?.role || '') as string).toLowerCase() === 'admin'
											? '/admin/dashboard'
											: '/'
									}
									className="px-4 py-2 bg-orange-500 text-white rounded"
								>
									Go to app
								</Link>
								<button
									onClick={handleLogout}
									className="px-4 py-2 bg-gray-200 rounded"
								>
									Logout (server)
								</button>
							</>
						) : (
							<Link
								href="/auth/login"
								className="px-4 py-2 bg-orange-500 text-white rounded"
							>
								Go to login
							</Link>
						)}
					</div>
				</section>
			</main>

			<footer className="mt-12 text-sm text-gray-500">
				Auth inspector — shows raw response from the API.
			</footer>
		</div>
	);
}
