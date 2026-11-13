import { Router } from 'express';
import * as syncController from '../controllers/syncController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { batchSyncSchema } from '../validators/syncValidators.js';

const router = Router();

// Primary batch synchronization endpoint
router.post('/', optionalAuth, validateRequest({ body: batchSyncSchema }), syncController.syncReports);
router.post('/batch', optionalAuth, validateRequest({ body: batchSyncSchema }), syncController.syncReports);

export const syncRoutes = router;

