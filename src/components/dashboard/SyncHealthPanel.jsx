import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CloudOff,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { useNetwork } from "../../context/NetworkContext.jsx";
import { formatRelativeTime } from "../../utils/formatters.js";
import { Button } from "../common/Button.jsx";

export function SyncHealthPanel() {
  const { stats, isSyncing, lastSyncAttempt, syncAll, setSyncDrawerOpen } =
    useApp();

  const { effectiveOnline } = useNetwork();

  const actionable = stats.pendingSync + stats.failedSync;
  const totalSubmittable = stats.total - stats.drafts;

  const syncRate =
    totalSubmittable > 0
      ? Math.round((stats.synchronized / totalSubmittable) * 100)
      : 100;

  const syncStatus = !effectiveOnline
    ? "Offline"
    : actionable > 0
      ? "Synchronization pending"
      : "All caught up";

  const metrics = [
    {
      label: "Pending",
      value: stats.pendingSync,
      icon: Clock,
      iconColor: "text-[#F4B64F]",
    },
    {
      label: "Synced",
      value: stats.synchronized,
      icon: CheckCircle2,
      iconColor: "text-[#BE732F]",
    },
    {
      label: "Failed",
      value: stats.failedSync,
      icon: CloudOff,
      iconColor: "text-[#EFEEEC]/70",
    },
  ];

  return (
    <section className="relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#BE732F]/25 bg-[#0A0A0A] p-5 text-[#EFEEEC] shadow-[0_12px_35px_rgba(10,10,10,0.16)] sm:p-6">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-[#F4B64F]/10" />
      <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full border border-[#BE732F]/15" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-[#BE732F]/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#F4B64F]">
              System health
            </p>

            <h2 className="mt-1.5 text-base font-bold tracking-tight text-[#EFEEEC]">
              Synchronization Overview
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-[#EFEEEC]/55">
              Monitor your local report queue and synchronization progress
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#F4B64F]/20 bg-[#F4B64F]/10 px-2.5 py-1.5">
            {effectiveOnline ? (
              <Wifi className="h-3 w-3 text-[#F4B64F]" />
            ) : (
              <WifiOff className="h-3 w-3 text-[#BE732F]" />
            )}

            <span className="text-[9px] font-bold uppercase tracking-wide text-[#F4B64F]">
              {effectiveOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Synchronization Rate */}
        <div className="mt-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#EFEEEC]/50">
                Overall sync rate
              </p>

              <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums text-[#F4B64F]">
                {syncRate}
                <span className="ml-0.5 text-xl">%</span>
              </p>
            </div>

            <span className="mb-1 text-right text-[10px] font-medium text-[#EFEEEC]/55">
              {stats.synchronized} of {totalSubmittable}
              <br />
              submitted reports
            </span>
          </div>

          <div
            className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#EFEEEC]/10"
            role="progressbar"
            aria-label="Synchronization progress"
            aria-valuenow={syncRate}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#BE732F] to-[#F4B64F] transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, syncRate))}%` }}
            />
          </div>

          <p className="mt-2.5 text-[10px] font-medium text-[#EFEEEC]/55">
            {effectiveOnline
              ? "Synchronization service is reachable."
              : "Reports are safely stored locally until connectivity returns."}
          </p>
        </div>

        {/* Queue Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="rounded-2xl border border-[#EFEEEC]/10 bg-[#EFEEEC]/[0.045] p-3 transition-colors hover:bg-[#EFEEEC]/[0.08]"
              >
                <div className="flex flex-col gap-2">
                  <Icon
                    className={`h-4 w-4 ${metric.iconColor}`}
                    aria-hidden="true"
                  />

                  <span className="text-[10px] font-medium text-[#EFEEEC]/55">
                    {metric.label}
                  </span>
                </div>

                <p className="mt-2 text-xl font-bold tabular-nums text-[#EFEEEC]">
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer and Actions */}
      <div className="relative mt-6 border-t border-[#EFEEEC]/10 pt-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#EFEEEC]/45">
                Current status
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-[#EFEEEC]/85">
                {isSyncing ? "Synchronizing reports..." : syncStatus}
              </p>
            </div>

            <span className="shrink-0 rounded-lg border border-[#BE732F]/20 bg-[#BE732F]/10 px-2.5 py-1.5 text-[9px] font-semibold text-[#F4B64F]">
              {isSyncing ? "IN PROGRESS" : "LOCAL QUEUE"}
            </span>
          </div>

          <p className="text-[10px] text-[#EFEEEC]/45">
            {lastSyncAttempt
              ? `Last sync attempt ${formatRelativeTime(lastSyncAttempt)}`
              : "No synchronization attempt recorded yet"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setSyncDrawerOpen(true)}
            >
              <span>View Queue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={isSyncing || actionable === 0}
              onClick={() => syncAll()}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              <span>
                {isSyncing
                  ? "Syncing..."
                  : actionable > 0
                    ? `Sync (${actionable})`
                    : "Up to date"}
              </span>
            </Button>
          </div>

          <Link
            to="/sync"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#F4B64F]/75 transition-colors hover:text-[#F4B64F]"
          >
            Open Synchronization Center
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
