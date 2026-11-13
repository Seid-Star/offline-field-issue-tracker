import { useState } from "react";
import {
  ClipboardList,
  FilePlus2,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import {
  PriorityIndicator,
  SyncStatusBadge,
  WorkflowStatusBadge,
} from "../components/common/StatusBadge.jsx";
import { AppShell } from "../components/layout/AppShell.jsx";
import { ReportCard } from "../components/reports/ReportCard.jsx";
import { ReportFilters } from "../components/reports/ReportFilters.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useFilteredReports } from "../hooks/useFilteredReports.js";
import { formatShortDate } from "../utils/formatters.js";

export function Reports() {
  const { reports, globalSearch, setGlobalSearch } = useApp();

  const [filters, setFilters] = useState({
    category: "All",
    priority: "All",
    status: "All",
    syncStatus: "All",
    sortBy: "newest",
  });

  const [viewMode, setViewMode] = useState("cards");

  const combinedFilters = {
    ...filters,
    search: globalSearch,
  };

  const filtered = useFilteredReports(reports, combinedFilters);

  const handleFilterChange = (patch) => {
    if ("search" in patch) {
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
    setGlobalSearch("");

    setFilters({
      category: "All",
      priority: "All",
      status: "All",
      syncStatus: "All",
      sortBy: "newest",
    });
  };

  const hasReports = reports.length > 0;

  return (
    <AppShell
      title="Field Reports"
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "All Reports" },
      ]}
    >
      <div className="space-y-6">
        {/* Page introduction */}
        <section className="relative overflow-hidden rounded-[26px] border border-[#BE732F]/20 bg-[#0A0A0A] px-5 py-6 text-[#EFEEEC] shadow-[0_12px_35px_rgba(10,10,10,0.10)] sm:px-7 sm:py-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-[#F4B64F]/15"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-16 h-44 w-44 rounded-full border border-[#BE732F]/20"
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F4B64F]/25 bg-[#F4B64F]/10 px-3 py-1.5">
                <ClipboardList className="h-3.5 w-3.5 text-[#F4B64F]" />
                <span className="text-[10px] font-bold tracking-[0.14em] text-[#F4B64F]">
                  FIELD OPERATIONS
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Report Management
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-[#EFEEEC]/60">
                Review field observations, track workflow progress, and monitor
                synchronization across your locally stored reports.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#EFEEEC]/65">
                <span className="rounded-lg border border-[#EFEEEC]/10 bg-[#EFEEEC]/[0.06] px-3 py-1.5">
                  {reports.length} Total Reports
                </span>

                <span className="rounded-lg border border-[#EFEEEC]/10 bg-[#EFEEEC]/[0.06] px-3 py-1.5">
                  {filtered.length} Matching Results
                </span>
              </div>
            </div>

            <Link to="/create" className="relative shrink-0">
              <Button variant="emerald" size="lg" className="w-full sm:w-auto">
                <FilePlus2 className="h-4 w-4" />
                New Field Report
              </Button>
            </Link>
          </div>
        </section>

        {/* Filters */}
        <ReportFilters
          filters={combinedFilters}
          onChange={handleFilterChange}
          onReset={handleReset}
          totalMatches={filtered.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Results heading and view controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-bold text-[#0A0A0A]">
              {viewMode === "table" ? "Report Register" : "All Field Reports"}
            </h3>

            <p className="mt-1 text-xs text-[#552F0B]/55">
              {filtered.length === 0
                ? "No matching reports found"
                : `Showing ${filtered.length} of ${reports.length} reports`}
            </p>
          </div>

          <div className="inline-flex items-center gap-1 rounded-xl border border-[#BE732F]/20 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              aria-label="Card view"
              aria-pressed={viewMode === "cards"}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F] ${
                viewMode === "cards"
                  ? "bg-[#0A0A0A] text-[#F4B64F]"
                  : "text-[#552F0B]/60 hover:bg-[#EFEEEC] hover:text-[#0A0A0A]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode("table")}
              aria-label="Table view"
              aria-pressed={viewMode === "table"}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F] ${
                viewMode === "table"
                  ? "bg-[#0A0A0A] text-[#F4B64F]"
                  : "text-[#552F0B]/60 hover:bg-[#EFEEEC] hover:text-[#0A0A0A]"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={
              hasReports
                ? "No reports match your filters"
                : "No field reports yet"
            }
            description={
              hasReports
                ? "Try changing your search query or adjusting the category, priority, workflow, or synchronization filters."
                : "Start documenting field observations by creating your first report. Your reports will be stored locally and remain available offline."
            }
            action={
              hasReports ? (
                <Button variant="secondary" onClick={handleReset}>
                  Clear all filters
                </Button>
              ) : (
                <Link to="/create">
                  <Button variant="primary">
                    <FilePlus2 className="h-4 w-4" />
                    Create First Report
                  </Button>
                </Link>
              )
            }
          />
        ) : viewMode === "table" ? (
          /* Table view */
          <section className="overflow-hidden rounded-[24px] border border-[#BE732F]/20 bg-white shadow-[0_8px_30px_rgba(85,47,11,0.04)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#BE732F]/15 px-4 py-4 sm:px-5">
              <div>
                <h4 className="text-sm font-bold text-[#0A0A0A]">
                  Report Register
                </h4>
                <p className="mt-1 text-[11px] text-[#552F0B]/55">
                  Detailed overview of recorded field issues
                </p>
              </div>

              <span className="rounded-lg bg-[#EFEEEC] px-2.5 py-1.5 font-mono text-[10px] font-semibold tabular-nums text-[#552F0B]">
                {filtered.length} RECORDS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#BE732F]/15 bg-[#EFEEEC]/75 text-[10px] font-bold uppercase tracking-[0.09em] text-[#552F0B]/60">
                    <th className="whitespace-nowrap px-5 py-4">
                      Issue &amp; Category
                    </th>
                    <th className="whitespace-nowrap px-5 py-4">Location</th>
                    <th className="whitespace-nowrap px-5 py-4">Priority</th>
                    <th className="whitespace-nowrap px-5 py-4">Workflow</th>
                    <th className="whitespace-nowrap px-5 py-4">Sync State</th>
                    <th className="whitespace-nowrap px-5 py-4 text-right">
                      Reported
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#BE732F]/10">
                  {filtered.map((report) => (
                    <tr
                      key={report.clientId}
                      className="transition-colors hover:bg-[#F4B64F]/[0.055]"
                    >
                      <td className="max-w-xs px-5 py-4">
                        <Link
                          to={`/reports/${report.clientId}`}
                          className="block truncate text-sm font-bold text-[#0A0A0A] transition-colors hover:text-[#BE732F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F]"
                        >
                          {report.title}
                        </Link>

                        <span className="mt-1 block text-[11px] text-[#552F0B]/55">
                          {report.category}
                        </span>
                      </td>

                      <td className="max-w-[200px] px-5 py-4">
                        <span className="block truncate text-xs font-medium text-[#552F0B]/75">
                          {report.location?.name || "Not provided"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <PriorityIndicator priority={report.priority} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <WorkflowStatusBadge status={report.status} size="sm" />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <SyncStatusBadge
                          syncStatus={report.syncStatus}
                          isDraft={report.status === "Draft"}
                          size="sm"
                        />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right font-mono text-xs tabular-nums text-[#552F0B]/65">
                        {formatShortDate(report.reportedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[#BE732F]/15 bg-[#EFEEEC]/45 px-5 py-3">
              <p className="text-[10px] font-medium text-[#552F0B]/55">
                REPORTS ARE STORED LOCALLY AND AVAILABLE FOR OFFLINE ACCESS
              </p>
            </div>
          </section>
        ) : (
          /* Card view */
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((report) => (
              <ReportCard key={report.clientId} report={report} />
            ))}
          </div>
        )}

        {/* Bottom information */}
        {filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#BE732F]/15 pt-4">
            <p className="flex items-center gap-2 text-[11px] text-[#552F0B]/55">
              <Search className="h-3.5 w-3.5 text-[#BE732F]" />
              Reports are filtered using locally available data.
            </p>

            <span className="text-[10px] font-semibold tracking-wide text-[#552F0B]/45">
              NILEPIXEL TECHNOLOGIES
            </span>
          </div>
        )}
      </div>
    </AppShell>
  );
}
