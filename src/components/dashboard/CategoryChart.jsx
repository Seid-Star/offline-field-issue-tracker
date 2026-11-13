import { useState } from "react";
import { CATEGORIES, PRIORITIES } from "../../utils/constants.js";

export function CategoryChart({ reports }) {
  const [view, setView] = useState("category");

  const categoryCounts = CATEGORIES.map((cat) => ({
    label: cat,
    total: reports.filter((r) => r.category === cat).length,
    unresolved: reports.filter(
      (r) =>
        r.category === cat &&
        r.status !== "Resolved" &&
        r.status !== "Rejected",
    ).length,
  })).sort((a, b) => b.total - a.total);

  const priorityCounts = PRIORITIES.slice()
    .reverse()
    .map((prio) => ({
      label: prio,
      total: reports.filter((r) => r.priority === prio).length,
      unresolved: reports.filter(
        (r) =>
          r.priority === prio &&
          r.status !== "Resolved" &&
          r.status !== "Rejected",
      ).length,
      barColor:
        prio === "Critical"
          ? "bg-[#552F0B]"
          : prio === "High"
            ? "bg-[#BE732F]"
            : prio === "Medium"
              ? "bg-[#F4B64F]"
              : "bg-[#552F0B]/45",
    }));

  const rows = view === "category" ? categoryCounts : priorityCounts;
  const maxVal = Math.max(1, ...rows.map((r) => r.total));

  const totalReports = reports.length;
  const totalOpen = reports.filter(
    (r) => r.status !== "Resolved" && r.status !== "Rejected",
  ).length;

  return (
    <section className="h-full rounded-[24px] border border-[#BE732F]/15 bg-[#EFEEEC] p-5 shadow-[0_8px_30px_rgba(85,47,11,0.05)] sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#BE732F]">
            Analytics overview
          </p>

          <h2 className="mt-1.5 text-base font-bold tracking-tight text-[#0A0A0A]">
            Infrastructure Issue Distribution
          </h2>

          <p className="mt-1 text-xs leading-5 text-[#552F0B]/55">
            Breakdown of recorded issues and unresolved field workload
          </p>
        </div>

        <div className="inline-flex shrink-0 items-center self-start rounded-xl border border-[#BE732F]/15 bg-white/70 p-1">
          <button
            type="button"
            onClick={() => setView("category")}
            aria-pressed={view === "category"}
            className={`cursor-pointer rounded-lg px-3 py-2 text-[11px] font-semibold transition-all duration-200 ${
              view === "category"
                ? "bg-[#0A0A0A] text-[#F4B64F] shadow-sm"
                : "text-[#552F0B]/60 hover:text-[#552F0B]"
            }`}
          >
            By Category
          </button>

          <button
            type="button"
            onClick={() => setView("priority")}
            aria-pressed={view === "priority"}
            className={`cursor-pointer rounded-lg px-3 py-2 text-[11px] font-semibold transition-all duration-200 ${
              view === "priority"
                ? "bg-[#0A0A0A] text-[#F4B64F] shadow-sm"
                : "text-[#552F0B]/60 hover:text-[#552F0B]"
            }`}
          >
            By Priority
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#BE732F]/15 bg-white/65 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#552F0B]/55">
            Total reports
          </p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums text-[#0A0A0A]">
            {totalReports}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F4B64F]/35 bg-[#F4B64F]/10 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#552F0B]/65">
            Unresolved
          </p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums text-[#552F0B]">
            {totalOpen}
          </p>
        </div>
      </div>

      {/* Distribution bars */}
      <div className="space-y-5">
        {rows.map((row) => {
          const totalPct = Math.round((row.total / maxVal) * 100);
          const openPct =
            row.total > 0 ? Math.round((row.unresolved / row.total) * 100) : 0;

          const barColor = row.barColor || "bg-[#BE732F]";

          return (
            <div key={row.label} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-xs font-semibold text-[#552F0B]">
                  {row.label}
                </span>

                <span className="shrink-0 font-mono text-[10px] tabular-nums text-[#552F0B]/60 sm:text-xs">
                  {row.unresolved} open / {row.total} total
                </span>
              </div>

              <div
                className="h-3 w-full overflow-hidden rounded-full bg-[#552F0B]/10"
                role="img"
                aria-label={`${row.label}: ${row.total} reports, ${row.unresolved} unresolved`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                  style={{
                    width: row.total === 0 ? "0%" : `${Math.max(6, totalPct)}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#552F0B]/45">
                  {totalPct}% of highest category
                </span>

                <span className="text-[10px] font-semibold text-[#BE732F]">
                  {openPct}% unresolved
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#BE732F]/15 pt-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#BE732F]" />
          <span className="text-[10px] font-medium text-[#552F0B]/65">
            Recorded reports
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F4B64F]" />
          <span className="text-[10px] font-medium text-[#552F0B]/65">
            Priority indicator
          </span>
        </div>
      </div>
    </section>
  );
}
