import React from 'react';

export default function Footer() {
	return (
		<footer className="w-full bg-gray-900 text-gray-100 mt-12">
			<div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
				<div>
					<h3 className="text-xl font-bold text-orange-400">BOPI</h3>
					<p className="mt-2 text-sm text-gray-300">
						Menyajikan kelezatan autentik dengan kualitas premium untuk kepuasan
						pelanggan terbaik.
					</p>
				</div>

				<div>
					<h4 className="text-lg font-semibold text-orange-400">Kontak</h4>
					<p className="text-sm mt-2">+62 812-3456-7890</p>
					<p className="text-sm">info@bopi.com</p>
					<p className="text-sm">Jl. Kuliner No. 123, Jakarta</p>
				</div>

				<div>
					<h4 className="text-lg font-semibold text-orange-400">Jam Operasional</h4>
					<p className="text-sm mt-2">Senin - Jumat: 09:00 - 22:00</p>
					<p className="text-sm">Sabtu - Minggu: 08:00 - 23:00</p>
				</div>
			</div>

			<div className="border-t border-gray-800">
				<div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-400">
					© 2025 BOPI Premium Food Store. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
