import { Router } from 'express';
import { getDBHealth } from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  const dbHealth = getDBHealth();
  const isHealthy = dbHealth.status === 'connected';

  const payload = {
    status: isHealthy ? 'ok' : 'degraded',
    service: 'Offline Field Issue Tracker API',
    timestamp: new Date().toISOString(),
    database: dbHealth,
  };

  const statusCode = isHealthy ? 200 : 503;
  return res.status(statusCode).json(payload);
});

export const healthRoutes = router;

