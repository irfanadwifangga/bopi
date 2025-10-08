import React from 'react';

export default function ContactCTA() {
	return (
		<section className="max-w-7xl mx-auto px-6 py-12">
			<div className="bg-white rounded-2xl shadow p-8 text-center">
				<h3 className="text-2xl font-bold mb-2">Butuh Bantuan?</h3>
				<p className="text-gray-600 mb-6">
					Tim customer service kami siap membantu Anda dengan pelayanan terbaik
				</p>
				<div className="flex gap-4 justify-center flex-wrap">
					<a
						href="https://wa.me/6281234567890"
						className="px-6 py-3 rounded-full bg-green-500 text-white"
					>
						WhatsApp
					</a>
					<a
						href="tel:+6281234567890"
						className="px-6 py-3 rounded-full bg-blue-600 text-white"
					>
						Telepon
					</a>
					<a
						href="mailto:info@bopi.com"
						className="px-6 py-3 rounded-full bg-red-600 text-white"
					>
						Email
					</a>
				</div>
			</div>
		</section>
	);
}
