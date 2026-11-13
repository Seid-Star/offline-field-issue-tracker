import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatShortDate } from "../../utils/formatters.js";
import { shortClientId } from "../../utils/id.js";
import {
  PriorityIndicator,
  SyncStatusBadge,
  WorkflowStatusBadge,
} from "../common/StatusBadge.jsx";

export function ReportCard({ report }) {
  return (
    <Link
      to={`/reports/${report.clientId}`}
      className="group relative block overflow-hidden rounded-[22px] border border-[#BE732F]/15 bg-[#EFEEEC] p-4 shadow-[0_5px_20px_rgba(85,47,11,0.035)] transition-all duration-200 hover:-translate-y-1 hover:border-[#BE732F]/40 hover:shadow-[0_14px_32px_rgba(85,47,11,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F] focus-visible:ring-offset-2 sm:p-5"
    >
      {/* Subtle top accent */}
      <div className="absolute left-0 top-0 h-[3px] w-0 bg-[#F4B64F] transition-all duration-300 group-hover:w-full" />

      {/* Metadata */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 text-[10px] font-medium text-[#552F0B]/55">
          <span className="font-bold text-[#BE732F]">{report.category}</span>

          <span aria-hidden="true">·</span>

          <span className="font-mono tabular-nums">
            {shortClientId(report.clientId)}
          </span>

          <span aria-hidden="true">·</span>

          <span className="inline-flex items-center gap-1 tabular-nums">
            <CalendarDays className="h-3 w-3" aria-hidden="true" />
            {formatShortDate(report.reportedAt)}
          </span>
        </div>

        <div className="shrink-0">
          <PriorityIndicator priority={report.priority} />
        </div>
      </div>

      {/* Report Information */}
      <div className="mt-4">
        <h3 className="line-clamp-1 text-base font-bold tracking-tight text-[#0A0A0A] transition-colors group-hover:text-[#BE732F]">
          {report.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs leading-[1.8] text-[#552F0B]/65">
          {report.description}
        </p>
      </div>

      {/* Location */}
      <div className="mt-4 flex min-w-0 items-center gap-2 rounded-xl border border-[#BE732F]/10 bg-white/55 px-3 py-2.5">
        <MapPin
          className="h-3.5 w-3.5 shrink-0 text-[#BE732F]"
          aria-hidden="true"
        />

        <span className="truncate text-xs font-medium text-[#552F0B]/75">
          {report.location?.name || "Unspecified location"}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#BE732F]/15 pt-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <WorkflowStatusBadge status={report.status} size="sm" />

          <SyncStatusBadge
            syncStatus={report.syncStatus}
            isDraft={report.status === "Draft"}
            size="sm"
          />
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-bold text-[#BE732F] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#552F0B]">
          Inspect
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
