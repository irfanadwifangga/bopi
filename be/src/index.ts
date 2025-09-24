import app from '@/app';
import config from '@/config/config';
import logger from '@/config/logger';

app.listen(config.port, () => {
	logger.info(`Listening to port ${config.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
	logger.error('Unhandled rejection:', { message: error.message });
	process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
	logger.error('Uncaught exception:', { message: error.message });
	process.exit(1);
});
