import { Router } from "express";
import * as reportController from "../controllers/reportController.js";
import * as workflowController from "../controllers/workflowController.js";
import { optionalAuth, requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  assignReportSchema,
  createReportSchema,
  queryReportsSchema,
  transitionStatusSchema,
  updateReportSchema,
} from "../validators/reportValidators.js";

const router = Router();

// Reports CRUD
router.get(
  "/",
  optionalAuth,
  validateRequest({ query: queryReportsSchema }),
  reportController.getReports,
);
router.post(
  "/",
  optionalAuth,
  validateRequest({ body: createReportSchema }),
  reportController.createReport,
);
router.get("/:id", optionalAuth, reportController.getReport);
router.patch(
  "/:id",
  requireAuth,
  validateRequest({ body: updateReportSchema }),
  reportController.updateReport,
);

// Workflow state & assignment
router.patch(
  "/:id/status",
  requireAuth,
  validateRequest({ body: transitionStatusSchema }),
  workflowController.transitionStatus,
);

router.patch(
  "/:id/assign",
  requireAuth,
  requireRole("COORDINATOR"),
  validateRequest({ body: assignReportSchema }),
  workflowController.assignReport,
);

// Activities for report
router.get("/:id/activities", optionalAuth, reportController.getActivities);

export const reportRoutes = router;
