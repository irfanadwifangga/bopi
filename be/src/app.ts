import express, { Application, Response } from 'express';
import config from '@/config/config';
import helmet from 'helmet';
import { successHandler, errorHandler } from '@/config/morgan';
import rateLimit from 'express-rate-limit';
import { ApiError } from '@/utils/ApiResponse';
import httpStatus from 'http-status';
import cors from 'cors';
import { globalErrorHandler } from '@/middleware/errorHandler';
import routes from '@/routes/v1';

const app: Application = express();

// Rate limiting
const limiter = rateLimit({
	windowMs: config.rateLimit.windowMs,
	max: config.rateLimit.max,
	message: {
		error: 'Too many requests from this IP, please try again later.',
	},
});

if (config.env !== 'test') {
	app.use(successHandler);
	app.use(errorHandler);
}

// Apply rate limiting to all requests
app.use(limiter);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: config.corsOrigin,
		credentials: true,
	}),
);

// API routes
app.use('/v1', routes);

// check if the server is running
app.get('/', (_req, res: Response) => {
	res.json({
		message: 'BOPI API is running',
		timestamp: new Date().toISOString(),
	});
});

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// global error handler
app.use(globalErrorHandler);

export default app;
