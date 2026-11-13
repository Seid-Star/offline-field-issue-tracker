import * as reportService from '../services/reportService.js';

export async function transitionStatus(req, res, next) {
  try {
    const updated = await reportService.transitionReportStatus(
      req.params.id,
      req.body,
      req.user
    );
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function assignReport(req, res, next) {
  try {
    const updated = await reportService.assignReportCoordinator(
      req.params.id,
      req.body,
      req.user
    );
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

