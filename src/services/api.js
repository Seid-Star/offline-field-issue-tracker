import { db } from "./db.js";
import {
  getBrowserOnlineStatus,
  getSimulatedOffline,
} from "./networkService.js";

const TOKEN_KEY = "fieldtrack_auth_token";
const USER_KEY = "fieldtrack_auth_user";

const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/+$/, "");

export const API_CONFIG = {
  baseUrl: BASE_URL,
  mode: "real-backend",
};

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function saveAuth(result) {
  if (!result?.token || !result?.user) {
    throw new Error("The server returned an invalid authentication response.");
  }

  localStorage.setItem(TOKEN_KEY, result.token);
  localStorage.setItem(USER_KEY, JSON.stringify(result.user));

  return result;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(path, options = {}) {
  if (!getBrowserOnlineStatus() || getSimulatedOffline()) {
    const error = new Error("You are offline. Please reconnect and try again.");
    error.code = "NETWORK_UNREACHABLE";
    throw error;
  }

  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    const error = new Error("Cannot reach the server. Check your connection.");
    error.code = "NETWORK_UNREACHABLE";
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message ||
        data.error?.message ||
        `Request failed (${response.status}).`,
    );
    error.status = response.status;
    error.code = data.code || data.error?.code || "API_ERROR";
    throw error;
  }

  return data;
}

// Authentication

export async function login(credentials) {
  const result = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  return saveAuth(result);
}

export async function register(userData) {
  const result = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  return saveAuth(result);
}

export async function getCurrentUser() {
  if (!getAuthToken()) return null;

  try {
    const result = await request("/auth/me");
    const user = result.user || result;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      logout();
    }
    throw error;
  }
}

// Local-first report storage

export async function getReports(filters = {}) {
  let collection = await db.reports.orderBy("reportedAt").reverse().toArray();

  if (filters.category && filters.category !== "All") {
    collection = collection.filter((r) => r.category === filters.category);
  }
  if (filters.priority && filters.priority !== "All") {
    collection = collection.filter((r) => r.priority === filters.priority);
  }
  if (filters.status && filters.status !== "All") {
    collection = collection.filter((r) => r.status === filters.status);
  }
  if (filters.syncStatus && filters.syncStatus !== "All") {
    collection = collection.filter((r) => r.syncStatus === filters.syncStatus);
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    collection = collection.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.location?.name?.toLowerCase().includes(q) ||
        r.clientId?.toLowerCase().includes(q),
    );
  }

  return collection;
}

export async function getReportById(clientId) {
  const report = await db.reports.get(clientId);

  if (!report) {
    const error = new Error(`Report ${clientId} not found`);
    error.code = "NOT_FOUND";
    throw error;
  }

  return report;
}

export async function createReport(data) {
  await db.reports.put(data);
  return data;
}

export async function updateReport(clientId, data) {
  const existing = await db.reports.get(clientId);

  if (!existing) {
    throw new Error(`Report ${clientId} not found`);
  }

  const updated = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await db.reports.put(updated);
  return updated;
}

export async function updateReportStatus(clientId, status) {
  return updateReport(clientId, { status });
}

export async function assignReport(clientId, assignee) {
  return updateReport(clientId, { assignee });
}

export async function getActivities(reportClientId = null) {
  if (reportClientId) {
    return db.activities
      .where("reportClientId")
      .equals(reportClientId)
      .reverse()
      .sortBy("timestamp");
  }

  return db.activities.orderBy("timestamp").reverse().toArray();
}

export async function getDashboardStats() {
  const reports = await db.reports.toArray();
  const queue = await db.syncQueue.toArray();

  const total = reports.length;
  const drafts = reports.filter((r) => r.status === "Draft").length;
  const submitted = reports.filter((r) => r.status === "Submitted").length;
  const assigned = reports.filter((r) => r.status === "Assigned").length;
  const inProgress = reports.filter((r) => r.status === "In Progress").length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;
  const rejected = reports.filter((r) => r.status === "Rejected").length;

  return {
    total,
    drafts,
    submitted,
    assigned,
    inProgress,
    resolved,
    rejected,
    pendingSync: reports.filter(
      (r) =>
        r.status !== "Draft" &&
        (r.syncStatus === "Pending" || r.syncStatus === "Syncing"),
    ).length,
    failedSync: reports.filter((r) => r.syncStatus === "Failed").length,
    synchronized: reports.filter((r) => r.syncStatus === "Synchronized").length,
    queueLength: queue.filter((q) => q.status !== "Synchronized").length,
  };
}

// Real backend batch synchronization

export async function syncReports(items, options = {}) {
  if (options.forceFail) {
    throw new Error("Synchronization failure simulation is enabled.");
  }

  if (
    !getBrowserOnlineStatus() ||
    options.simulatedOffline ||
    getSimulatedOffline()
  ) {
    const error = new Error(
      "Network unreachable: synchronization is unavailable.",
    );
    error.code = "NETWORK_UNREACHABLE";
    throw error;
  }

  const payload = {
    items: items.map((item) => ({
      queueId: item.id,
      operation: item.operation,
      payloadVersion: item.payloadVersion,
      report: item.report,
    })),
  };

  return request("/reports/sync", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
