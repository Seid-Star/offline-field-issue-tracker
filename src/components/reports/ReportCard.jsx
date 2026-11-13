import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatShortDate } from '../../utils/formatters.js';
import { shortClientId } from '../../utils/id.js';
import { PriorityIndicator, SyncStatusBadge, WorkflowStatusBadge } from '../common/StatusBadge.jsx';

export function ReportCard({ report }) {
  return (
    <Link
      to={`/reports/${report.clientId}`}
      className="group block rounded-2xl bg-white border border-[#123D35]/10 p-4 sm:p-5 transition-all duration-150 hover:border-[#123D35]/28 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A477]"
    >
      {/* Top unboxed metadata line */}
      <div className="flex items-center justify-between gap-2 text-xs text-[#71817B]">
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          <span className="font-medium text-[#123D35]">{report.category}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{shortClientId(report.clientId)}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{formatShortDate(report.reportedAt)}</span>
        </div>
        <PriorityIndicator priority={report.priority} />
      </div>

      {/* Primary Title */}
      <h3 className="mt-2 text-base font-semibold text-[#172B27] font-display group-hover:text-[#123D35] transition-colors line-clamp-1">
        {report.title}
      </h3>

      {/* Description */}
      <p className="mt-1 text-sm text-[#71817B] line-clamp-2 leading-relaxed">
        {report.description}
      </p>

      {/* Location */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#172B27]">
        <MapPin className="w-3.5 h-3.5 text-[#1B5B4C] shrink-0" aria-hidden="true" />
        <span className="truncate">{report.location?.name || 'Unspecified location'}</span>
      </div>

      {/* Footer Statuses */}
      <div className="mt-4 pt-3 border-t border-[#123D35]/8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <WorkflowStatusBadge status={report.status} size="sm" />
          <SyncStatusBadge
            syncStatus={report.syncStatus}
            isDraft={report.status === 'Draft'}
            size="sm"
          />
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#123D35] group-hover:translate-x-0.5 transition-transform">
          <span>Inspect</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
