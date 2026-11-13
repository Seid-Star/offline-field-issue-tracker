import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as api from "../services/api.js";
import {
  clearAllLocalData,
  db,
  ensureSeeded,
  getMetaValue,
  getStorageInfo,
  resetDemoDataset,
  setMetaValue,
} from "../services/db.js";
import * as reportService from "../services/reportService.js";
import * as syncService from "../services/syncService.js";
import { generateUUID } from "../utils/id.js";
import { useNetwork } from "./NetworkContext.jsx";

const AppContext = createContext(null);

function normalizeUser(user) {
  if (!user) return null;

  const role = String(user.role || "FIELD_WORKER").toUpperCase();
  const isCoordinator = role === "COORDINATOR";

  return {
    ...user,
    id: user.id || user._id,
    name: user.name || "Field User",
    role: isCoordinator ? "Operations Coordinator" : "Field Worker",
    roleKey: isCoordinator ? "coordinator" : "field_worker",
    unit: user.unit || "Field Operations Unit",
    email: user.email || "",
  };
}

export function AppProvider({ children }) {
  const { effectiveOnline, simulatedOffline, simulatedFailSync } = useNetwork();

  const [isInitializing, setIsInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState(() =>
    normalizeUser(api.getStoredUser()),
  );

  const [reports, setReports] = useState([]);
  const [syncQueue, setSyncQueue] = useState([]);
  const [activities, setActivities] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    drafts: 0,
    submitted: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    pendingSync: 0,
    failedSync: 0,
    synchronized: 0,
    queueLength: 0,
  });

  const [storageInfo, setStorageInfo] = useState({
    reportsCount: 0,
    queueCount: 0,
    activitiesCount: 0,
    usageBytes: null,
    quotaBytes: null,
  });

  const [lastSyncAttempt, setLastSyncAttempt] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDrawerOpen, setSyncDrawerOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [toasts, setToasts] = useState([]);

  const demoRole = currentUser?.roleKey || "field_worker";

  const isAuthenticated = Boolean(currentUser && api.getAuthToken());

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, description = "", variant = "info", duration = 4200 }) => {
      const id = generateUUID();

      setToasts((prev) => [
        ...prev.slice(-3),
        { id, title, description, variant },
      ]);

      if (duration > 0) {
        setTimeout(() => dismissToast(id), duration);
      }

      return id;
    },
    [dismissToast],
  );

  const setAuthenticatedUser = useCallback(async (user) => {
    const normalized = normalizeUser(user);
    setCurrentUser(normalized);
    return normalized;
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setCurrentUser(null);
    addToast({
      title: "Signed out",
      description: "Your local reports remain saved on this device.",
      variant: "info",
    });
  }, [addToast]);

  const refreshData = useCallback(async () => {
    const [
      allReports,
      allQueue,
      allActivities,
      computedStats,
      lastSync,
      storage,
    ] = await Promise.all([
      api.getReports(),
      db.syncQueue.orderBy("createdAt").reverse().toArray(),
      api.getActivities(),
      api.getDashboardStats(),
      getMetaValue("lastSyncAttempt", null),
      getStorageInfo(),
    ]);

    setReports(allReports);
    setSyncQueue(allQueue);
    setActivities(allActivities);
    setStats(computedStats);
    setLastSyncAttempt(lastSync);
    setStorageInfo(storage);
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await ensureSeeded();

        if (api.getAuthToken()) {
          try {
            const user = await api.getCurrentUser();
            if (active && user) {
              setCurrentUser(normalizeUser(user));
            }
          } catch (error) {
            console.warn("Could not verify the saved session:", error.message);
          }
        }

        if (active) {
          await refreshData();
        }
      } catch (error) {
        console.error("Failed to initialize application:", error);
      } finally {
        if (active) setIsInitializing(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [refreshData]);

  // Role changes must come from authenticated server accounts.
  const switchRole = useCallback(() => {
    addToast({
      title: "Role change unavailable",
      description: "Sign in with an account provisioned for the required role.",
      variant: "warning",
    });
  }, [addToast]);

  const syncAll = useCallback(
    async (overrideOptions = {}) => {
      setIsSyncing(true);
      await refreshData();

      try {
        const result = await syncService.syncAllQueued({
          forceFail: overrideOptions.forceFail ?? simulatedFailSync,
          simulatedOffline:
            overrideOptions.simulatedOffline ?? simulatedOffline,
        });

        await refreshData();

        if (result.total === 0) {
          addToast({
            title: "Queue is up to date",
            description:
              "No pending or failed reports waiting for synchronization.",
            variant: "info",
          });
        } else if (result.failed === 0) {
          addToast({
            title: `Synchronized ${result.succeeded} report${result.succeeded === 1 ? "" : "s"}`,
            description: "The backend acknowledged the synchronization.",
            variant: "success",
          });
        } else if (result.succeeded > 0) {
          addToast({
            title: "Partial synchronization completed",
            description: `${result.succeeded} synchronized, ${result.failed} failed and preserved locally.`,
            variant: "warning",
          });
        } else {
          addToast({
            title: "Synchronization failed",
            description: `${result.failed} item(s) remain safely stored locally for retry.`,
            variant: "error",
          });
        }

        return result;
      } finally {
        setIsSyncing(false);
      }
    },
    [refreshData, simulatedFailSync, simulatedOffline, addToast],
  );

  const retrySyncItem = useCallback(
    async (queueId) => {
      setIsSyncing(true);

      try {
        const result = await syncService.syncQueueItem(queueId, {
          forceFail: simulatedFailSync,
          simulatedOffline,
        });

        await refreshData();

        if (result.success) {
          addToast({
            title: "Report synchronized",
            description: `Server ID ${result.result.serverId} assigned.`,
            variant: "success",
          });
        } else {
          addToast({
            title: "Retry failed",
            description:
              result.error || "Report remains safely stored locally.",
            variant: "error",
          });
        }

        return result;
      } catch (error) {
        addToast({
          title: "Cannot synchronize",
          description: error.message,
          variant: "error",
        });

        return { success: false, error: error.message };
      } finally {
        setIsSyncing(false);
      }
    },
    [refreshData, simulatedFailSync, simulatedOffline, addToast],
  );

  const createReport = useCallback(
    async (
      formData,
      { submitImmediately = true, autoSyncIfOnline = true } = {},
    ) => {
      const report = await reportService.createLocalReport(formData, {
        submitImmediately,
        actor: currentUser?.name || "Field Worker",
      });

      await refreshData();

      if (!submitImmediately) {
        addToast({
          title: "Draft saved locally",
          description: "Stored in IndexedDB until you submit it.",
          variant: "info",
        });
        return report;
      }

      if (effectiveOnline && autoSyncIfOnline) {
        addToast({
          title: "Report saved locally — syncing",
          description: "Persisted locally before sending to the backend.",
          variant: "info",
        });
        await syncAll();
      } else {
        addToast({
          title: "Saved offline & queued for sync",
          description:
            "Your report is safe in IndexedDB and will sync when online.",
          variant: "warning",
        });
      }

      return report;
    },
    [currentUser, effectiveOnline, refreshData, addToast, syncAll],
  );

  const submitDraft = useCallback(
    async (clientId) => {
      const updated = await reportService.submitDraftReport(
        clientId,
        currentUser?.name || "Field Worker",
      );

      await refreshData();

      addToast({
        title: "Draft submitted",
        description: effectiveOnline
          ? "Queued for backend synchronization."
          : "Queued locally until connectivity returns.",
        variant: effectiveOnline ? "success" : "warning",
      });

      return updated;
    },
    [currentUser, effectiveOnline, refreshData, addToast],
  );

  const updateReport = useCallback(
    async (clientId, updates) => {
      const updated = await reportService.updateLocalReport(
        clientId,
        updates,
        currentUser?.name || "Field Worker",
      );

      await refreshData();

      addToast({
        title: "Report updated locally",
        description: "Changes persisted to IndexedDB.",
        variant: "success",
      });

      return updated;
    },
    [currentUser, refreshData, addToast],
  );

  const transitionStatus = useCallback(
    async (clientId, nextStatus, note = "") => {
      const updated = await reportService.transitionReportStatus(
        clientId,
        nextStatus,
        {
          actor: currentUser?.name || "Field Worker",
          note,
        },
      );

      await refreshData();

      addToast({
        title: `Status updated to ${nextStatus}`,
        description: "Workflow transition validated and queued for sync.",
        variant: "success",
      });

      return updated;
    },
    [currentUser, refreshData, addToast],
  );

  const assignReport = useCallback(
    async (clientId, assignee) => {
      const updated = await reportService.assignReportCoordinator(
        clientId,
        assignee,
        currentUser?.name || "Coordinator",
      );

      await refreshData();

      addToast({
        title: "Responsibility assigned",
        description: `Assigned to ${assignee}.`,
        variant: "success",
      });

      return updated;
    },
    [currentUser, refreshData, addToast],
  );

  const resetDemoData = useCallback(async () => {
    await resetDemoDataset();
    await setMetaValue("lastSyncAttempt", null);
    await refreshData();

    addToast({
      title: "Demo dataset restored",
      description: "Sample reports, activities, and sync queue were reset.",
      variant: "info",
    });
  }, [refreshData, addToast]);

  const clearAllData = useCallback(async () => {
    await clearAllLocalData();
    await refreshData();

    addToast({
      title: "Local IndexedDB cleared",
      description:
        "All local reports, queue items, and activities were removed.",
      variant: "warning",
    });
  }, [refreshData, addToast]);

  const value = useMemo(
    () => ({
      isInitializing,
      isAuthenticated,
      currentUser,
      demoRole,
      switchRole,
      setAuthenticatedUser,
      logout,
      reports,
      syncQueue,
      activities,
      stats,
      storageInfo,
      lastSyncAttempt,
      isSyncing,
      syncDrawerOpen,
      setSyncDrawerOpen,
      globalSearch,
      setGlobalSearch,
      toasts,
      addToast,
      dismissToast,
      refreshData,
      createReport,
      submitDraft,
      updateReport,
      transitionStatus,
      assignReport,
      syncAll,
      retrySyncItem,
      resetDemoData,
      clearAllData,
    }),
    [
      isInitializing,
      isAuthenticated,
      currentUser,
      demoRole,
      switchRole,
      setAuthenticatedUser,
      logout,
      reports,
      syncQueue,
      activities,
      stats,
      storageInfo,
      lastSyncAttempt,
      isSyncing,
      syncDrawerOpen,
      globalSearch,
      toasts,
      addToast,
      dismissToast,
      refreshData,
      createReport,
      submitDraft,
      updateReport,
      transitionStatus,
      assignReport,
      syncAll,
      retrySyncItem,
      resetDemoData,
      clearAllData,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside an AppProvider");
  }

  return context;
}
