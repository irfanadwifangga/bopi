import morgan from 'morgan';
import config from '@/config/config';
import logger from '@/config/logger';
import { Response } from 'express';

morgan.token('message', (_req, res: Response) => res.locals.errorMessage || '');

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
	skip: (_req, res) => res.statusCode >= 400,
	stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
	skip: (_req, res) => res.statusCode < 400,
	stream: { write: (message) => logger.error(message.trim()) },
});

export { successHandler, errorHandler };
