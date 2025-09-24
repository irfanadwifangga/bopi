import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import logger from '@/config/logger';

const basePrisma = new PrismaClient({
	log: [
		{
			emit: 'event',
			level: 'query',
		},
		{
			emit: 'event',
			level: 'info',
		},
		{
			emit: 'event',
			level: 'warn',
		},
		{
			emit: 'event',
			level: 'error',
		},
	],
});

if (process.env.NODE_ENV !== 'production') {
	basePrisma
		.$connect()
		.then(() => {
			logger.info('Connected to the database');
		})
		.catch((error) => {
			logger.error('Database connection error:', { message: error.message });
		});

	basePrisma.$on('query', (e) => {
		logger.debug('Prisma query:', {
			query: e.query,
			params: e.params,
			duration: `${e.duration}ms`,
		});
	});

	basePrisma.$on('error', (e) => {
		logger.error('Prisma error:', {
			message: e.message,
			target: e.target,
		});
	});

	basePrisma.$on('info', (e) => {
		logger.info('Prisma info:', { message: e.message });
	});

	basePrisma.$on('warn', (e) => {
		logger.warn('Prisma warning:', { message: e.message });
	});
}

const prisma = basePrisma.$extends(withAccelerate());

export default prisma;
