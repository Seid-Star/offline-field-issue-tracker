import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  MapPin,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import {
  PriorityIndicator,
  SyncStatusBadge,
  WorkflowStatusBadge,
} from "../components/common/StatusBadge.jsx";
import { AssignmentModal } from "../components/coordinator/AssignmentModal.jsx";
import { AppShell } from "../components/layout/AppShell.jsx";
import { ActivityTimeline } from "../components/reports/ActivityTimeline.jsx";
import { WorkflowTransitionControls } from "../components/reports/WorkflowTransitionControls.jsx";
import { useApp } from "../context/AppContext.jsx";
import { formatCoordinates, formatDateTime } from "../utils/formatters.js";

function MetadataItem({ icon: Icon, label, children }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#552F0B]/55">
        <Icon className="h-4 w-4 shrink-0 text-[#BE732F]" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold leading-6 text-[#0A0A0A]">
        {children}
      </dd>
    </div>
  );
}

export function ReportDetails() {
  const { id } = useParams();

  const { reports, activities, syncQueue, retrySyncItem, isSyncing } = useApp();

  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const report = reports.find((r) => r.clientId === id);

  if (!report) {
    return (
      <AppShell
        title="Report Not Found"
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Reports", to: "/reports" },
          { label: "Not Found" },
        ]}
      >
        <div className="mx-auto max-w-2xl py-10">
          <EmptyState
            icon={ClipboardList}
            title="Report could not be located"
            description="This report may have been cleared from local storage or its identifier may be invalid. Your other locally stored reports remain accessible."
            action={
              <Link to="/reports">
                <Button variant="primary">
                  <ArrowLeft className="h-4 w-4" />
                  Return to All Reports
                </Button>
              </Link>
            }
          />
        </div>
      </AppShell>
    );
  }

  const reportActivities = activities.filter(
    (a) => a.reportClientId === report.clientId,
  );

  const queueEntry = syncQueue.find(
    (q) => q.reportClientId === report.clientId,
  );

  const coords = formatCoordinates(
    report.location?.latitude,
    report.location?.longitude,
  );

  const canRetrySync =
    report.status !== "Draft" &&
    queueEntry &&
    (queueEntry.status === "Pending" || queueEntry.status === "Failed");

  return (
    <AppShell
      title="Report Details"
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Reports", to: "/reports" },
        { label: report.title },
      ]}
    >
      <div className="space-y-6">
        {/* Navigation and actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/reports"
            className="group inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[#552F0B]/70 transition-colors hover:text-[#BE732F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Reports
          </Link>

          {canRetrySync && (
            <Button
              variant="emerald"
              size="sm"
              disabled={isSyncing}
              onClick={() => retrySyncItem(queueEntry.id)}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              <span>
                {queueEntry.status === "Failed"
                  ? "Retry Synchronization"
                  : "Synchronize Now"}
              </span>
            </Button>
          )}
        </div>

        {/* Report identity and overview */}
        <section className="relative overflow-hidden rounded-[28px] border border-[#BE732F]/20 bg-white shadow-[0_12px_38px_rgba(85,47,11,0.055)]">
          <div className="relative overflow-hidden bg-[#0A0A0A] px-5 py-6 text-[#EFEEEC] sm:px-7 sm:py-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-[#F4B64F]/15"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-5 -top-16 h-44 w-44 rounded-full border border-[#BE732F]/20"
            />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-[#F4B64F]/25 bg-[#F4B64F]/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#F4B64F]">
                    {report.category}
                  </span>

                  <span className="text-xs text-[#EFEEEC]/40">/</span>

                  <span className="font-mono text-[10px] text-[#EFEEEC]/55">
                    {report.clientId}
                  </span>
                </div>

                <PriorityIndicator priority={report.priority} />
              </div>

              <h2 className="mt-5 max-w-3xl font-display text-2xl font-bold leading-tight tracking-tight text-[#EFEEEC] text-balance sm:text-3xl">
                {report.title}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#EFEEEC]/65">
                {report.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <WorkflowStatusBadge status={report.status} />
                <SyncStatusBadge
                  syncStatus={report.syncStatus}
                  isDraft={report.status === "Draft"}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#EFEEEC]/10 pt-5 text-[11px] text-[#EFEEEC]/50">
                <span className="flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5 text-[#F4B64F]" />
                  Client ID: {report.clientId}
                </span>

                {report.serverId && (
                  <span className="flex items-center gap-1.5 break-all">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F4B64F]" />
                    Server ID: {report.serverId}
                  </span>
                )}

                <span className="font-mono">Version {report.syncVersion}</span>
              </div>
            </div>
          </div>

          {/* Report metadata */}
          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4B64F]/15 text-[#552F0B]">
                <ClipboardList className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0A0A0A]">
                  Report Information
                </h3>
                <p className="text-[11px] text-[#552F0B]/55">
                  Location, ownership, and reporting details
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-[#BE732F]/15 pt-5 sm:grid-cols-2 xl:grid-cols-4">
              <MetadataItem icon={MapPin} label="Location">
                {report.location?.name || "Location not provided"}

                {coords && (
                  <span className="mt-1 block break-all font-mono text-[10px] font-medium text-[#552F0B]/55">
                    GPS: {coords}
                  </span>
                )}
              </MetadataItem>

              <MetadataItem icon={Calendar} label="Observed & Created">
                {formatDateTime(report.reportedAt)}

                <span className="mt-1 block text-[11px] font-medium text-[#552F0B]/55">
                  Updated: {formatDateTime(report.updatedAt)}
                </span>
              </MetadataItem>

              <MetadataItem icon={UserCheck} label="Assigned Responsibility">
                {report.assignee || "Unassigned"}

                <span className="mt-1 block text-[11px] font-medium text-[#552F0B]/55">
                  Reported by {report.reportedBy || "Field Worker"}
                </span>
              </MetadataItem>

              <MetadataItem icon={RefreshCw} label="Synchronization Record">
                {report.status === "Draft"
                  ? "Local Draft Only"
                  : report.syncStatus}

                <span className="mt-1 block text-[11px] font-medium text-[#552F0B]/55">
                  {queueEntry
                    ? `Queue attempts: ${queueEntry.attempts}`
                    : report.serverId
                      ? "Acknowledged by adapter"
                      : "Not queued"}
                </span>
              </MetadataItem>
            </dl>
          </div>
        </section>

        {/* Workflow */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4B64F]/15 text-[#552F0B]">
              <RefreshCw className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#0A0A0A]">
                Workflow Management
              </h3>
              <p className="text-[11px] text-[#552F0B]/55">
                Track and manage report progress
              </p>
            </div>
          </div>

          <WorkflowTransitionControls
            report={report}
            onOpenAssignModal={() => setAssignModalOpen(true)}
          />
        </section>

        {/* Activity timeline */}
        <section className="rounded-[26px] border border-[#BE732F]/15 bg-white p-5 shadow-[0_8px_30px_rgba(85,47,11,0.035)] sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4B64F]/15 text-[#552F0B]">
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-display text-base font-bold text-[#0A0A0A]">
                  Activity &amp; Audit Timeline
                </h3>
                <p className="mt-1 text-xs text-[#552F0B]/55">
                  History of report changes and synchronization events
                </p>
              </div>
            </div>

            <span className="rounded-lg border border-[#BE732F]/20 bg-[#EFEEEC] px-3 py-1.5 font-mono text-[10px] font-semibold tabular-nums text-[#552F0B]">
              {reportActivities.length} EVENTS
            </span>
          </div>

          <div className="border-t border-[#BE732F]/15 pt-5">
            <ActivityTimeline activities={reportActivities} />
          </div>
        </section>
      </div>

      {/* Assignment modal */}
      <AssignmentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        report={report}
      />
    </AppShell>
  );
}
