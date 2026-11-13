import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { useNetwork } from "../../context/NetworkContext.jsx";
import { formatDateTime, formatRelativeTime } from "../../utils/formatters.js";
import { shortClientId } from "../../utils/id.js";
import { Button } from "../common/Button.jsx";
import { EmptyState } from "../common/EmptyState.jsx";
import {
  SyncStatusBadge,
  WorkflowStatusBadge,
} from "../common/StatusBadge.jsx";

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

  const [activeBucket, setActiveBucket] = useState("all");

  const reportsByClientId = Object.fromEntries(
    reports.map((r) => [r.clientId, r]),
  );

  const enrichedQueue = syncQueue
    .map((item) => ({
      ...item,
      report: reportsByClientId[item.reportClientId] || null,
    }))
    .filter((item) => item.report !== null);

  const pendingItems = enrichedQueue.filter((q) => q.status === "Pending");

  const syncingItems = enrichedQueue.filter((q) => q.status === "Syncing");

  const syncedItems = enrichedQueue.filter((q) => q.status === "Synchronized");

  const failedItems = enrichedQueue.filter((q) => q.status === "Failed");

  const syncedReportsWithoutQueue = reports.filter(
    (r) =>
      r.syncStatus === "Synchronized" &&
      !enrichedQueue.some((q) => q.reportClientId === r.clientId),
  );

  const actionableCount = pendingItems.length + failedItems.length;

  const displayedItems =
    activeBucket === "Pending"
      ? pendingItems
      : activeBucket === "Syncing"
        ? syncingItems
        : activeBucket === "Failed"
          ? failedItems
          : activeBucket === "Synchronized"
            ? syncedItems
            : enrichedQueue;

  const buckets = [
    { key: "all", label: "All Queue", count: enrichedQueue.length },
    { key: "Pending", label: "Pending", count: pendingItems.length },
    { key: "Failed", label: "Failed", count: failedItems.length },
    { key: "Syncing", label: "Syncing", count: syncingItems.length },
    { key: "Synchronized", label: "Synced", count: syncedItems.length },
  ];

  const summaryCards = [
    {
      label: "Pending",
      count: pendingItems.length,
      icon: Clock,
      color: "text-[#F4B64F]",
      background: "bg-[#F4B64F]/10",
    },
    {
      label: "Syncing",
      count: syncingItems.length,
      icon: Loader2,
      color: "text-[#BE732F]",
      background: "bg-[#BE732F]/10",
    },
    {
      label: "Synchronized",
      count: syncedItems.length + syncedReportsWithoutQueue.length,
      icon: CheckCircle2,
      color: "text-[#F4B64F]",
      background: "bg-[#F4B64F]/10",
    },
    {
      label: "Failed",
      count: failedItems.length,
      icon: CloudOff,
      color: "text-[#EFEEEC]",
      background: "bg-[#EFEEEC]/10",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Synchronization overview */}
      <section className="relative overflow-hidden rounded-[26px] border border-[#BE732F]/25 bg-[#0A0A0A] p-5 text-[#EFEEEC] shadow-[0_14px_40px_rgba(10,10,10,0.12)] sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-[#F4B64F]/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border border-[#BE732F]/15"
        />

        <div className="relative">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#EFEEEC]/10 bg-[#EFEEEC]/[0.06] px-3 py-1.5">
                {effectiveOnline ? (
                  <Wifi
                    className="h-3.5 w-3.5 text-[#F4B64F]"
                    aria-hidden="true"
                  />
                ) : (
                  <WifiOff
                    className="h-3.5 w-3.5 text-[#BE732F]"
                    aria-hidden="true"
                  />
                )}
                <span className="text-[10px] font-semibold tracking-[0.12em] text-[#EFEEEC]/75">
                  {effectiveOnline
                    ? "SYNC ADAPTER REACHABLE"
                    : "OFFLINE · DATA SAFELY STORED"}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                Synchronization Queue
              </h3>

              <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#EFEEEC]/55">
                Monitor local reports and manage their synchronization with the
                server.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#EFEEEC]/50">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Last attempt:{" "}
                  <span className="font-medium text-[#EFEEEC]/75">
                    {lastSyncAttempt
                      ? formatDateTime(lastSyncAttempt)
                      : "No batch run this session"}
                  </span>
                </span>
              </div>
            </div>

            <Button
              variant="emerald"
              size="md"
              className="shrink-0"
              disabled={isSyncing || actionableCount === 0}
              onClick={() => syncAll()}
            >
              <RefreshCw
                className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              <span>
                {isSyncing
                  ? "Synchronizing..."
                  : actionableCount > 0
                    ? `Synchronize All (${actionableCount})`
                    : "All Synced"}
              </span>
            </Button>
          </div>

          {/* Summary metrics */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-[#EFEEEC]/10 bg-[#EFEEEC]/[0.045] p-3.5 transition-colors hover:bg-[#EFEEEC]/[0.075]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.background}`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 ${card.color} ${
                          card.label === "Syncing" && isSyncing
                            ? "animate-spin"
                            : ""
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-[#EFEEEC]/60">
                      {card.label}
                    </span>
                  </div>

                  <p className="mt-3 font-display text-2xl font-bold tabular-nums text-[#EFEEEC]">
                    {card.count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testing controls */}
      <section className="rounded-[22px] border border-[#BE732F]/20 bg-white p-4 shadow-[0_6px_24px_rgba(85,47,11,0.035)] sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4B64F]/15 text-[#552F0B]">
              <WifiOff className="h-5 w-5" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#0A0A0A]">
                Simulation Controls
              </h4>
              <p className="mt-1 text-xs leading-5 text-[#552F0B]/65">
                Test offline queueing and retry safety without a live Express.js
                server.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => toggleSimulatedOffline()}
              aria-pressed={simulatedOffline}
              className={`min-h-[42px] cursor-pointer rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F] ${
                simulatedOffline
                  ? "border-[#BE732F]/45 bg-[#F4B64F]/20 text-[#552F0B]"
                  : "border-[#BE732F]/20 bg-[#EFEEEC] text-[#552F0B] hover:border-[#BE732F]/45 hover:bg-[#F4B64F]/10"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <WifiOff className="h-3.5 w-3.5" />
                {simulatedOffline
                  ? "Simulated Offline: ON"
                  : "Simulate Offline"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => toggleSimulatedFailSync()}
              aria-pressed={simulatedFailSync}
              className={`min-h-[42px] cursor-pointer rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F] ${
                simulatedFailSync
                  ? "border-[#552F0B]/45 bg-[#552F0B]/10 text-[#552F0B]"
                  : "border-[#BE732F]/20 bg-[#EFEEEC] text-[#552F0B] hover:border-[#BE732F]/45 hover:bg-[#F4B64F]/10"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                {simulatedFailSync
                  ? "Force Sync Failure: ON"
                  : "Simulate Server Error"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Queue filters */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-[#0A0A0A]">Queue Activity</h4>
            <p className="mt-1 text-xs text-[#552F0B]/55">
              Filter reports by synchronization state.
            </p>
          </div>

          <span className="rounded-lg border border-[#BE732F]/20 bg-white px-2.5 py-1.5 text-[10px] font-semibold tabular-nums text-[#552F0B]">
            {enrichedQueue.length} ITEMS
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-[#BE732F]/15 bg-[#0A0A0A]/[0.035] p-1.5">
          {buckets.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveBucket(tab.key)}
              aria-pressed={activeBucket === tab.key}
              className={`shrink-0 cursor-pointer rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F] ${
                activeBucket === tab.key
                  ? "bg-[#0A0A0A] text-[#F4B64F] shadow-sm"
                  : "text-[#552F0B]/65 hover:bg-white hover:text-[#0A0A0A]"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 tabular-nums ${
                  activeBucket === tab.key
                    ? "text-[#EFEEEC]/65"
                    : "text-[#BE732F]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Queue items */}
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
            const canRetry =
              item.status === "Pending" || item.status === "Failed";

            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-[22px] border border-[#BE732F]/15 bg-white p-4 shadow-[0_5px_22px_rgba(85,47,11,0.035)] transition-all duration-200 hover:border-[#BE732F]/35 hover:shadow-[0_10px_30px_rgba(85,47,11,0.075)] sm:p-5"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-medium tabular-nums text-[#552F0B]/55">
                        <span>{shortClientId(report.clientId)}</span>
                        <span>·</span>
                        <span>{item.operation}</span>
                        <span>·</span>
                        <span>
                          v{item.payloadVersion || report.syncVersion}
                        </span>

                        {report.serverId && (
                          <>
                            <span>·</span>
                            <span className="break-all font-semibold text-[#BE732F]">
                              {report.serverId}
                            </span>
                          </>
                        )}
                      </div>

                      <Link
                        to={`/reports/${report.clientId}`}
                        onClick={() => onNavigate?.()}
                        className="mt-2 block truncate text-sm font-bold tracking-tight text-[#0A0A0A] transition-colors hover:text-[#BE732F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F]"
                      >
                        {report.title}
                      </Link>

                      <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs leading-5 text-[#552F0B]/60">
                        <span>{report.location?.name}</span>
                        <span>·</span>
                        <span>
                          Attempts:{" "}
                          <span className="font-semibold tabular-nums text-[#0A0A0A]">
                            {item.attempts}
                          </span>
                        </span>

                        {item.lastAttemptAt && (
                          <>
                            <span>·</span>
                            <span>
                              Last try {formatRelativeTime(item.lastAttemptAt)}
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <WorkflowStatusBadge status={report.status} size="sm" />
                      <SyncStatusBadge syncStatus={item.status} size="sm" />
                    </div>
                  </div>

                  {/* Error details */}
                  {item.lastError && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#552F0B]/20 bg-[#552F0B]/[0.045] px-3.5 py-3 text-xs leading-5 text-[#552F0B]">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span className="min-w-0 break-words">
                        {item.lastError}
                      </span>
                    </div>
                  )}

                  {/* Retry actions */}
                  {canRetry && (
                    <div className="flex flex-col gap-3 border-t border-[#BE732F]/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-5 text-[#552F0B]/60">
                        {item.status === "Failed"
                          ? "Report preserved in IndexedDB; retry is idempotent."
                          : "Ready to transmit when connectivity is available."}
                      </p>

                      <Button
                        variant={
                          item.status === "Failed"
                            ? "danger-outline"
                            : "secondary"
                        }
                        size="sm"
                        className="shrink-0"
                        disabled={isSyncing}
                        onClick={() => retrySyncItem(item.id)}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>
                          {item.status === "Failed"
                            ? "Retry Sync"
                            : "Sync Item"}
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Previously synchronized reports */}
      {(activeBucket === "Synchronized" ||
        (!compact && activeBucket === "all")) &&
        syncedReportsWithoutQueue.length > 0 && (
          <section className="space-y-3 pt-2">
            <div>
              <h4 className="text-sm font-bold text-[#0A0A0A]">
                Previously Synchronized Reports
              </h4>
              <p className="mt-1 text-xs text-[#552F0B]/55">
                {syncedReportsWithoutQueue.length} historical reports
              </p>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[#BE732F]/15 bg-white divide-y divide-[#BE732F]/15">
              {syncedReportsWithoutQueue.map((rep) => (
                <Link
                  key={rep.clientId}
                  to={`/reports/${rep.clientId}`}
                  onClick={() => onNavigate?.()}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-[#F4B64F]/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F4B64F]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0A0A0A]">
                      {rep.title}
                    </p>

                    <p className="mt-1 break-all font-mono text-[10px] leading-5 tabular-nums text-[#552F0B]/55">
                      {rep.serverId} · v{rep.syncVersion} · {rep.location?.name}
                    </p>
                  </div>

                  <SyncStatusBadge syncStatus="Synchronized" size="sm" />
                </Link>
              ))}
            </div>
          </section>
        )}
    </div>
  );
}
