'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
	const [user, setUser] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		// Fetch current user from backend using credentials (cookie)
		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
		fetch(`${apiBase}/v1/auth/me`, { credentials: 'include' })
			.then(async (res) => {
				if (!res.ok) {
					router.push('/auth/login');
					return;
				}
				const payload = await res.json();
				const user = payload?.data || payload;
				if ((user?.role || '').toLowerCase() !== 'admin') {
					router.replace('/');
					return;
				}
				setUser(user);
			})
			.catch(() => {
				router.push('/auth/login');
			});
	}, [router]);

	const handleLogout = async () => {
		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
		try {
			await fetch(`${apiBase}/v1/auth/logout`, {
				method: 'POST',
				credentials: 'include',
			});
		} catch (e) {
			// ignore
		}
		// navigate to centralized login
		router.push('/auth/login');
	};

	if (!user) return <div>Loading...</div>;

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">Admin Dashboard</h1>
			<p className="mt-4">Logged in as: {user.email}</p>
			<pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(user, null, 2)}</pre>
			<button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
				Logout
			</button>
		</div>
	);
}
