import { ClipboardList, LayoutDashboard, Plus, RefreshCw, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';

export function MobileBottomNav() {
  const { stats } = useApp();
  const pendingCount = stats.pendingSync + stats.failedSync;

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-light border-t border-[#123D35]/12 pb-safe"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[44px] rounded-xl text-[10px] font-medium tracking-tight transition-colors ${
              isActive ? 'text-[#123D35] font-semibold' : 'text-[#71817B]'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[44px] rounded-xl text-[10px] font-medium tracking-tight transition-colors ${
              isActive ? 'text-[#123D35] font-semibold' : 'text-[#71817B]'
            }`
          }
        >
          <ClipboardList className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span>Reports</span>
        </NavLink>

        {/* Ergonomic Primary Create Action in Thumb Center */}
        <div className="flex items-center justify-center">
          <NavLink
            to="/create"
            aria-label="Create field report"
            className="w-12 h-12 rounded-2xl bg-[#123D35] text-white shadow-md flex items-center justify-center hover:bg-[#1B5B4C] active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6" strokeWidth={2.4} />
          </NavLink>
        </div>

        <NavLink
          to="/coordinator"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[44px] rounded-xl text-[10px] font-medium tracking-tight transition-colors ${
              isActive ? 'text-[#123D35] font-semibold' : 'text-[#71817B]'
            }`
          }
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span>Dispatch</span>
        </NavLink>

        <NavLink
          to="/sync"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center min-h-[44px] rounded-xl text-[10px] font-medium tracking-tight transition-colors ${
              isActive ? 'text-[#123D35] font-semibold' : 'text-[#71817B]'
            }`
          }
        >
          <RefreshCw className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span>Sync</span>
          {pendingCount > 0 && (
            <span className="absolute top-1.5 right-3 min-w-[16px] h-4 px-1 rounded-full bg-[#E6A23C] text-[#092B27] text-[10px] font-bold flex items-center justify-center tabular-nums">
              {pendingCount}
            </span>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
