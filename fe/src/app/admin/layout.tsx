"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Efek ini memastikan kode localStorage hanya berjalan di client-side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Efek untuk proteksi halaman
  useEffect(() => {
    if (isClient) {
        const isAuthenticated = localStorage.getItem('bopi-auth');
        if (!isAuthenticated && pathname !== '/admin/login') {
          router.push('/admin/login');
        }
    }
  }, [pathname, router, isClient]);

  // Jangan tampilkan layout sidebar di halaman login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem('bopi-auth');
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">BOPI CMS</h2>
        <nav className="flex-1">
          <ul>
            <li>
              <Link href="/admin/dashboard" className={`block py-2 px-4 rounded ${pathname === '/admin/dashboard' ? 'bg-orange-600' : 'hover:bg-gray-700'}`}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className={`block py-2 px-4 rounded ${pathname.startsWith('/admin/products') ? 'bg-orange-600' : 'hover:bg-gray-700'}`}>
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/transaksi" className={`block py-2 px-4 rounded ${pathname === '/admin/transaksi' ? 'bg-orange-600' : 'hover:bg-gray-700'}`}>
                Transaksi
              </Link>
            </li>
          </ul>
        </nav>
        <div>
            <button 
                onClick={handleLogout}
                className="w-full text-left py-2 px-4 rounded bg-red-600 hover:bg-red-700">
                Logout
            </button>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}