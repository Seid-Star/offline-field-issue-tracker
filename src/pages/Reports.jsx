import { useState } from 'react';
import { ClipboardList, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import {
  PriorityIndicator,
  SyncStatusBadge,
  WorkflowStatusBadge,
} from '../components/common/StatusBadge.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ReportCard } from '../components/reports/ReportCard.jsx';
import { ReportFilters } from '../components/reports/ReportFilters.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useFilteredReports } from '../hooks/useFilteredReports.js';
import { formatShortDate } from '../utils/formatters.js';

export function Reports() {
  const { reports, globalSearch, setGlobalSearch } = useApp();

  const [filters, setFilters] = useState({
    category: 'All',
    priority: 'All',
    status: 'All',
    syncStatus: 'All',
    sortBy: 'newest',
  });
  const [viewMode, setViewMode] = useState('cards');

  const combinedFilters = {
    ...filters,
    search: globalSearch,
  };

  const filtered = useFilteredReports(reports, combinedFilters);

  const handleFilterChange = (patch) => {
    if ('search' in patch) {
      setGlobalSearch(patch.search);
      const { search: _ignored, ...rest } = patch;
      if (Object.keys(rest).length > 0) {
        setFilters((prev) => ({ ...prev, ...rest }));
      }
      return;
    }
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setGlobalSearch('');
    setFilters({
      category: 'All',
      priority: 'All',
      status: 'All',
      syncStatus: 'All',
      sortBy: 'newest',
    });
  };

  return (
    <AppShell
      title="Field Reports"
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'All Reports' }]}
    >
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-[#71817B]">
            Inspect locally persisted reports, filter by workflow or synchronization state, and open full timelines.
          </p>
          <Link to="/create" className="self-start sm:self-auto">
            <Button variant="primary">
              <PlusCircle className="w-4 h-4" />
              <span>New Report</span>
            </Button>
          </Link>
        </div>

        <ReportFilters
          filters={combinedFilters}
          onChange={handleFilterChange}
          onReset={handleReset}
          totalMatches={filtered.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No reports match your filters"
            description="Try clearing your search query or adjusting the category, workflow, or synchronization filters."
            action={
              <Button variant="secondary" onClick={handleReset}>
                Clear all filters
              </Button>
            }
          />
        ) : viewMode === 'table' ? (
          <div className="rounded-2xl bg-white border border-[#123D35]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#123D35]/10 bg-[#F5F7F5] text-[11px] font-semibold text-[#71817B]">
                    <th className="py-3 px-4">Issue &amp; Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Workflow</th>
                    <th className="py-3 px-4">Sync State</th>
                    <th className="py-3 px-4 text-right">Reported</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#123D35]/8 text-sm">
                  {filtered.map((report) => (
                    <tr
                      key={report.clientId}
                      className="hover:bg-[#F5F7F5]/70 transition-colors"
                    >
                      <td className="py-3 px-4 max-w-xs">
                        <Link
                          to={`/reports/${report.clientId}`}
                          className="font-semibold text-[#172B27] hover:text-[#123D35] block truncate"
                        >
                          {report.title}
                        </Link>
                        <span className="text-xs text-[#71817B]">{report.category}</span>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#172B27] max-w-[200px] truncate">
                        {report.location?.name}
                      </td>
                      <td className="py-3 px-4">
                        <PriorityIndicator priority={report.priority} />
                      </td>
                      <td className="py-3 px-4">
                        <WorkflowStatusBadge status={report.status} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <SyncStatusBadge
                          syncStatus={report.syncStatus}
                          isDraft={report.status === 'Draft'}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-[#71817B] font-mono tabular-nums whitespace-nowrap">
                        {formatShortDate(report.reportedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((report) => (
              <ReportCard key={report.clientId} report={report} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
