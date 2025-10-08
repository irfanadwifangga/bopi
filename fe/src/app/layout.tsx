import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
	weight: ['400'],
	display: 'swap',
	variable: '--font-inter',
	subsets: ['latin'],
});

const spaceMono = Space_Mono({
	weight: ['400'],
	display: 'swap',
	variable: '--font-space-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'BOPI Store',
	description: 'BOPI Store - Bawang Bombay Krispi',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${spaceMono.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
