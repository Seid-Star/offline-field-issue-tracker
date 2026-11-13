import { useState } from 'react';
import { CATEGORIES, PRIORITIES } from '../../utils/constants.js';

export function CategoryChart({ reports }) {
  const [view, setView] = useState('category');

  const categoryCounts = CATEGORIES.map((cat) => ({
    label: cat,
    total: reports.filter((r) => r.category === cat).length,
    unresolved: reports.filter(
      (r) => r.category === cat && r.status !== 'Resolved' && r.status !== 'Rejected'
    ).length,
  })).sort((a, b) => b.total - a.total);

  const priorityCounts = PRIORITIES.slice()
    .reverse()
    .map((prio) => ({
      label: prio,
      total: reports.filter((r) => r.priority === prio).length,
      unresolved: reports.filter(
        (r) => r.priority === prio && r.status !== 'Resolved' && r.status !== 'Rejected'
      ).length,
      barColor:
        prio === 'Critical'
          ? 'bg-[#DC5555]'
          : prio === 'High'
            ? 'bg-[#E6A23C]'
            : prio === 'Medium'
              ? 'bg-[#1B5B4C]'
              : 'bg-[#71817B]',
    }));

  const rows = view === 'category' ? categoryCounts : priorityCounts;
  const maxVal = Math.max(1, ...rows.map((r) => r.total));

  return (
    <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#172B27] font-display">
            Infrastructure Issue Distribution
          </h2>
          <p className="text-xs text-[#71817B] mt-0.5">
            Active open load vs. total logged reports in IndexedDB
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-[#F5F7F5] border border-[#123D35]/10 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setView('category')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              view === 'category'
                ? 'bg-white text-[#172B27] shadow-sm'
                : 'text-[#71817B] hover:text-[#172B27]'
            }`}
          >
            By Category
          </button>
          <button
            type="button"
            onClick={() => setView('priority')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              view === 'priority'
                ? 'bg-white text-[#172B27] shadow-sm'
                : 'text-[#71817B] hover:text-[#172B27]'
            }`}
          >
            By Priority
          </button>
        </div>
      </div>

      <div className="space-y-3.5">
        {rows.map((row) => {
          const totalPct = Math.round((row.total / maxVal) * 100);
          const openPct = row.total > 0 ? Math.round((row.unresolved / row.total) * 100) : 0;
          return (
            <div key={row.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-[#172B27] truncate">{row.label}</span>
                <span className="text-[#71817B] font-mono tabular-nums shrink-0">
                  {row.unresolved} open / {row.total} total
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[#F0F3F1] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    row.barColor || 'bg-[#123D35]'
                  }`}
                  style={{ width: `${row.total === 0 ? 0 : Math.max(6, totalPct)}%` }}
                  aria-label={`${row.label}: ${row.total} reports, ${openPct}% open`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
