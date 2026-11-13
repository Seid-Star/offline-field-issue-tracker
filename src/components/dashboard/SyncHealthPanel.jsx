import { ArrowRight, CheckCircle2, Clock, CloudOff, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useNetwork } from '../../context/NetworkContext.jsx';
import { formatRelativeTime } from '../../utils/formatters.js';
import { Button } from '../common/Button.jsx';

export function SyncHealthPanel() {
  const { stats, isSyncing, lastSyncAttempt, syncAll, setSyncDrawerOpen } = useApp();
  const { effectiveOnline } = useNetwork();

  const actionable = stats.pendingSync + stats.failedSync;
  const totalSubmittable = stats.total - stats.drafts;
  const syncRate =
    totalSubmittable > 0 ? Math.round((stats.synchronized / totalSubmittable) * 100) : 100;

  return (
    <section className="glass-dark rounded-2xl p-5 text-white flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold font-display">Synchronization Overview</h2>
          <span className="text-xs font-mono tabular-nums text-[#16A477]">
            {syncRate}% synced
          </span>
        </div>
        <p className="mt-1 text-xs text-white/70">
          {effectiveOnline
            ? 'Simulated backend adapter ready to receive queued reports.'
            : 'Offline mode — submitted reports wait safely in IndexedDB.'}
        </p>

        {/* Progress Track */}
        <div className="mt-4 h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#16A477] transition-all duration-300"
            style={{ width: `${syncRate}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5 text-xs">
          <div className="rounded-xl bg-white/8 border border-white/10 p-2.5">
            <div className="flex items-center gap-1 text-white/70">
              <Clock className="w-3.5 h-3.5 text-[#E6A23C]" aria-hidden="true" />
              <span>Pending</span>
            </div>
            <p className="mt-1 text-lg font-semibold font-display tabular-nums">
              {stats.pendingSync}
            </p>
          </div>
          <div className="rounded-xl bg-white/8 border border-white/10 p-2.5">
            <div className="flex items-center gap-1 text-white/70">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A477]" aria-hidden="true" />
              <span>Synced</span>
            </div>
            <p className="mt-1 text-lg font-semibold font-display tabular-nums">
              {stats.synchronized}
            </p>
          </div>
          <div className="rounded-xl bg-white/8 border border-white/10 p-2.5">
            <div className="flex items-center gap-1 text-white/70">
              <CloudOff className="w-3.5 h-3.5 text-[#DC5555]" aria-hidden="true" />
              <span>Failed</span>
            </div>
            <p className="mt-1 text-lg font-semibold font-display tabular-nums">
              {stats.failedSync}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/12 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] text-white/65 tabular-nums">
          {lastSyncAttempt
            ? `Last sync ${formatRelativeTime(lastSyncAttempt)}`
            : 'Simulated sync adapter'}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={() => setSyncDrawerOpen(true)}
          >
            <span>Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="emerald"
            size="sm"
            disabled={isSyncing || actionable === 0}
            onClick={() => syncAll()}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{actionable > 0 ? `Sync (${actionable})` : 'Up to date'}</span>
          </Button>
        </div>
      </div>

      <div className="mt-2.5">
        <Link
          to="/sync"
          className="text-[11px] text-white/70 hover:text-white underline underline-offset-2"
        >
          Open full Synchronization Center
        </Link>
      </div>
    </section>
  );
}
