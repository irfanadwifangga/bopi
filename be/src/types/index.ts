// Common response types
export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

export interface HealthCheckResponse {
	status: string;
	uptime: number;
	timestamp: string;
}

// Request/Response interfaces
export interface ErrorResponse {
	error: string;
	path?: string;
	timestamp?: string;
}

// Environment variables
export interface EnvConfig {
	PORT: string;
	NODE_ENV: 'development' | 'production' | 'test';
}
