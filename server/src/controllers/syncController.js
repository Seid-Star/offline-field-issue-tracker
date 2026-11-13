import * as syncService from '../services/syncService.js';

export async function syncReports(req, res, next) {
  try {
    const { items } = req.body;
    const result = await syncService.processBatchSync(items, req.user);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

