import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
  CATEGORIES,
  PRIORITIES,
  SYNC_STATUSES,
  WORKFLOW_STATUSES,
} from '../../utils/constants.js';

export function ReportFilters({
  filters,
  onChange,
  onReset,
  totalMatches,
  viewMode,
  onViewModeChange,
}) {
  const hasActiveFilters =
    filters.search ||
    filters.category !== 'All' ||
    filters.priority !== 'All' ||
    filters.status !== 'All' ||
    filters.syncStatus !== 'All';

  return (
    <div className="rounded-2xl bg-white border border-[#123D35]/10 p-4 space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-[#71817B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search by title, description, location, or report ID..."
            aria-label="Filter reports by keyword"
            className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/12 text-sm text-[#172B27] placeholder:text-[#71817B] focus:outline-none focus:ring-2 focus:ring-[#16A477] focus:bg-white"
          />
        </div>

        {/* Select Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-2">
          <select
            aria-label="Filter by category"
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="h-11 px-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/12 text-xs font-medium text-[#172B27] focus:outline-none focus:ring-2 focus:ring-[#16A477]"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by priority"
            value={filters.priority}
            onChange={(e) => onChange({ priority: e.target.value })}
            className="h-11 px-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/12 text-xs font-medium text-[#172B27] focus:outline-none focus:ring-2 focus:ring-[#16A477]"
          >
            <option value="All">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by workflow status"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
            className="h-11 px-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/12 text-xs font-medium text-[#172B27] focus:outline-none focus:ring-2 focus:ring-[#16A477]"
          >
            <option value="All">All Statuses</option>
            {WORKFLOW_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by synchronization status"
            value={filters.syncStatus}
            onChange={(e) => onChange({ syncStatus: e.target.value })}
            className="h-11 px-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/12 text-xs font-medium text-[#172B27] focus:outline-none focus:ring-2 focus:ring-[#16A477]"
          >
            <option value="All">All Sync States</option>
            {SYNC_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Row: Result Count, Sort, View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#123D35]/8">
        <div className="flex items-center gap-3 text-xs text-[#71817B]">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#172B27] tabular-nums">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#123D35]" aria-hidden="true" />
            {totalMatches} report{totalMatches === 1 ? '' : 's'}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#123D35] hover:underline cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="report-sort" className="text-xs text-[#71817B]">
            Sort:
          </label>
          <select
            id="report-sort"
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value })}
            className="h-9 px-2.5 rounded-lg bg-[#F5F7F5] border border-[#123D35]/12 text-xs font-medium text-[#172B27] focus:outline-none focus:ring-2 focus:ring-[#16A477]"
          >
            <option value="newest">Newest Reported</option>
            <option value="oldest">Oldest Reported</option>
            <option value="priority">Highest Priority</option>
            <option value="updated">Recently Updated</option>
          </select>

          <div className="hidden md:inline-flex items-center p-0.5 bg-[#F5F7F5] border border-[#123D35]/12 rounded-lg">
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#172B27] shadow-sm'
                  : 'text-[#71817B] hover:text-[#172B27]'
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#172B27] shadow-sm'
                  : 'text-[#71817B] hover:text-[#172B27]'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
