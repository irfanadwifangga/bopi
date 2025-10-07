'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	// usePathname() can return null on the server or during hydration – default to empty string
	const rawPathname = usePathname();
	const pathname = rawPathname ?? '';
	const router = useRouter();
	const [isClient, setIsClient] = useState(false);
	const [user, setUser] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	// Efek ini memastikan kode localStorage hanya berjalan di client-side
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Efek untuk proteksi halaman: fetch current user from backend
	useEffect(() => {
		if (!isClient) return;
		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
		setLoading(true);
		fetch(`${apiBase}/v1/auth/me`, { credentials: 'include' })
			.then(async (res) => {
				if (!res.ok) {
					// not authenticated: redirect to central login (avoid redirect loop when already on login)
					if (pathname !== '/auth/login') router.push('/auth/login');
					setUser(null);
					return;
				}
				const payload = await res.json();
				const u = payload?.data || payload;
				setUser(u);
			})
			.catch(() => {
				if (pathname !== '/auth/login') router.push('/auth/login');
				setUser(null);
			})
			.finally(() => setLoading(false));
	}, [pathname, router, isClient]);

	// Jangan tampilkan layout sidebar di halaman login (login now at /auth/login)
	if (pathname === '/auth/login') {
		return <>{children}</>;
	}

	// while checking auth state, show a loading placeholder to avoid flashes
	if (isClient && loading) {
		return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
	}

	const handleLogout = () => {
		const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';
		fetch(`${apiBase}/v1/auth/logout`, { method: 'POST', credentials: 'include' })
			.catch(() => {})
			.finally(() => {
				// best-effort clear client cookies (HttpOnly cookies will be cleared by server response if implemented)
				try {
					document.cookie = 'bopi_token=; Max-Age=0; path=/;';
				} catch (e) {}
				router.push('/auth/login');
			});
	};

	return (
		<div className="flex min-h-screen">
			<aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
				<h2 className="text-2xl font-bold mb-8">BOPI CMS</h2>
				<nav className="flex-1">
					<ul>
						<li>
							<Link
								href="/admin/dashboard"
								className={`block py-2 px-4 rounded ${pathname === '/admin/dashboard' ? 'bg-orange-600' : 'hover:bg-gray-700'}`}
							>
								Dashboard
							</Link>
						</li>
						<li>
							<Link
								href="/admin/products"
								className={`block py-2 px-4 rounded ${pathname.startsWith('/admin/products') ? 'bg-orange-600' : 'hover:bg-gray-700'}`}
							>
								Products
							</Link>
						</li>
						<li>
							<Link
								href="/admin/transaksi"
								className={`block py-2 px-4 rounded ${pathname === '/admin/transaksi' ? 'bg-orange-600' : 'hover:bg-gray-700'}`}
							>
								Transaksi
							</Link>
						</li>
					</ul>
				</nav>
				<div>
					<button
						onClick={handleLogout}
						className="w-full text-left py-2 px-4 rounded bg-red-600 hover:bg-red-700"
					>
						Logout
					</button>
				</div>
			</aside>
			<main className="flex-1 p-8 bg-gray-100 overflow-y-auto">{children}</main>
		</div>
	);
}
