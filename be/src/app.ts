import express, { Application, Response } from 'express';
import config from '@/config/config';
import helmet from 'helmet';
import { successHandler, errorHandler } from '@/config/morgan';
import ApiError from '@/utils/ApiError';
import httpStatus from 'http-status';

const app: Application = express();

if (config.env !== 'test') {
	app.use(successHandler);
	app.use(errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
// app.use(cors());
// app.options('*', cors());

// routes
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

export default app;
