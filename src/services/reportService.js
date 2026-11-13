import { ALLOWED_TRANSITIONS } from '../utils/constants.js';
import { generateUUID } from '../utils/id.js';
import * as api from './api.js';
import { db } from './db.js';

export function canTransition(fromStatus, toStatus) {
  const allowed = ALLOWED_TRANSITIONS[fromStatus] || [];
  return allowed.includes(toStatus);
}

export function validateTransition(fromStatus, toStatus) {
  if (fromStatus === toStatus) {
    return {
      valid: false,
      reason: `Report is already in "${fromStatus}" status.`,
    };
  }
  const allowed = ALLOWED_TRANSITIONS[fromStatus] || [];
  if (!allowed.includes(toStatus)) {
    const allowedText = allowed.length > 0 ? allowed.join(' or ') : 'none (terminal state)';
    return {
      valid: false,
      reason: `Invalid workflow transition: "${fromStatus}" cannot transition directly to "${toStatus}". Allowed next states: ${allowedText}.`,
    };
  }
  return { valid: true, reason: null };
}

async function addActivity({ reportClientId, type, actor, message }) {
  const entry = {
    id: `act-${generateUUID()}`,
    reportClientId,
    type,
    actor: actor || 'System',
    message,
    timestamp: new Date().toISOString(),
  };
  await db.activities.put(entry);
  return entry;
}

/**
 * Enqueues a report into syncQueue without creating duplicates for the same reportClientId.
 */
async function upsertSyncQueueItem(report, operation) {
  const existing = await db.syncQueue
    .where('reportClientId')
    .equals(report.clientId)
    .first();

  const now = new Date().toISOString();
  if (existing) {
    const updatedItem = {
      ...existing,
      operation,
      status: 'Pending',
      lastError: null,
      payloadVersion: report.syncVersion,
      updatedAt: now,
    };
    await db.syncQueue.put(updatedItem);
    return updatedItem;
  }

  const newItem = {
    id: `sq-${generateUUID()}`,
    reportClientId: report.clientId,
    operation,
    status: 'Pending',
    attempts: 0,
    lastAttemptAt: null,
    lastError: null,
    payloadVersion: report.syncVersion,
    createdAt: now,
  };
  await db.syncQueue.put(newItem);
  return newItem;
}

/**
 * Creates a report locally in IndexedDB first.
 * Drafts remain local until explicitly submitted.
 * Submitted reports enter the synchronization queue immediately.
 */
export async function createLocalReport(input, { submitImmediately = true, actor = 'Field Worker' } = {}) {
  const now = new Date().toISOString();
  const clientId = generateUUID();
  const status = submitImmediately ? 'Submitted' : 'Draft';

  const report = {
    clientId,
    serverId: null,
    title: input.title?.trim() || `${input.category} issue at ${input.locationName?.trim()}`,
    category: input.category,
    description: input.description.trim(),
    location: {
      name: input.locationName.trim(),
      latitude:
        input.latitude !== '' && input.latitude !== null && input.latitude !== undefined
          ? Number(input.latitude)
          : null,
      longitude:
        input.longitude !== '' && input.longitude !== null && input.longitude !== undefined
          ? Number(input.longitude)
          : null,
    },
    priority: input.priority,
    status,
    assignee: null,
    reportedBy: actor,
    reportedAt: input.reportedAt ? new Date(input.reportedAt).toISOString() : now,
    syncStatus: 'Pending',
    syncVersion: 1,
    createdAt: now,
    updatedAt: now,
  };

  await api.createReport(report);

  if (submitImmediately) {
    await addActivity({
      reportClientId: clientId,
      type: 'report_created',
      actor,
      message: `Report created and submitted locally (${report.priority} priority).`,
    });
    await upsertSyncQueueItem(report, 'CREATE_REPORT');
    await addActivity({
      reportClientId: clientId,
      type: 'sync_queued',
      actor: 'Local Sync Engine',
      message: 'Entered local IndexedDB syncQueue awaiting server synchronization.',
    });
  } else {
    await addActivity({
      reportClientId: clientId,
      type: 'draft_saved',
      actor,
      message: 'Saved local draft in IndexedDB. Drafts remain offline until submitted.',
    });
  }

  return report;
}

/**
 * Transitions a Draft report to Submitted and queues it for synchronization.
 */
export async function submitDraftReport(clientId, actor = 'Field Worker') {
  const existing = await api.getReportById(clientId);
  const check = validateTransition(existing.status, 'Submitted');
  if (!check.valid) {
    throw new Error(check.reason);
  }

  const nextVersion = (existing.syncVersion || 1) + 1;
  const updated = await api.updateReport(clientId, {
    status: 'Submitted',
    syncStatus: 'Pending',
    syncVersion: nextVersion,
  });

  await upsertSyncQueueItem(updated, existing.serverId ? 'UPDATE_REPORT' : 'CREATE_REPORT');
  await addActivity({
    reportClientId: clientId,
    type: 'status_changed',
    actor,
    message: 'Draft submitted for triage and queued for synchronization.',
  });

  return updated;
}

/**
 * Updates report fields locally (e.g., editing a draft or updating notes).
 */
export async function updateLocalReport(clientId, updates, actor = 'Field Worker') {
  const existing = await api.getReportById(clientId);
  const nextVersion = (existing.syncVersion || 1) + 1;
  const shouldQueue = existing.status !== 'Draft';

  const updated = await api.updateReport(clientId, {
    ...updates,
    syncVersion: nextVersion,
    syncStatus: shouldQueue ? 'Pending' : existing.syncStatus,
  });

  if (shouldQueue) {
    await upsertSyncQueueItem(updated, existing.serverId ? 'UPDATE_REPORT' : 'CREATE_REPORT');
  }

  await addActivity({
    reportClientId: clientId,
    type: 'report_updated',
    actor,
    message: shouldQueue
      ? 'Report details edited locally and queued for sync update.'
      : 'Local draft updated in IndexedDB.',
  });

  return updated;
}

/**
 * Enforces workflow state transitions in the service layer.
 */
export async function transitionReportStatus(clientId, nextStatus, { actor = 'Coordinator', note = '' } = {}) {
  const existing = await api.getReportById(clientId);
  const check = validateTransition(existing.status, nextStatus);
  if (!check.valid) {
    const error = new Error(check.reason);
    error.code = 'INVALID_TRANSITION';
    throw error;
  }

  const nextVersion = (existing.syncVersion || 1) + 1;
  const updated = await api.updateReport(clientId, {
    status: nextStatus,
    syncStatus: 'Pending',
    syncVersion: nextVersion,
  });

  await upsertSyncQueueItem(updated, existing.serverId ? 'UPDATE_STATUS' : 'CREATE_REPORT');

  const noteSuffix = note?.trim() ? ` Note: ${note.trim()}` : '';
  await addActivity({
    reportClientId: clientId,
    type: 'status_changed',
    actor,
    message: `Workflow transitioned from ${existing.status} to ${nextStatus}.${noteSuffix}`,
  });

  return updated;
}

/**
 * Assigns responsibility for a report. If currently Submitted, enforces Submitted -> Assigned transition.
 */
export async function assignReportCoordinator(clientId, assignee, actor = 'Coordinator') {
  if (!assignee || !assignee.trim()) {
    throw new Error('Please select or enter an assignee.');
  }

  const existing = await api.getReportById(clientId);

  let nextStatus = existing.status;
  if (existing.status === 'Submitted') {
    const check = validateTransition('Submitted', 'Assigned');
    if (!check.valid) throw new Error(check.reason);
    nextStatus = 'Assigned';
  } else if (existing.status === 'Draft' || existing.status === 'Resolved' || existing.status === 'Rejected') {
    throw new Error(`Cannot assign a report while in "${existing.status}" status.`);
  }

  const nextVersion = (existing.syncVersion || 1) + 1;
  const updated = await api.updateReport(clientId, {
    assignee: assignee.trim(),
    status: nextStatus,
    syncStatus: 'Pending',
    syncVersion: nextVersion,
  });

  await upsertSyncQueueItem(updated, existing.serverId ? 'ASSIGN_REPORT' : 'CREATE_REPORT');

  await addActivity({
    reportClientId: clientId,
    type: 'assigned',
    actor,
    message:
      existing.status === 'Submitted'
        ? `Assigned to ${assignee.trim()} and transitioned from Submitted to Assigned.`
        : `Reassigned responsibility to ${assignee.trim()}.`,
  });

  return updated;
}
