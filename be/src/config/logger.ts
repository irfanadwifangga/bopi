import winston from 'winston';
import config from '@/config/config';
import Table from 'cli-table3';

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
		// Development: human readable table-like rows
		config.env === 'development'
			? winston.format.combine(
					// colorize level only
					winston.format.colorize({ all: false, level: true, message: false }),
					winston.format.printf((info) => {
						const ts = (info.timestamp || '').toString();
						const level = (info.level || '').toString();
						const msg = info.message || '';
						const splat = info[Symbol.for('splat')] as any[] | undefined;
						const meta =
							splat && splat.length
								? splat
										.map((s) =>
											typeof s === 'object' ? JSON.stringify(s) : String(s),
										)
										.join(' ')
								: '';

						const table = new Table({
							colWidths: [20, 9, 60, 40],
							wordWrap: true,
							style: { head: [], border: [] },
							chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
						});

						table.push([ts, level, msg, meta] as any[]);

						// cli-table3 outputs the table with borders; remove top/bottom borders for a single-line row
						const out = table.toString().split('\n').slice(1, -1).join('\n');
						return out;
					}),
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
