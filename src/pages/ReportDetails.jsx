import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import {
  PriorityIndicator,
  SyncStatusBadge,
  WorkflowStatusBadge,
} from '../components/common/StatusBadge.jsx';
import { AssignmentModal } from '../components/coordinator/AssignmentModal.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ActivityTimeline } from '../components/reports/ActivityTimeline.jsx';
import { WorkflowTransitionControls } from '../components/reports/WorkflowTransitionControls.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatCoordinates, formatDateTime } from '../utils/formatters.js';

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
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Reports', to: '/reports' },
          { label: 'Not Found' },
        ]}
      >
        <EmptyState
          title="Report could not be located in IndexedDB"
          description="It may have been cleared from local storage or the identifier is invalid."
          action={
            <Link to="/reports">
              <Button variant="primary">Return to All Reports</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  const reportActivities = activities.filter((a) => a.reportClientId === report.clientId);
  const queueEntry = syncQueue.find((q) => q.reportClientId === report.clientId);
  const coords = formatCoordinates(report.location?.latitude, report.location?.longitude);
  const canRetrySync =
    report.status !== 'Draft' &&
    queueEntry &&
    (queueEntry.status === 'Pending' || queueEntry.status === 'Failed');

  return (
    <AppShell
      title="Report Details"
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Reports', to: '/reports' },
        { label: report.title },
      ]}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/reports"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#123D35] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Reports</span>
          </Link>

          {canRetrySync && (
            <Button
              variant="emerald"
              size="sm"
              disabled={isSyncing}
              onClick={() => retrySyncItem(queueEntry.id)}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{queueEntry.status === 'Failed' ? 'Retry Sync' : 'Sync Now'}</span>
            </Button>
          )}
        </div>

        {/* Main Header & Details Card */}
        <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#71817B]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#123D35]">{report.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">clientId: {report.clientId}</span>
              {report.serverId && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[#16A477] font-medium">
                    serverId: {report.serverId}
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">v{report.syncVersion}</span>
            </div>
            <PriorityIndicator priority={report.priority} />
          </div>

          <h2 className="mt-2.5 text-xl sm:text-2xl font-bold text-[#172B27] font-display text-balance">
            {report.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <WorkflowStatusBadge status={report.status} />
            <SyncStatusBadge
              syncStatus={report.syncStatus}
              isDraft={report.status === 'Draft'}
            />
          </div>

          <p className="mt-4 text-sm sm:text-base text-[#172B27] leading-relaxed max-w-3xl">
            {report.description}
          </p>

          {/* Structured Metadata Grid */}
          <dl className="mt-6 pt-5 border-t border-[#123D35]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <dt className="text-[#71817B] font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1B5B4C]" aria-hidden="true" />
                Location
              </dt>
              <dd className="mt-1 text-sm font-medium text-[#172B27]">
                {report.location?.name}
              </dd>
              {coords && (
                <dd className="mt-0.5 font-mono text-[11px] text-[#71817B] tabular-nums">
                  GPS: {coords}
                </dd>
              )}
            </div>

            <div>
              <dt className="text-[#71817B] font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1B5B4C]" aria-hidden="true" />
                Observed &amp; Created
              </dt>
              <dd className="mt-1 text-sm font-medium text-[#172B27] tabular-nums">
                {formatDateTime(report.reportedAt)}
              </dd>
              <dd className="mt-0.5 text-[11px] text-[#71817B] tabular-nums">
                Updated: {formatDateTime(report.updatedAt)}
              </dd>
            </div>

            <div>
              <dt className="text-[#71817B] font-medium flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#1B5B4C]" aria-hidden="true" />
                Assigned Responsibility
              </dt>
              <dd className="mt-1 text-sm font-medium text-[#172B27]">
                {report.assignee || 'Unassigned'}
              </dd>
              <dd className="mt-0.5 text-[11px] text-[#71817B]">
                Reported by {report.reportedBy || 'Field Worker'}
              </dd>
            </div>

            <div>
              <dt className="text-[#71817B] font-medium">Synchronization Record</dt>
              <dd className="mt-1 text-sm font-medium text-[#172B27]">
                {report.status === 'Draft' ? 'Local Draft Only' : report.syncStatus}
              </dd>
              <dd className="mt-0.5 text-[11px] text-[#71817B] tabular-nums">
                {queueEntry
                  ? `Queue attempts: ${queueEntry.attempts}`
                  : report.serverId
                    ? 'Acknowledged by adapter'
                    : 'Not queued'}
              </dd>
            </div>
          </dl>
        </section>

        {/* Workflow Transition Rules & Controls */}
        <WorkflowTransitionControls
          report={report}
          onOpenAssignModal={() => setAssignModalOpen(true)}
        />

        {/* Activity Timeline */}
        <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="text-base font-semibold text-[#172B27] font-display">
                Activity &amp; Audit Timeline
              </h3>
              <p className="text-xs text-[#71817B]">
                Chronological history of local saves, sync attempts, and coordinator actions
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-[#71817B]">
              {reportActivities.length} events
            </span>
          </div>
          <ActivityTimeline activities={reportActivities} />
        </section>
      </div>

      <AssignmentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        report={report}
      />
    </AppShell>
  );
}
