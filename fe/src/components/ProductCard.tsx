import React from 'react';

type Props = {
	id: number | string;
	name: string;
	price: number;
	description?: string;
	image?: string;
};

export default function ProductCard({ id, name, price, description, image }: Props) {
	return (
		<div className="product-card bg-white rounded-lg shadow-lg overflow-hidden">
			<div className="h-56 bg-gray-100 overflow-hidden">
				<img
					src={image ?? `/images/products/product-1.jpg`}
					alt={name}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="p-4">
				<h4 className="font-semibold text-lg">{name}</h4>
				<p className="text-sm text-gray-500 mt-2">{description}</p>
				<div className="mt-4 flex items-center justify-between">
					<div className="text-orange-500 font-bold">
						Rp {price.toLocaleString('id-ID')}
					</div>
					<button className="px-3 py-1 bg-orange-500 text-white rounded">Tambah</button>
				</div>
			</div>
		</div>
	);
}
