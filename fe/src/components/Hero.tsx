import React from 'react';

export default function Hero() {
	return (
		<section
			id="home"
			className="w-full bg-cover bg-center"
			style={{
				backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/images/products/hero.jpg')`,
			}}
		>
			<div className="max-w-7xl mx-auto px-6 py-28 text-center text-white">
				<h2 className="text-4xl md:text-5xl font-bold mb-4">Nikmati Kelezatan Autentik</h2>
				<p className="max-w-2xl mx-auto mb-6 text-lg text-gray-100/90">
					Bawang bombai krispi dengan aroma khas, renyah setiap gigitan, dan cita rasa
					gurih yang bikin ketagihan.
				</p>
				<button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-semibold">
					Pesan Sekarang
				</button>
			</div>
		</section>
	);
}
