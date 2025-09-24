import app from '@/app';
import config from '@/config/config';
import logger from '@/config/logger';
import prisma from '@/config/prisma';
import { Server } from 'http';

let server: Server;
prisma.$connect().then(() => {
	logger.info('Connected to database');

	server = app.listen(config.port, () => {
		logger.info(`Listening to port ${config.port}`);
	});
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: Error) => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Handle SIGTERM signal
process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(0);
		});
	} else {
		process.exit(0);
	}
});

// Handle SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
	logger.info('SIGINT received');
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(0);
		});
	} else {
		process.exit(0);
	}
});
