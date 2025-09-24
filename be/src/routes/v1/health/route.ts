import { Router, Response } from 'express';

const router = Router();

router.get('/health', (_req, res: Response) => {
	res.status(200).json({
		status: 'ok',
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

export default router;
