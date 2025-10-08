import React from 'react';
import ProductCard from './ProductCard';

const sampleProducts = [
	{
		id: 1,
		name: 'BOPI Special Cruncy',
		price: 10000,
		description: 'Camilan premium dengan irisan bawang bombay pilihan',
		image: '/images/products/product-1.jpg',
	},
	{
		id: 2,
		name: 'BOPI Spesial 1',
		price: 65000,
		description: 'BOPI Krispi istimewa',
		image: '/images/products/product-2.jpg',
	},
	{
		id: 3,
		name: 'BOPI Krispi',
		price: 5000,
		description: 'Irisan bawang bombay yang digoreng garing',
		image: '/images/products/product-3.jpg',
	},
];

export default function ProductsSection() {
	return (
		<section id="products" className="py-16 bg-white">
			<div className="max-w-7xl mx-auto px-6">
				<h2 className="text-3xl font-bold mb-8 text-center">Menu Unggulan</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{sampleProducts.map((p) => (
						<ProductCard
							key={p.id}
							id={p.id}
							name={p.name}
							price={p.price}
							description={p.description}
							image={p.image}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
