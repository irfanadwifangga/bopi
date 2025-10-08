import React from 'react';

export default function AboutSection() {
	return (
		<section id="about" className="py-20 bg-gradient-to-br from-white to-gray-50">
			<div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
				<div>
					<h2 className="text-3xl font-bold mb-4">Tentang BOPI</h2>
					<div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-orange-400">
						<p className="text-gray-700 mb-4">
							BOPI (Bawang Bombay Krispi) adalah brand camilan premium yang
							menghadirkan kelezatan autentik bawang bombay dalam bentuk yang renyah
							dan menggugah selera.
						</p>
						<p className="text-gray-700">
							Setiap produk BOPI dibuat dengan teliti melalui proses yg higienis dan
							bahan berkualitas untuk menghasilkan tekstur krispi dan rasa gurih khas.
						</p>
					</div>

					<div className="mt-6 grid gap-4">
						<div className="p-4 bg-white rounded-lg shadow">Kualitas Tinggi</div>
						<div className="p-4 bg-white rounded-lg shadow">Resep Rahasia</div>
						<div className="p-4 bg-white rounded-lg shadow">Rasa Konsisten</div>
					</div>
				</div>

				<div className="relative">
					<div className="rounded-2xl overflow-hidden shadow-2xl">
						<img
							src="/images/products/about-product.jpg"
							alt="BOPI Kitchen"
							className="w-full h-[450px] object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
