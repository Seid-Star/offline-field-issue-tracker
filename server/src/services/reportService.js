import mongoose from "mongoose";
import { Report } from "../models/Report.js";
import { generateServerId } from "../utils/idGenerator.js";
import { validateTransition } from "../utils/workflowEngine.js";
import { logActivity } from "./activityService.js";

export async function listReports(filters = {}, user = null) {
  const query = {};

  if (filters.category && filters.category !== "All") {
    query.category = filters.category;
  }
  if (filters.priority && filters.priority !== "All") {
    query.priority = filters.priority;
  }
  if (filters.status && filters.status !== "All") {
    query.status = filters.status;
  }
  if (filters.since) {
    query.updatedAt = { $gte: new Date(filters.since) };
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim();
    const regex = new RegExp(q, "i");
    query.$or = [
      { title: regex },
      { description: regex },
      { category: regex },
      { "location.name": regex },
      { clientId: regex },
      { serverId: regex },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Report.find(query).sort({ reportedAt: -1 }).skip(skip).limit(limit).lean(),
    Report.countDocuments(query),
  ]);

  const transformedItems = items.map((doc) => {
    doc.id = doc._id.toString();
    delete doc._id;
    delete doc.__v;
    return doc;
  });

  return {
    items: transformedItems,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getReportById(identifier) {
  let query = { clientId: identifier };

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query = {
      $or: [
        { _id: identifier },
        { clientId: identifier },
        { serverId: identifier },
      ],
    };
  } else {
    query = { $or: [{ clientId: identifier }, { serverId: identifier }] };
  }

  const report = await Report.findOne(query);
  if (!report) {
    const err = new Error(`Report "${identifier}" was not found.`);
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return report;
}

export async function createSingleReport(
  reportData,
  user = null,
  { session = null } = {},
) {
  // Idempotency check: if clientId already exists
  const existing = await Report.findOne({
    clientId: reportData.clientId,
  }).session(session);
  if (existing) {
    if (existing.syncVersion === (reportData.syncVersion || 1)) {
      // Idempotent retry: same report & version submitted again
      return { report: existing, isDuplicate: true };
    }
    const conflictErr = new Error(
      `Report with clientId "${reportData.clientId}" already exists with version ${existing.syncVersion}.`,
    );
    conflictErr.statusCode = 409;
    conflictErr.code = "VERSION_CONFLICT";
    conflictErr.details = {
      clientId: existing.clientId,
      serverVersion: existing.syncVersion,
      clientVersion: reportData.syncVersion,
    };
    throw conflictErr;
  }

  const serverId = reportData.serverId || generateServerId(reportData.clientId);
  const createdBy = user?._id || reportData.createdBy || null;
  const reportedBy = reportData.reportedBy || user?.name || "Field Worker";

  const docData = {
    ...reportData,
    serverId,
    createdBy,
    reportedBy,
    syncVersion: reportData.syncVersion || 1,
  };

  let report;
  if (session) {
    const [created] = await Report.create([docData], { session });
    report = created;
  } else {
    report = await Report.create(docData);
  }

  // Record initial activity
  await logActivity(
    {
      reportClientId: report.clientId,
      reportId: report._id,
      action: "REPORT_CREATED",
      newValue: report.status,
      description: `Report "${report.title}" created (${report.priority} priority, status: ${report.status}).`,
      performedBy: reportedBy,
      eventId: `act-${report.clientId}`, // Deterministic eventId for creation activity idempotency
    },
    { session },
  );

  return { report, isDuplicate: false };
}

export async function updateReportContent(identifier, updates, user = null) {
  const report = await getReportById(identifier);

  // Protect reports from updates by unrelated field workers.
  if (user && user.role === "FIELD_WORKER") {
    const hasOwnershipInfo = Boolean(report.createdBy || report.reportedBy);

    const isCreator =
      (report.createdBy &&
        user._id &&
        report.createdBy.toString() === user._id.toString()) ||
      (report.reportedBy &&
        user.name &&
        report.reportedBy.toLowerCase() === user.name.toLowerCase());

    const isAssigned =
      (report.assignedTo &&
        user._id &&
        report.assignedTo.toString() === user._id.toString()) ||
      (report.assignee &&
        user.name &&
        report.assignee.toLowerCase() === user.name.toLowerCase()) ||
      (report.assignee &&
        user.unit &&
        report.assignee.toLowerCase().includes(user.unit.toLowerCase()));

    if (hasOwnershipInfo && !isCreator && !isAssigned) {
      const err = new Error(
        "Forbidden: You cannot update another worker’s report.",
      );
      err.statusCode = 403;
      err.code = "FORBIDDEN";
      throw err;
    }
  }

  // Optimistic concurrency check
  if (updates.syncVersion && report.syncVersion !== updates.syncVersion) {
    const err = new Error(
      `Version conflict: Report is at version ${report.syncVersion}, but update expected version ${updates.syncVersion}.`,
    );
    err.statusCode = 409;
    err.code = "VERSION_CONFLICT";
    err.details = {
      currentVersion: report.syncVersion,
      providedVersion: updates.syncVersion,
    };
    throw err;
  }

  if (updates.title) report.title = updates.title;
  if (updates.category) report.category = updates.category;
  if (updates.description) report.description = updates.description;
  if (updates.priority) report.priority = updates.priority;
  if (updates.location) {
    report.location = { ...report.location.toObject(), ...updates.location };
  }

  report.syncVersion += 1;
  await report.save();

  await logActivity({
    reportClientId: report.clientId,
    reportId: report._id,
    action: "REPORT_UPDATED",
    description: `Report details updated (v${report.syncVersion}).`,
    performedBy: user?.name || "Field Worker",
  });

  return report;
}

export async function transitionReportStatus(
  identifier,
  { status: targetStatus, note, actor, syncVersion },
  user = null,
) {
  const report = await getReportById(identifier);

  if (syncVersion && report.syncVersion !== syncVersion) {
    const err = new Error(
      `Version conflict: Report is at version ${report.syncVersion}, but transition expected version ${syncVersion}.`,
    );
    err.statusCode = 409;
    err.code = "VERSION_CONFLICT";
    err.details = {
      currentVersion: report.syncVersion,
      providedVersion: syncVersion,
    };
    throw err;
  }

  const roleToCheck =
    user?.role ||
    (actor?.toLowerCase().includes("coordinator")
      ? "COORDINATOR"
      : "FIELD_WORKER");
  const check = validateTransition(report.status, targetStatus, roleToCheck);

  if (!check.valid) {
    const err = new Error(check.reason);
    err.statusCode = check.code === "UNAUTHORIZED_ROLE" ? 403 : 422;
    err.code = check.code || "INVALID_TRANSITION";
    err.details = {
      currentStatus: check.currentStatus,
      requestedStatus: check.requestedStatus,
      allowedTransitions: check.allowedTransitions,
    };
    throw err;
  }

  // Field Worker assignment check for In Progress
  if (
    user &&
    user.role === "FIELD_WORKER" &&
    check.normalizedTo === "In Progress"
  ) {
    const hasAssignee = Boolean(report.assignedTo || report.assignee);
    const isAssigned =
      (report.assignedTo &&
        user._id &&
        report.assignedTo.toString() === user._id.toString()) ||
      (report.assignee &&
        user.name &&
        report.assignee.toLowerCase() === user.name.toLowerCase()) ||
      (report.assignee &&
        user.unit &&
        report.assignee.toLowerCase().includes(user.unit.toLowerCase()));
    const isCreator =
      (report.createdBy &&
        user._id &&
        report.createdBy.toString() === user._id.toString()) ||
      (report.reportedBy &&
        user.name &&
        report.reportedBy.toLowerCase() === user.name.toLowerCase());

    if (hasAssignee && !isAssigned && !isCreator) {
      const err = new Error(
        "Forbidden: Field workers can only transition reports assigned to them to In Progress.",
      );
      err.statusCode = 403;
      err.code = "FORBIDDEN";
      throw err;
    }
  }

  const prevStatus = report.status;
  report.status = check.normalizedTo;
  report.syncVersion += 1;
  await report.save();

  const noteSuffix = note?.trim() ? ` Note: ${note.trim()}` : "";
  const actorName =
    actor ||
    user?.name ||
    (roleToCheck === "COORDINATOR" ? "Coordinator" : "Field Worker");

  await logActivity({
    reportClientId: report.clientId,
    reportId: report._id,
    action: "STATUS_CHANGED",
    previousValue: prevStatus,
    newValue: report.status,
    description: `Workflow transitioned from "${prevStatus}" to "${report.status}".${noteSuffix}`,
    performedBy: actorName,
  });

  return report;
}

export async function assignReportCoordinator(
  identifier,
  { assignee, actor, syncVersion },
  user = null,
) {
  const report = await getReportById(identifier);

  if (syncVersion && report.syncVersion !== syncVersion) {
    const err = new Error(
      `Version conflict: Report is at version ${report.syncVersion}, but assignment expected version ${syncVersion}.`,
    );
    err.statusCode = 409;
    err.code = "VERSION_CONFLICT";
    err.details = {
      currentVersion: report.syncVersion,
      providedVersion: syncVersion,
    };
    throw err;
  }

  let nextStatus = report.status;
  if (report.status === "Submitted") {
    nextStatus = "Assigned";
  } else if (
    report.status === "Draft" ||
    report.status === "Resolved" ||
    report.status === "Rejected"
  ) {
    const err = new Error(
      `Cannot assign a report while in "${report.status}" status.`,
    );
    err.statusCode = 422;
    err.code = "INVALID_TRANSITION";
    throw err;
  }

  const prevAssignee = report.assignee;
  report.assignee = assignee.trim();
  report.status = nextStatus;
  report.syncVersion += 1;
  await report.save();

  const actorName = actor || user?.name || "Operations Coordinator";
  await logActivity({
    reportClientId: report.clientId,
    reportId: report._id,
    action: "REPORT_ASSIGNED",
    previousValue: prevAssignee,
    newValue: report.assignee,
    description: prevAssignee
      ? `Reassigned responsibility from "${prevAssignee}" to "${report.assignee}".`
      : `Assigned responsibility to "${report.assignee}" (moved to Assigned).`,
    performedBy: actorName,
  });

  return report;
}

export async function getDashboardMetrics() {
  const [
    total,
    drafts,
    submitted,
    assigned,
    inProgress,
    resolved,
    rejected,
    critical,
    high,
    unassigned,
  ] = await Promise.all([
    Report.countDocuments({}),
    Report.countDocuments({ status: "Draft" }),
    Report.countDocuments({ status: "Submitted" }),
    Report.countDocuments({ status: "Assigned" }),
    Report.countDocuments({ status: "In Progress" }),
    Report.countDocuments({ status: "Resolved" }),
    Report.countDocuments({ status: "Rejected" }),
    Report.countDocuments({ priority: "Critical" }),
    Report.countDocuments({ priority: "High" }),
    Report.countDocuments({ status: "Submitted", assignee: null }),
  ]);

  return {
    total,
    drafts,
    submitted,
    assigned,
    inProgress,
    resolved,
    rejected,
    critical,
    high,
    unassigned,
    activeOperations: submitted + assigned + inProgress,
  };
}
