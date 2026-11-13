import mongoose from 'mongoose';
import { withTransaction } from '../config/db.js';
import { Report } from '../models/Report.js';
import { createSingleReport, transitionReportStatus, assignReportCoordinator, updateReportContent } from './reportService.js';

export async function processSyncItem(item, user = null) {
  const { queueId, operation, payloadVersion, report: reportPayload } = item;
  const clientId = reportPayload.clientId;

  try {
    // Attempt within a transaction if supported, or directly
    const runWork = async (session) => {
      if (operation === 'CREATE_REPORT') {
        const existing = await Report.findOne({ clientId }).session(session);

        if (existing) {
          // Idempotent retry check: if the already-saved report matches or is ahead
          if (existing.syncVersion === payloadVersion) {
            return {
              clientId,
              serverId: existing.serverId,
              acceptedVersion: existing.syncVersion,
              status: 'Synchronized',
              syncedAt: existing.updatedAt,
              isIdempotentReplay: true,
            };
          }

          if (existing.syncVersion > payloadVersion) {
            return {
              clientId,
              status: 'Failed',
              error: {
                code: 'VERSION_CONFLICT',
                message: `Server already has a newer version (${existing.syncVersion}) than payload (${payloadVersion}).`,
                serverVersion: existing.syncVersion,
                clientVersion: payloadVersion,
              },
            };
          }

          // Client has newer payload version for existing report
          const updated = await updateReportContent(clientId, {
            ...reportPayload,
            syncVersion: payloadVersion - 1,
          }, user);

          return {
            clientId,
            serverId: updated.serverId,
            acceptedVersion: updated.syncVersion,
            status: 'Synchronized',
            syncedAt: updated.updatedAt,
          };
        }

        // New report insertion
        const { report: created } = await createSingleReport(
          { ...reportPayload, syncVersion: payloadVersion || 1 },
          user,
          { session }
        );

        return {
          clientId,
          serverId: created.serverId,
          acceptedVersion: created.syncVersion,
          status: 'Synchronized',
          syncedAt: created.updatedAt,
        };
      }

      if (operation === 'UPDATE_STATUS') {
        const updated = await transitionReportStatus(
          clientId,
          {
            status: reportPayload.status,
            actor: reportPayload.reportedBy || user?.name,
            syncVersion: payloadVersion - 1,
          },
          user
        );

        return {
          clientId,
          serverId: updated.serverId,
          acceptedVersion: updated.syncVersion,
          status: 'Synchronized',
          syncedAt: updated.updatedAt,
        };
      }

      if (operation === 'ASSIGN_REPORT') {
        const updated = await assignReportCoordinator(
          clientId,
          {
            assignee: reportPayload.assignee,
            actor: user?.name,
            syncVersion: payloadVersion - 1,
          },
          user
        );

        return {
          clientId,
          serverId: updated.serverId,
          acceptedVersion: updated.syncVersion,
          status: 'Synchronized',
          syncedAt: updated.updatedAt,
        };
      }

      // Default: UPDATE_REPORT
      const updated = await updateReportContent(
        clientId,
        { ...reportPayload, syncVersion: payloadVersion - 1 },
        user
      );

      return {
        clientId,
        serverId: updated.serverId,
        acceptedVersion: updated.syncVersion,
        status: 'Synchronized',
        syncedAt: updated.updatedAt,
      };
    };

    // Try transaction; fallback gracefully if standalone non-replica MongoDB
    try {
      return await withTransaction(runWork);
    } catch (txErr) {
      // If error indicates transactions aren't supported on standalone
      if (
        txErr.message?.includes('Transaction numbers are only allowed on a replica set member') ||
        txErr.message?.includes('standalone')
      ) {
        return await runWork(null);
      }
      throw txErr;
    }
  } catch (err) {
    return {
      clientId,
      status: 'Failed',
      error: {
        code: err.code || 'SYNC_ERROR',
        message: err.message || 'Synchronization failed for this item.',
        ...(err.details ? { details: err.details } : {}),
      },
    };
  }
}

export async function processBatchSync(items, user = null) {
  const syncedAt = new Date().toISOString();
  const results = [];

  for (const item of items) {
    const itemResult = await processSyncItem(item, user);
    results.push(itemResult);
  }

  return {
    syncedAt,
    processedCount: items.length,
    successCount: results.filter((r) => r.status === 'Synchronized').length,
    failedCount: results.filter((r) => r.status === 'Failed').length,
    results,
  };
}

