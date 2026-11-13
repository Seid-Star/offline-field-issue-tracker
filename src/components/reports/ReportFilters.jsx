import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";

import {
  CATEGORIES,
  PRIORITIES,
  SYNC_STATUSES,
  WORKFLOW_STATUSES,
} from "../../utils/constants.js";

export function ReportFilters({
  filters,
  onChange,
  onReset,
  totalMatches,
  viewMode,
  onViewModeChange,
}) {
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.category !== "All" ||
    filters.priority !== "All" ||
    filters.status !== "All" ||
    filters.syncStatus !== "All";

  const selectClass =
    "h-11 w-full min-w-0 rounded-xl border border-[#BE732F]/20 bg-[#EFEEEC] px-3 text-xs font-semibold text-[#552F0B] outline-none transition-all duration-200 hover:border-[#BE732F]/45 focus:border-[#BE732F] focus:ring-2 focus:ring-[#F4B64F]/30";

  return (
    <section className="overflow-hidden rounded-[22px] border border-[#BE732F]/20 bg-[#EFEEEC] shadow-[0_8px_30px_rgba(85,47,11,0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#BE732F]/15 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#552F0B] text-[#F4B64F]">
            <Filter className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#0A0A0A]">Find Reports</h3>
            <p className="mt-0.5 text-[11px] text-[#552F0B]/60">
              Search, filter, and organize field reports
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <span className="rounded-full border border-[#BE732F]/25 bg-[#F4B64F]/15 px-2.5 py-1 text-[10px] font-bold text-[#552F0B]">
            Filters active
          </span>
        )}
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        {/* Search */}
        <div className="space-y-2">
          <label
            htmlFor="report-search"
            className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#552F0B]/65"
          >
            Search reports
          </label>

          <div className="group relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#BE732F] transition-colors group-focus-within:text-[#552F0B]"
              aria-hidden="true"
            />

            <input
              id="report-search"
              type="search"
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="Search title, description, location, or report ID..."
              aria-label="Filter reports by keyword"
              className="h-12 w-full rounded-xl border border-[#BE732F]/20 bg-white pl-11 pr-10 text-sm text-[#0A0A0A] outline-none transition-all placeholder:text-[#552F0B]/40 hover:border-[#BE732F]/40 focus:border-[#BE732F] focus:ring-2 focus:ring-[#F4B64F]/30"
            />

            {filters.search && (
              <button
                type="button"
                onClick={() => onChange({ search: "" })}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#552F0B]/55 transition-colors hover:bg-[#BE732F]/10 hover:text-[#0A0A0A]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#BE732F]" />
            <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#552F0B]/65">
              Refine results
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 space-y-1.5">
              <label
                htmlFor="filter-category"
                className="text-[11px] font-semibold text-[#552F0B]/75"
              >
                Category
              </label>

              <select
                id="filter-category"
                aria-label="Filter by category"
                value={filters.category}
                onChange={(e) => onChange({ category: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0 space-y-1.5">
              <label
                htmlFor="filter-priority"
                className="text-[11px] font-semibold text-[#552F0B]/75"
              >
                Priority
              </label>

              <select
                id="filter-priority"
                aria-label="Filter by priority"
                value={filters.priority}
                onChange={(e) => onChange({ priority: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Priorities</option>
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0 space-y-1.5">
              <label
                htmlFor="filter-status"
                className="text-[11px] font-semibold text-[#552F0B]/75"
              >
                Workflow status
              </label>

              <select
                id="filter-status"
                aria-label="Filter by workflow status"
                value={filters.status}
                onChange={(e) => onChange({ status: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Statuses</option>
                {WORKFLOW_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0 space-y-1.5">
              <label
                htmlFor="filter-sync"
                className="text-[11px] font-semibold text-[#552F0B]/75"
              >
                Synchronization
              </label>

              <select
                id="filter-sync"
                aria-label="Filter by synchronization status"
                value={filters.syncStatus}
                onChange={(e) => onChange({ syncStatus: e.target.value })}
                className={selectClass}
              >
                <option value="All">All Sync States</option>
                {SYNC_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer toolbar */}
        <div className="flex flex-col gap-3 border-t border-[#BE732F]/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Results and reset */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4B64F]/20 text-[#552F0B]">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </span>

              <span className="text-sm font-bold tabular-nums text-[#0A0A0A]">
                {totalMatches}
                <span className="ml-1 font-medium text-[#552F0B]/60">
                  {totalMatches === 1 ? "report found" : "reports found"}
                </span>
              </span>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#BE732F] transition-colors hover:bg-[#BE732F]/10 hover:text-[#552F0B]"
              >
                <X className="h-3.5 w-3.5" />
                Clear all filters
              </button>
            )}
          </div>

          {/* Sorting and view mode */}
          <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
            <div className="flex items-center gap-2">
              <label
                htmlFor="report-sort"
                className="shrink-0 text-xs font-medium text-[#552F0B]/65"
              >
                Sort by
              </label>

              <select
                id="report-sort"
                value={filters.sortBy}
                onChange={(e) => onChange({ sortBy: e.target.value })}
                className="h-9 max-w-[180px] rounded-lg border border-[#BE732F]/20 bg-white px-2.5 text-xs font-semibold text-[#552F0B] outline-none transition-all focus:border-[#BE732F] focus:ring-2 focus:ring-[#F4B64F]/30"
              >
                <option value="newest">Newest Reported</option>
                <option value="oldest">Oldest Reported</option>
                <option value="priority">Highest Priority</option>
                <option value="updated">Recently Updated</option>
              </select>
            </div>

            <div
              className="hidden items-center gap-1 rounded-xl border border-[#BE732F]/20 bg-[#BE732F]/[0.07] p-1 md:flex"
              role="group"
              aria-label="Report display mode"
            >
              <button
                type="button"
                onClick={() => onViewModeChange("cards")}
                aria-pressed={viewMode === "cards"}
                className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all ${
                  viewMode === "cards"
                    ? "bg-[#552F0B] text-[#F4B64F] shadow-sm"
                    : "text-[#552F0B]/65 hover:bg-[#BE732F]/10 hover:text-[#0A0A0A]"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Cards
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                aria-pressed={viewMode === "table"}
                className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-[#552F0B] text-[#F4B64F] shadow-sm"
                    : "text-[#552F0B]/65 hover:bg-[#BE732F]/10 hover:text-[#0A0A0A]"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                Table
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
