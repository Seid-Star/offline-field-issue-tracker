import * as reportService from '../services/reportService.js';
import * as activityService from '../services/activityService.js';

export async function getStats(req, res, next) {
  try {
    const stats = await reportService.getDashboardMetrics();
    return res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

export async function getRecentActivities(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const activities = await activityService.getRecentActivities(limit);
    return res.status(200).json({ items: activities, total: activities.length });
  } catch (err) {
    next(err);
  }
}

