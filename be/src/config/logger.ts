import winston from 'winston';
import config from '@/config/config';

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'blue',
};

winston.addColors(colors);

const logger = winston.createLogger({
	level: config.env === 'development' ? 'debug' : 'info',
	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.splat(),
		config.env === 'development'
			? winston.format.colorize({ all: true })
			: winston.format.uncolorize(),
		config.env === 'development'
			? winston.format.printf(
					(info) =>
						`${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''} ${Object.keys(info.metadata || {}).length ? JSON.stringify(info.metadata) : ''}`,
				)
			: winston.format.json(),
	),
	transports: [
		new winston.transports.Console({
			stderrLevels: ['error'],
		}),
	],
});

export default logger;
