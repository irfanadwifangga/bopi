import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { PasswordUtils } from '../src/utils/Password';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function seed() {
	try {
		console.log('Seeding users (faker)...');

		const total = 50;

		for (let i = 0; i < total; i++) {
			const firstName = faker.person.firstName();
			const lastName = faker.person.lastName();
			const name = `${firstName} ${lastName}`;

			// create deterministic but realistic email
			const local = `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z0-9\.]/g, '');
			const uniqueEmail = `${local}${i}@example.com`;

			const plainPassword = `Password@${1000 + i}`; // deterministic for dev
			const hashed = await PasswordUtils.hash(plainPassword);

			const role: Role = i < 2 ? Role.ADMIN : Role.CUSTOMER; // first 2 admins

			await prisma.user.upsert({
				where: { email: uniqueEmail },
				update: {
					name,
					password: hashed,
					role,
				},
				create: {
					name,
					email: uniqueEmail,
					password: hashed,
					role,
				},
			});

			if ((i + 1) % 10 === 0) {
				console.log(`Created ${i + 1}/${total} users`);
			}
		}

		console.log('Seeding finished');
	} catch (err) {
		console.error('Seeding failed:', err);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

seed();
