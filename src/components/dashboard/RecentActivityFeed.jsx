import { Activity, ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../../utils/formatters.js";

export function RecentActivityFeed({ activities, reports }) {
  const reportTitleMap = Object.fromEntries(
    reports.map((r) => [r.clientId, r.title]),
  );

  const items = activities.slice(0, 6);

  return (
    <section className="rounded-[24px] border border-[#BE732F]/15 bg-[#EFEEEC] p-5 shadow-[0_8px_30px_rgba(85,47,11,0.05)] sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#BE732F]">
            Audit trail
          </p>

          <h2 className="mt-1.5 text-base font-bold tracking-tight text-[#0A0A0A]">
            Recent Field Activity
          </h2>

          <p className="mt-1 text-xs text-[#552F0B]/55">
            Latest actions across field operations
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#BE732F]/15 bg-white/70 px-2.5 py-2">
          <Activity className="h-3.5 w-3.5 text-[#BE732F]" />
          <span className="text-xs font-bold tabular-nums text-[#552F0B]">
            {items.length}
          </span>
        </div>
      </div>

      {/* Activity Timeline */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#BE732F]/15 bg-white/70">
            <Clock3 className="h-5 w-5 text-[#BE732F]" />
          </div>

          <p className="mt-3 text-sm font-semibold text-[#552F0B]">
            No activity yet
          </p>

          <p className="mt-1 max-w-[220px] text-xs leading-5 text-[#552F0B]/55">
            Actions recorded in IndexedDB will appear here as your team works.
          </p>
        </div>
      ) : (
        <ol className="mt-6">
          {items.map((act, index) => {
            const reportTitle = reportTitleMap[act.reportClientId];
            const isLast = index === items.length - 1;

            return (
              <li key={act.id} className="relative flex gap-3 pb-5 last:pb-0">
                {/* Timeline */}
                <div className="relative flex w-3 shrink-0 justify-center">
                  <span className="relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#EFEEEC] bg-[#BE732F] shadow-[0_0_0_3px_rgba(244,182,79,0.18)]" />

                  {!isLast && (
                    <span className="absolute bottom-0 top-4 w-px bg-[#BE732F]/20" />
                  )}
                </div>

                {/* Activity content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <span className="truncate text-xs font-bold text-[#552F0B]">
                      {act.actor}
                    </span>

                    <span className="shrink-0 text-[10px] tabular-nums text-[#552F0B]/45">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-[1.7] text-[#0A0A0A]/75">
                    {act.message}
                  </p>

                  {reportTitle && (
                    <Link
                      to={`/reports/${act.reportClientId}`}
                      className="mt-2 inline-flex max-w-full items-center gap-1 rounded-lg border border-[#BE732F]/15 bg-white/65 px-2.5 py-1.5 text-[10px] font-semibold text-[#BE732F] transition-all hover:border-[#BE732F]/35 hover:bg-[#F4B64F]/15 hover:text-[#552F0B]"
                    >
                      <span className="truncate">{reportTitle}</span>
                      <ArrowUpRight className="h-3 w-3 shrink-0" />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
