import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CloudOff,
  Loader2,
  RefreshCw,
  RotateCcw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useNetwork } from '../../context/NetworkContext.jsx';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters.js';
import { shortClientId } from '../../utils/id.js';
import { Button } from '../common/Button.jsx';
import { EmptyState } from '../common/EmptyState.jsx';
import { SyncStatusBadge, WorkflowStatusBadge } from '../common/StatusBadge.jsx';

export function SyncCenterPanel({ compact = false, onNavigate }) {
  const {
    reports,
    syncQueue,
    isSyncing,
    lastSyncAttempt,
    syncAll,
    retrySyncItem,
  } = useApp();
  const {
    effectiveOnline,
    simulatedOffline,
    simulatedFailSync,
    toggleSimulatedOffline,
    toggleSimulatedFailSync,
  } = useNetwork();

  const [activeBucket, setActiveBucket] = useState('all');

  const reportsByClientId = Object.fromEntries(reports.map((r) => [r.clientId, r]));

  const enrichedQueue = syncQueue
    .map((item) => ({
      ...item,
      report: reportsByClientId[item.reportClientId] || null,
    }))
    .filter((item) => item.report !== null);

  const pendingItems = enrichedQueue.filter((q) => q.status === 'Pending');
  const syncingItems = enrichedQueue.filter((q) => q.status === 'Syncing');
  const syncedItems = enrichedQueue.filter((q) => q.status === 'Synchronized');
  const failedItems = enrichedQueue.filter((q) => q.status === 'Failed');

  // Also capture any Synchronized reports that were seeded directly without a queue entry
  const syncedReportsWithoutQueue = reports.filter(
    (r) =>
      r.syncStatus === 'Synchronized' &&
      !enrichedQueue.some((q) => q.reportClientId === r.clientId)
  );

  const actionableCount = pendingItems.length + failedItems.length;

  const displayedItems =
    activeBucket === 'Pending'
      ? pendingItems
      : activeBucket === 'Syncing'
        ? syncingItems
        : activeBucket === 'Failed'
          ? failedItems
          : activeBucket === 'Synchronized'
            ? syncedItems
            : enrichedQueue;

  return (
    <div className="space-y-5">
      {/* Liquid Dark Glass Summary Header */}
      <div className="glass-dark rounded-2xl p-5 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/75">
              {effectiveOnline ? (
                <Wifi className="w-3.5 h-3.5 text-[#16A477]" aria-hidden="true" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-[#E6A23C]" aria-hidden="true" />
              )}
              <span>
                {effectiveOnline
                  ? 'Simulated Sync Adapter Reachable'
                  : 'Offline — Reports Queued Safely in IndexedDB'}
              </span>
            </div>
            <h3 className="mt-1 text-lg font-semibold font-display tracking-tight">
              Synchronization Queue
            </h3>
            <p className="mt-1 text-xs text-white/70 tabular-nums">
              Last attempt: {lastSyncAttempt ? formatDateTime(lastSyncAttempt) : 'No batch run this session'}
            </p>
          </div>

          <Button
            variant="emerald"
            size="md"
            disabled={isSyncing || actionableCount === 0}
            onClick={() => syncAll()}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>
              {isSyncing
                ? 'Synchronizing...'
                : actionableCount > 0
                  ? `Synchronize All (${actionableCount})`
                  : 'All Synced'}
            </span>
          </Button>
        </div>

        {/* 4 Sync Buckets Summary */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-white/70">
              <Clock className="w-3.5 h-3.5 text-[#E6A23C]" aria-hidden="true" />
              <span>Pending</span>
            </div>
            <p className="mt-1 text-xl font-semibold tabular-nums font-display">
              {pendingItems.length}
            </p>
          </div>
          <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-white/70">
              <Loader2 className={`w-3.5 h-3.5 text-white ${isSyncing ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>Syncing</span>
            </div>
            <p className="mt-1 text-xl font-semibold tabular-nums font-display">
              {syncingItems.length}
            </p>
          </div>
          <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-white/70">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A477]" aria-hidden="true" />
              <span>Synchronized</span>
            </div>
            <p className="mt-1 text-xl font-semibold tabular-nums font-display">
              {syncedItems.length + syncedReportsWithoutQueue.length}
            </p>
          </div>
          <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-white/70">
              <CloudOff className="w-3.5 h-3.5 text-[#DC5555]" aria-hidden="true" />
              <span>Failed</span>
            </div>
            <p className="mt-1 text-xl font-semibold tabular-nums font-display">
              {failedItems.length}
            </p>
          </div>
        </div>
      </div>

      {/* Simulation Controls for Testing Offline & Retry Behavior */}
      <div className="rounded-2xl bg-white border border-[#123D35]/10 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#172B27]">
              Frontend Simulation Controls
            </p>
            <p className="text-xs text-[#71817B] mt-0.5">
              Test offline queueing and retry safety without a live Express.js server.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => toggleSimulatedOffline()}
              aria-pressed={simulatedOffline}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                simulatedOffline
                  ? 'bg-[#E6A23C]/15 border-[#E6A23C]/40 text-[#8A5708]'
                  : 'bg-[#F5F7F5] border-[#123D35]/12 text-[#172B27] hover:bg-[#EAEFEA]'
              }`}
            >
              {simulatedOffline ? 'Simulated Offline: ON' : 'Simulate Offline'}
            </button>
            <button
              type="button"
              onClick={() => toggleSimulatedFailSync()}
              aria-pressed={simulatedFailSync}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                simulatedFailSync
                  ? 'bg-[#DC5555]/14 border-[#DC5555]/40 text-[#B23B3B]'
                  : 'bg-[#F5F7F5] border-[#123D35]/12 text-[#172B27] hover:bg-[#EAEFEA]'
              }`}
            >
              {simulatedFailSync ? 'Force Sync Failure: ON' : 'Simulate Server Error'}
            </button>
          </div>
        </div>
      </div>

      {/* Bucket Filter Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-[#EAEFEA] rounded-xl overflow-x-auto">
        {[
          { key: 'all', label: `All Queue (${enrichedQueue.length})` },
          { key: 'Pending', label: `Pending (${pendingItems.length})` },
          { key: 'Failed', label: `Failed (${failedItems.length})` },
          { key: 'Syncing', label: `Syncing (${syncingItems.length})` },
          { key: 'Synchronized', label: `Synced (${syncedItems.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveBucket(tab.key)}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeBucket === tab.key
                ? 'bg-white text-[#172B27] shadow-sm'
                : 'text-[#71817B] hover:text-[#172B27]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Queue Items */}
      {displayedItems.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No items in this synchronization state"
          description="Submitted reports enter the local sync queue automatically. Drafts stay local until submitted."
        />
      ) : (
        <div className="space-y-3">
          {displayedItems.map((item) => {
            const { report } = item;
            const canRetry = item.status === 'Pending' || item.status === 'Failed';
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-[#123D35]/10 p-4 flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#71817B] font-mono tabular-nums">
                      <span>{shortClientId(report.clientId)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.operation}</span>
                      <span aria-hidden="true">·</span>
                      <span>v{item.payloadVersion || report.syncVersion}</span>
                      {report.serverId && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#16A477] font-medium">{report.serverId}</span>
                        </>
                      )}
                    </div>
                    <Link
                      to={`/reports/${report.clientId}`}
                      onClick={() => onNavigate?.()}
                      className="mt-1 block text-sm font-semibold text-[#172B27] hover:text-[#123D35] transition-colors truncate"
                    >
                      {report.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-[#71817B]">
                      {report.location?.name} · Attempts: <span className="tabular-nums font-medium">{item.attempts}</span>
                      {item.lastAttemptAt && ` · Last try ${formatRelativeTime(item.lastAttemptAt)}`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <WorkflowStatusBadge status={report.status} size="sm" />
                    <SyncStatusBadge syncStatus={item.status} size="sm" />
                  </div>
                </div>

                {item.lastError && (
                  <div className="rounded-xl bg-[#DC5555]/8 border border-[#DC5555]/20 px-3 py-2 flex items-start gap-2 text-xs text-[#B23B3B]">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item.lastError}</span>
                  </div>
                )}

                {canRetry && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#123D35]/8">
                    <span className="text-xs text-[#71817B]">
                      {item.status === 'Failed'
                        ? 'Report preserved in IndexedDB; retry is idempotent.'
                        : 'Ready to transmit when connectivity is available.'}
                    </span>
                    <Button
                      variant={item.status === 'Failed' ? 'danger-outline' : 'secondary'}
                      size="sm"
                      disabled={isSyncing}
                      onClick={() => retrySyncItem(item.id)}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{item.status === 'Failed' ? 'Retry Sync' : 'Sync Item'}</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Also list synchronized historical reports when viewing Synchronized bucket */}
      {(activeBucket === 'Synchronized' || (!compact && activeBucket === 'all')) &&
        syncedReportsWithoutQueue.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-[#71817B] mb-2.5">
              Previously Synchronized Reports ({syncedReportsWithoutQueue.length})
            </h4>
            <div className="rounded-2xl bg-white border border-[#123D35]/10 divide-y divide-[#123D35]/8">
              {syncedReportsWithoutQueue.map((rep) => (
                <Link
                  key={rep.clientId}
                  to={`/reports/${rep.clientId}`}
                  onClick={() => onNavigate?.()}
                  className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#F5F7F5] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#172B27] truncate">{rep.title}</p>
                    <p className="text-xs text-[#71817B] font-mono tabular-nums mt-0.5">
                      {rep.serverId} · v{rep.syncVersion} · {rep.location?.name}
                    </p>
                  </div>
                  <SyncStatusBadge syncStatus="Synchronized" size="sm" />
                </Link>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
