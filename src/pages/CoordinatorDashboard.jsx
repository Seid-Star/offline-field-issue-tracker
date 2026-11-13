import { useMemo, useState } from "react";
import {
  AlertOctagon,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import {
  PriorityIndicator,
  SyncStatusBadge,
  WorkflowStatusBadge,
} from "../components/common/StatusBadge.jsx";
import { AssignmentModal } from "../components/coordinator/AssignmentModal.jsx";
import { StatCard } from "../components/dashboard/StatCard.jsx";
import { AppShell } from "../components/layout/AppShell.jsx";
import { ActivityTimeline } from "../components/reports/ActivityTimeline.jsx";
import { WorkflowTransitionControls } from "../components/reports/WorkflowTransitionControls.jsx";
import { useApp } from "../context/AppContext.jsx";
import { formatDateTime } from "../utils/formatters.js";

export function CoordinatorDashboard() {
  const { reports, activities, demoRole, switchRole } = useApp();

  const [activeQueueTab, setActiveQueueTab] = useState("review");
  const [selectedId, setSelectedId] = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);

  const submittedAwaitingReview = useMemo(
    () => reports.filter((r) => r.status === "Submitted"),
    [reports],
  );

  const requiringAssignment = useMemo(
    () => reports.filter((r) => r.status === "Submitted" && !r.assignee),
    [reports],
  );

  const inProgressReports = useMemo(
    () =>
      reports.filter(
        (r) => r.status === "In Progress" || r.status === "Assigned",
      ),
    [reports],
  );

  const highPriorityOpen = useMemo(
    () =>
      reports.filter(
        (r) =>
          (r.priority === "Critical" || r.priority === "High") &&
          r.status !== "Resolved" &&
          r.status !== "Rejected" &&
          r.status !== "Draft",
      ),
    [reports],
  );

  const tabLists = {
    review: submittedAwaitingReview,
    unassigned: requiringAssignment,
    active: inProgressReports,
    urgent: highPriorityOpen,
  };

  const currentList = tabLists[activeQueueTab] || submittedAwaitingReview;

  const selectedReport =
    reports.find((r) => r.clientId === selectedId) || currentList[0] || null;

  const selectedActivities = selectedReport
    ? activities.filter((a) => a.reportClientId === selectedReport.clientId)
    : [];

  const tabs = [
    {
      key: "review",
      label: `Submitted (${submittedAwaitingReview.length})`,
    },
    {
      key: "unassigned",
      label: `Needs Assignment (${requiringAssignment.length})`,
    },
    {
      key: "active",
      label: `Assigned & In Progress (${inProgressReports.length})`,
    },
    {
      key: "urgent",
      label: `Critical & High (${highPriorityOpen.length})`,
    },
  ];

  return (
    <AppShell
      title="Coordinator Dispatch"
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Coordinator" },
      ]}
    >
      <div className="space-y-6">
        {/* Role Notice */}
        {demoRole !== "coordinator" && (
          <section className="relative overflow-hidden rounded-2xl border border-[#BE732F]/30 bg-[#0A0A0A] p-5 text-[#EFEEEC] shadow-[0_12px_35px_rgba(85,47,11,0.12)]">
            <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full border border-[#F4B64F]/15" />
            <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full border border-[#BE732F]/20" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F4B64F]/25 bg-[#F4B64F]/10">
                  <ShieldCheck
                    className="h-5 w-5 text-[#F4B64F]"
                    aria-hidden="true"
                  />
                </div>

                <div className="max-w-xl">
                  <p className="text-sm font-semibold text-[#EFEEEC]">
                    Viewing as Field Worker
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[#EFEEEC]/65">
                    You are viewing the coordinator workspace with a field
                    worker account. Coordinator permissions require an
                    appropriately provisioned account.
                  </p>
                </div>
              </div>

              <Button
                variant="emerald"
                size="sm"
                onClick={() => switchRole("coordinator")}
              >
                Coordinator Access
              </Button>
            </div>
          </section>
        )}

        {/* Dashboard Overview */}
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#BE732F]">
                Operations Overview
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-[#0A0A0A]">
                Dispatch Summary
              </h2>
              <p className="mt-1 text-xs text-[#552F0B]/65">
                Monitor incoming issues and field team activity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              label="Awaiting Review"
              value={submittedAwaitingReview.length}
              caption="Submitted and ready for triage"
            />

            <StatCard
              label="Needs Assignment"
              value={requiringAssignment.length}
              caption="No field unit assigned"
              accent={requiringAssignment.length > 0 ? "amber" : "default"}
            />

            <StatCard
              label="Assigned & Active"
              value={inProgressReports.length}
              caption="Field teams deployed"
            />

            <StatCard
              label="High / Critical Open"
              value={highPriorityOpen.length}
              caption="Urgent infrastructure issues"
              accent={highPriorityOpen.length > 0 ? "critical" : "default"}
            />
          </div>
        </section>

        {/* Queue Navigation */}
        <section>
          <div className="mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#BE732F]">
              Work Management
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-[#0A0A0A]">
              Report Queues
            </h2>
          </div>

          <div className="flex gap-1.5 overflow-x-auto rounded-xl border border-[#BE732F]/15 bg-[#EFEEEC] p-1.5">
            {tabs.map((tab) => {
              const isActive = activeQueueTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveQueueTab(tab.key);
                    setSelectedId(null);
                  }}
                  aria-pressed={isActive}
                  className={`shrink-0 cursor-pointer whitespace-nowrap rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "border border-[#BE732F]/20 bg-[#0A0A0A] text-[#F4B64F] shadow-sm"
                      : "border border-transparent text-[#552F0B]/70 hover:border-[#BE732F]/20 hover:bg-white/70 hover:text-[#0A0A0A]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Master-Detail Workspace */}
        {currentList.length === 0 ? (
          <div className="rounded-2xl border border-[#BE732F]/15 bg-white p-5 shadow-[0_8px_30px_rgba(85,47,11,0.04)]">
            <EmptyState
              icon={AlertOctagon}
              title="No reports in this queue"
              description="There are currently no reports matching this queue. Select another queue or inspect all field reports."
              action={
                <Link to="/reports">
                  <Button variant="secondary">Open All Reports</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
            {/* Report Queue */}
            <section className="space-y-3 xl:col-span-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0A0A0A]">
                  Incoming Reports
                </h3>

                <span className="rounded-full border border-[#BE732F]/20 bg-[#F4B64F]/15 px-2.5 py-1 text-[11px] font-bold tabular-nums text-[#552F0B]">
                  {currentList.length} items
                </span>
              </div>

              {currentList.map((rep) => {
                const isSelected = selectedReport?.clientId === rep.clientId;

                return (
                  <button
                    key={rep.clientId}
                    type="button"
                    onClick={() => setSelectedId(rep.clientId)}
                    aria-pressed={isSelected}
                    className={`group w-full cursor-pointer rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#BE732F]/55 bg-[#EFEEEC] shadow-[0_8px_24px_rgba(85,47,11,0.09)] ring-1 ring-[#F4B64F]/35"
                        : "border-[#BE732F]/15 bg-white hover:-translate-y-0.5 hover:border-[#BE732F]/40 hover:shadow-[0_8px_24px_rgba(85,47,11,0.07)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[#BE732F]">
                        {rep.category}
                      </span>

                      <PriorityIndicator priority={rep.priority} />
                    </div>

                    <p className="mt-2 line-clamp-1 text-sm font-bold text-[#0A0A0A]">
                      {rep.title}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#552F0B]/65">
                      <MapPin
                        className="h-3.5 w-3.5 shrink-0 text-[#BE732F]"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {rep.location?.name || "Location not specified"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#BE732F]/10 pt-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <WorkflowStatusBadge status={rep.status} size="sm" />
                        <SyncStatusBadge
                          syncStatus={rep.syncStatus}
                          size="sm"
                        />
                      </div>

                      <span className="max-w-[130px] truncate text-[11px] font-medium text-[#552F0B]/65">
                        {rep.assignee || "Unassigned"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </section>

            {/* Selected Report Inspector */}
            {selectedReport && (
              <section className="min-w-0 space-y-4 xl:col-span-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#BE732F]">
                      Report Inspector
                    </p>
                    <h3 className="mt-1 text-sm font-bold text-[#0A0A0A]">
                      Selected Issue
                    </h3>
                  </div>

                  <span className="rounded-full border border-[#BE732F]/20 bg-[#EFEEEC] px-3 py-1.5 text-[11px] font-semibold text-[#552F0B]">
                    {selectedReport.status}
                  </span>
                </div>

                {/* Report Details */}
                <article className="overflow-hidden rounded-2xl border border-[#BE732F]/20 bg-white shadow-[0_10px_35px_rgba(85,47,11,0.05)]">
                  <div className="border-b border-[#BE732F]/15 bg-[#EFEEEC]/70 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold uppercase tracking-wide text-[#BE732F]">
                            {selectedReport.category}
                          </span>
                          <span className="text-[#552F0B]/35">•</span>
                          <span className="text-[#552F0B]/65 tabular-nums">
                            {formatDateTime(selectedReport.reportedAt)}
                          </span>
                        </div>

                        <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight text-[#0A0A0A]">
                          {selectedReport.title}
                        </h3>
                      </div>

                      <PriorityIndicator priority={selectedReport.priority} />
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#552F0B]/85">
                      {selectedReport.description}
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-[#BE732F]/15 bg-[#EFEEEC]/60 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#552F0B]/55">
                          Location
                        </span>
                        <p className="mt-1.5 text-xs font-semibold text-[#0A0A0A]">
                          {selectedReport.location?.name || "Not specified"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#BE732F]/15 bg-[#EFEEEC]/60 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#552F0B]/55">
                          Responsible Unit
                        </span>
                        <p className="mt-1.5 text-xs font-semibold text-[#0A0A0A]">
                          {selectedReport.assignee || "Not assigned yet"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#BE732F]/15 bg-[#EFEEEC]/60 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#552F0B]/55">
                          Synchronization
                        </span>
                        <p className="mt-1.5 break-words text-xs font-semibold text-[#0A0A0A]">
                          {selectedReport.syncStatus}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#BE732F]/15 pt-4">
                      {demoRole === "coordinator" &&
                        ["Submitted", "Assigned", "In Progress"].includes(
                          selectedReport.status,
                        ) && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setAssignTarget(selectedReport)}
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            <span>
                              {selectedReport.assignee
                                ? "Reassign Crew"
                                : "Assign Crew"}
                            </span>
                          </Button>
                        )}

                      <Link to={`/reports/${selectedReport.clientId}`}>
                        <Button variant="ghost" size="sm">
                          <span>Full Report</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>

                {/* Workflow Actions */}
                <WorkflowTransitionControls
                  report={selectedReport}
                  onOpenAssignModal={() => setAssignTarget(selectedReport)}
                />

                {/* Activity History */}
                <section className="rounded-2xl border border-[#BE732F]/20 bg-white p-5 shadow-[0_8px_30px_rgba(85,47,11,0.04)]">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#BE732F]">
                        Audit Trail
                      </p>
                      <h4 className="mt-1 text-sm font-bold text-[#0A0A0A]">
                        Report Activity History
                      </h4>
                    </div>

                    <span className="rounded-lg bg-[#EFEEEC] px-2.5 py-1.5 text-[11px] font-semibold text-[#552F0B]">
                      {selectedActivities.length} events
                    </span>
                  </div>

                  <ActivityTimeline activities={selectedActivities} />
                </section>
              </section>
            )}
          </div>
        )}
      </div>

      <AssignmentModal
        isOpen={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        report={assignTarget}
      />
    </AppShell>
  );
}
