import Dexie from "dexie";
import {
  INITIAL_DEMO_ACTIVITIES,
  INITIAL_DEMO_REPORTS,
  INITIAL_DEMO_SYNC_QUEUE,
} from "../data/mockReports.js";

export const db = new Dexie("OfflineFieldIssueTrackerDB");

db.version(1).stores({
  reports:
    "&clientId, serverId, category, priority, status, syncStatus, reportedAt, createdAt, updatedAt",
  syncQueue: "&id, reportClientId, status, attempts, createdAt",
  activities: "&id, reportClientId, type, timestamp",
  meta: "&key",
});

db.version(2).stores({
  reports:
    "&clientId, serverId, category, priority, status, syncStatus, reportedAt, createdAt, updatedAt",
  syncQueue:
    "&id, reportClientId, status, attempts, createdAt, operation, payloadVersion",
  activities: "&id, reportClientId, type, timestamp",
  meta: "&key",
});

export async function ensureSeeded() {
  const seededFlag = await db.meta.get("seeded");
  if (seededFlag?.value) {
    return;
  }

  const existingCount = await db.reports.count();
  if (existingCount === 0) {
    await db.transaction(
      "rw",
      db.reports,
      db.activities,
      db.syncQueue,
      db.meta,
      async () => {
        await db.reports.bulkPut(INITIAL_DEMO_REPORTS);
        await db.activities.bulkPut(INITIAL_DEMO_ACTIVITIES);
        await db.syncQueue.bulkPut(INITIAL_DEMO_SYNC_QUEUE);
        await db.meta.put({ key: "seeded", value: true });
      },
    );
  } else {
    await db.meta.put({ key: "seeded", value: true });
  }
}

export async function resetDemoDataset() {
  await db.transaction(
    "rw",
    db.reports,
    db.activities,
    db.syncQueue,
    db.meta,
    async () => {
      await db.reports.clear();
      await db.activities.clear();
      await db.syncQueue.clear();
      await db.reports.bulkPut(INITIAL_DEMO_REPORTS);
      await db.activities.bulkPut(INITIAL_DEMO_ACTIVITIES);
      await db.syncQueue.bulkPut(INITIAL_DEMO_SYNC_QUEUE);
      await db.meta.put({ key: "seeded", value: true });
      await db.meta.put({ key: "lastSyncAttempt", value: null });
    },
  );
}

export async function clearAllLocalData() {
  await db.transaction(
    "rw",
    db.reports,
    db.activities,
    db.syncQueue,
    db.meta,
    async () => {
      await db.reports.clear();
      await db.activities.clear();
      await db.syncQueue.clear();
      await db.meta.put({ key: "seeded", value: true });
      await db.meta.put({ key: "lastSyncAttempt", value: null });
    },
  );
}

export async function getMetaValue(key, defaultValue = null) {
  const record = await db.meta.get(key);
  return record ? record.value : defaultValue;
}

export async function setMetaValue(key, value) {
  await db.meta.put({ key, value });
}

export async function getStorageInfo() {
  const [reportsCount, queueCount, activitiesCount] = await Promise.all([
    db.reports.count(),
    db.syncQueue.count(),
    db.activities.count(),
  ]);

  let estimate = null;
  if (typeof navigator !== "undefined" && navigator.storage?.estimate) {
    try {
      estimate = await navigator.storage.estimate();
    } catch {
      estimate = null;
    }
  }

  return {
    reportsCount,
    queueCount,
    activitiesCount,
    usageBytes: estimate?.usage ?? null,
    quotaBytes: estimate?.quota ?? null,
  };
}
