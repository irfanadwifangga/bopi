import Link from 'next/link';
import React from 'react';

export default function Navbar() {
	return (
		<header className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white sticky top-0 z-50 shadow">
			<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h1 className="text-2xl font-bold">BOPI</h1>
					<span className="text-sm opacity-90">Premium Food Store</span>
				</div>

				<nav>
					<ul className="flex gap-6 items-center">
						<li>
							<Link href="#home" className="hover:opacity-90">
								Home
							</Link>
						</li>
						<li>
							<Link href="#products" className="hover:opacity-90">
								Products
							</Link>
						</li>
						<li>
							<Link href="#about" className="hover:opacity-90">
								About
							</Link>
						</li>
						<li>
							<Link href="#contact" className="hover:opacity-90">
								Contact
							</Link>
						</li>
						<li>
							<Link
								href="/auth/login"
								className="bg-white text-orange-500 px-3 py-1 rounded font-semibold"
							>
								Login
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}
