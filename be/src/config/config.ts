import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envVarSchema = Joi.object()
	.keys({
		PORT: Joi.number().default(2000),
		NODE_ENV: Joi.string()
			.valid('development', 'production', 'test')
			.default('development')
			.required(),
		DATABASE_URL: Joi.string().uri().required().description('Neon Postgre DB URL'),
		CORS_ORIGIN: Joi.string()
			.default('http://localhost:3000')
			.description('CORS allowed origins'),
		RATE_LIMIT_WINDOW: Joi.number().default(15).description('Rate limit window in minutes'),
		RATE_LIMIT_MAX: Joi.number().default(100).description('Max requests per window'),
		JWT_SECRET: Joi.string().required().description('JWT secret for signing tokens'),
		JWT_EXPIRES_IN: Joi.string().default('7d').description('JWT token TTL'),

		COOKIE_SAMESITE: Joi.string()
			.valid('lax', 'strict', 'none')
			.default('lax')
			.description('Cookie SameSite value'),
		COOKIE_SECURE: Joi.boolean().default(true).description('Whether to mark cookie as secure'),
	})
	.unknown(true);

const { value: envVars, error } = envVarSchema
	.prefs({ errors: { label: 'key' } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

export = {
	port: envVars.PORT,
	env: envVars.NODE_ENV,
	db: envVars.DATABASE_URL,
	corsOrigin: envVars.CORS_ORIGIN.split(',').map((origin: string) => origin.trim()),
	rateLimit: {
		windowMs: envVars.RATE_LIMIT_WINDOW * 60 * 1000,
		max: envVars.RATE_LIMIT_MAX,
	},
	jwtSecret: envVars.JWT_SECRET,
	jwtExpiresIn: envVars.JWT_EXPIRES_IN,
	cookie: {
		sameSite: envVars.COOKIE_SAMESITE,
		secure: envVars.COOKIE_SECURE,
	},
};
