import * as reportService from '../services/reportService.js';
import * as activityService from '../services/activityService.js';

export async function getReports(req, res, next) {
  try {
    const result = await reportService.listReports(req.query, req.user);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getReport(req, res, next) {
  try {
    const report = await reportService.getReportById(req.params.id);
    return res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

export async function createReport(req, res, next) {
  try {
    const { report, isDuplicate } = await reportService.createSingleReport(req.body, req.user);
    const status = isDuplicate ? 200 : 201;
    return res.status(status).json(report);
  } catch (err) {
    next(err);
  }
}

export async function updateReport(req, res, next) {
  try {
    const updated = await reportService.updateReportContent(req.params.id, req.body, req.user);
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function getActivities(req, res, next) {
  try {
    const report = await reportService.getReportById(req.params.id);
    const items = await activityService.getActivitiesForReport(report.clientId);
    return res.status(200).json({ items, total: items.length });
  } catch (err) {
    next(err);
  }
}

