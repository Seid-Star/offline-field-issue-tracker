import { generateUUID } from "../utils/id.js";
import * as api from "./api.js";
import { db, setMetaValue } from "./db.js";
import { getSimulatedFailSync, getSimulatedOffline } from "./networkService.js";

async function logSyncActivity(reportClientId, type, message) {
  await db.activities.put({
    id: `act-${generateUUID()}`,
    reportClientId,
    type,
    actor: "Simulated Sync Adapter",
    message,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Synchronizes a single syncQueue entry by ID.
 * Never deletes reports on failure and never duplicates local reports on retry.
 */
export async function syncQueueItem(queueId, options = {}) {
  const queueItem = await db.syncQueue.get(queueId);
  if (!queueItem) {
    throw new Error("Sync queue item not found.");
  }

  const report = await db.reports.get(queueItem.reportClientId);
  if (!report) {
    await db.syncQueue.delete(queueId);
    return { skipped: true };
  }

  if (report.status === "Draft") {
    throw new Error(
      "Draft reports remain local and cannot be synchronized until submitted.",
    );
  }

  const forceFail = options.forceFail ?? getSimulatedFailSync();
  const simulatedOffline = options.simulatedOffline ?? getSimulatedOffline();
  const attemptTime = new Date().toISOString();

  await db.transaction("rw", db.reports, db.syncQueue, async () => {
    await db.reports.update(report.clientId, { syncStatus: "Syncing" });
    await db.syncQueue.update(queueId, {
      status: "Syncing",
      attempts: (queueItem.attempts || 0) + 1,
      lastAttemptAt: attemptTime,
    });
  });

  try {
    const response = await api.syncReports([{ ...queueItem, report }], {
      forceFail,
      simulatedOffline,
    });
    const result = response.results[0];
    if (!result || result.status !== "Synchronized") {
      throw new Error(
        result?.error?.message || "Server rejected this synchronization item.",
      );
    }

    if (!result.serverId) {
      throw new Error("Server did not return a valid report ID.");
    }

    await db.transaction("rw", db.reports, db.syncQueue, async () => {
      await db.reports.update(report.clientId, {
        serverId: result.serverId,
        syncStatus: "Synchronized",
        updatedAt: result.syncedAt,
      });
      await db.syncQueue.update(queueId, {
        status: "Synchronized",
        lastError: null,
        syncedAt: result.syncedAt,
      });
    });

    await logSyncActivity(
      report.clientId,
      "sync_success",
      `Synchronized with simulated backend (${result.serverId}, version v${result.acceptedVersion}).`,
    );

    await setMetaValue("lastSyncAttempt", attemptTime);
    return { success: true, result };
  } catch (err) {
    const errorMessage = err?.message || "Unknown synchronization error";

    await db.transaction("rw", db.reports, db.syncQueue, async () => {
      await db.reports.update(report.clientId, {
        syncStatus: "Failed",
      });
      await db.syncQueue.update(queueId, {
        status: "Failed",
        lastError: errorMessage,
      });
    });

    await logSyncActivity(
      report.clientId,
      "sync_failed",
      `Synchronization failed: ${errorMessage} Report preserved safely in IndexedDB.`,
    );

    await setMetaValue("lastSyncAttempt", attemptTime);
    return { success: false, error: errorMessage };
  }
}

/**
 * Synchronizes all Pending and Failed queue items.
 */
export async function syncAllQueued(options = {}) {
  const allQueue = await db.syncQueue.toArray();
  const eligible = allQueue.filter(
    (item) => item.status === "Pending" || item.status === "Failed",
  );

  if (eligible.length === 0) {
    return { total: 0, succeeded: 0, failed: 0 };
  }

  let succeeded = 0;
  let failed = 0;

  for (const item of eligible) {
    const res = await syncQueueItem(item.id, options);
    if (res.success) {
      succeeded += 1;
    } else if (!res.skipped) {
      failed += 1;
    }
  }

  return {
    total: eligible.length,
    succeeded,
    failed,
  };
}
