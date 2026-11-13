import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/formatters.js';

export function RecentActivityFeed({ activities, reports }) {
  const reportTitleMap = Object.fromEntries(reports.map((r) => [r.clientId, r.title]));
  const items = activities.slice(0, 6);

  return (
    <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-base font-semibold text-[#172B27] font-display">
          Recent Field Activity
        </h2>
        <span className="text-xs text-[#71817B] tabular-nums">
          Latest {items.length} events
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[#71817B] py-6 text-center">
          No activity recorded in IndexedDB yet.
        </p>
      ) : (
        <ol className="divide-y divide-[#123D35]/8">
          {items.map((act) => {
            const reportTitle = reportTitleMap[act.reportClientId];
            return (
              <li key={act.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xs font-semibold text-[#123D35]">{act.actor}</span>
                  <span className="text-[11px] text-[#71817B] tabular-nums shrink-0">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#172B27] leading-relaxed">
                  {act.message}
                </p>
                {reportTitle && (
                  <Link
                    to={`/reports/${act.reportClientId}`}
                    className="mt-1 inline-block text-[11px] font-medium text-[#1B5B4C] hover:underline truncate max-w-full"
                  >
                    {reportTitle}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
