import { Activity } from '../models/Activity.js';
import { generateEventId } from '../utils/idGenerator.js';

export async function logActivity(
  {
    reportClientId,
    reportId = null,
    action,
    previousValue = null,
    newValue = null,
    description,
    performedBy = 'System',
    metadata = {},
    eventId = null,
  },
  { session = null } = {}
) {
  const finalEventId = eventId || generateEventId();

  // Deduplication check: if eventId already exists, return existing
  const existing = await Activity.findOne({ eventId: finalEventId }).session(session);
  if (existing) {
    return existing;
  }

  const activityData = {
    eventId: finalEventId,
    reportClientId,
    reportId,
    action,
    previousValue,
    newValue,
    description,
    performedBy: typeof performedBy === 'string' ? performedBy : performedBy.name || 'System',
    timestamp: new Date(),
    metadata,
  };

  if (session) {
    const [created] = await Activity.create([activityData], { session });
    return created;
  }

  return Activity.create(activityData);
}

export async function getActivitiesForReport(reportClientId) {
  return Activity.find({ reportClientId })
    .sort({ timestamp: -1 })
    .lean();
}

export async function getRecentActivities(limit = 10) {
  return Activity.find({})
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
}

