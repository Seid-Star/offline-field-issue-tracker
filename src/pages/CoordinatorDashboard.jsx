import { useMemo, useState } from 'react';
import {
  AlertOctagon,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import {
  PriorityIndicator,
  SyncStatusBadge,
  WorkflowStatusBadge,
} from '../components/common/StatusBadge.jsx';
import { AssignmentModal } from '../components/coordinator/AssignmentModal.jsx';
import { StatCard } from '../components/dashboard/StatCard.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ActivityTimeline } from '../components/reports/ActivityTimeline.jsx';
import { WorkflowTransitionControls } from '../components/reports/WorkflowTransitionControls.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatDateTime } from '../utils/formatters.js';

export function CoordinatorDashboard() {
  const { reports, activities, demoRole, switchRole } = useApp();

  const [activeQueueTab, setActiveQueueTab] = useState('review');
  const [selectedId, setSelectedId] = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);

  const submittedAwaitingReview = useMemo(
    () => reports.filter((r) => r.status === 'Submitted'),
    [reports]
  );

  const requiringAssignment = useMemo(
    () => reports.filter((r) => r.status === 'Submitted' && !r.assignee),
    [reports]
  );

  const inProgressReports = useMemo(
    () => reports.filter((r) => r.status === 'In Progress' || r.status === 'Assigned'),
    [reports]
  );

  const highPriorityOpen = useMemo(
    () =>
      reports.filter(
        (r) =>
          (r.priority === 'Critical' || r.priority === 'High') &&
          r.status !== 'Resolved' &&
          r.status !== 'Rejected' &&
          r.status !== 'Draft'
      ),
    [reports]
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

  return (
    <AppShell
      title="Coordinator Dispatch"
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Coordinator' }]}
    >
      <div className="space-y-5">
        {/* Role Simulation Notice */}
        {demoRole !== 'coordinator' && (
          <div className="glass-dark rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#16A477] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs leading-relaxed">
                <p className="font-semibold">Viewing as Field Worker (Demo Role)</p>
                <p className="text-white/75 mt-0.5">
                  Switch to the Operations Coordinator demo role to assign crews and advance report statuses.
                </p>
              </div>
            </div>
            <Button
              variant="emerald"
              size="sm"
              onClick={() => switchRole('coordinator')}
            >
              Switch to Coordinator
            </Button>
          </div>
        )}

        {/* Coordinator Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Awaiting Review"
            value={submittedAwaitingReview.length}
            caption="Submitted & ready for triage"
          />
          <StatCard
            label="Needs Assignment"
            value={requiringAssignment.length}
            caption="No field unit assigned"
            accent={requiringAssignment.length > 0 ? 'amber' : 'default'}
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
            accent={highPriorityOpen.length > 0 ? 'critical' : 'default'}
          />
        </div>

        {/* Queue Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EAEFEA] rounded-xl overflow-x-auto">
          {[
            { key: 'review', label: `Submitted (${submittedAwaitingReview.length})` },
            { key: 'unassigned', label: `Needs Assignment (${requiringAssignment.length})` },
            { key: 'active', label: `Assigned & In Progress (${inProgressReports.length})` },
            { key: 'urgent', label: `Critical & High (${highPriorityOpen.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveQueueTab(tab.key);
                setSelectedId(null);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeQueueTab === tab.key
                  ? 'bg-white text-[#172B27] shadow-sm'
                  : 'text-[#71817B] hover:text-[#172B27]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Master-Detail Coordinator Workspace */}
        {currentList.length === 0 ? (
          <EmptyState
            icon={AlertOctagon}
            title="No reports in this coordinator queue"
            description="Select another queue tab above or inspect all field reports."
            action={
              <Link to="/reports">
                <Button variant="secondary">Open All Reports</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* Queue List */}
            <div className="xl:col-span-5 space-y-2.5">
              {currentList.map((rep) => {
                const isSelected = selectedReport?.clientId === rep.clientId;
                return (
                  <button
                    key={rep.clientId}
                    type="button"
                    onClick={() => setSelectedId(rep.clientId)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#123D35] shadow-sm ring-1 ring-[#123D35]/20'
                        : 'bg-white border-[#123D35]/10 hover:border-[#123D35]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-[#71817B]">
                      <span className="font-medium text-[#123D35] truncate">{rep.category}</span>
                      <PriorityIndicator priority={rep.priority} />
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-[#172B27] font-display line-clamp-1">
                      {rep.title}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#71817B]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{rep.location?.name}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <WorkflowStatusBadge status={rep.status} size="sm" />
                        <SyncStatusBadge syncStatus={rep.syncStatus} size="sm" />
                      </div>
                      <span className="text-[11px] text-[#71817B] truncate">
                        {rep.assignee || 'Unassigned'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detail & Triage Inspector */}
            {selectedReport && (
              <div className="xl:col-span-7 space-y-4">
                <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#71817B]">
                        <span className="font-semibold text-[#123D35]">
                          {selectedReport.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          {formatDateTime(selectedReport.reportedAt)}
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg font-bold text-[#172B27] font-display">
                        {selectedReport.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {demoRole === 'coordinator' &&
                        (selectedReport.status === 'Submitted' ||
                          selectedReport.status === 'Assigned' ||
                          selectedReport.status === 'In Progress') && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setAssignTarget(selectedReport)}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>
                              {selectedReport.assignee ? 'Reassign' : 'Assign Crew'}
                            </span>
                          </Button>
                        )}
                      <Link to={`/reports/${selectedReport.clientId}`}>
                        <Button variant="ghost" size="sm">
                          <span>Full View</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <p className="text-sm text-[#172B27] leading-relaxed">
                    {selectedReport.description}
                  </p>

                  <div className="pt-3 border-t border-[#123D35]/8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[#71817B] block">Location</span>
                      <span className="font-medium text-[#172B27]">
                        {selectedReport.location?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#71817B] block">Responsible Unit</span>
                      <span className="font-medium text-[#172B27]">
                        {selectedReport.assignee || 'Not assigned yet'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#71817B] block">Sync State</span>
                      <span className="font-medium text-[#172B27]">
                        {selectedReport.syncStatus}
                      </span>
                    </div>
                  </div>
                </section>

                <WorkflowTransitionControls
                  report={selectedReport}
                  onOpenAssignModal={() => setAssignTarget(selectedReport)}
                />

                <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5">
                  <h4 className="text-sm font-semibold text-[#172B27] font-display mb-4">
                    Report Activity History
                  </h4>
                  <ActivityTimeline activities={selectedActivities} />
                </section>
              </div>
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
