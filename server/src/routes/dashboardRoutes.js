import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', optionalAuth, dashboardController.getStats);
router.get('/activities', optionalAuth, dashboardController.getRecentActivities);

export const dashboardRoutes = router;

