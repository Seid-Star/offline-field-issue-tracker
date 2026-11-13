import {
  ClipboardList,
  LayoutDashboard,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";

export function MobileBottomNav() {
  const { stats } = useApp();
  const pendingCount = stats.pendingSync + stats.failedSync;

  const navItemClass = ({ isActive }) =>
    `relative flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold tracking-tight transition-all duration-200 ${
      isActive ? "text-[#BE732F]" : "text-[#552F0B]/55 hover:text-[#552F0B]"
    }`;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#BE732F]/20 bg-[#EFEEEC]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(10,10,10,0.07)] backdrop-blur-xl lg:hidden"
    >
      <div className="grid h-[68px] grid-cols-5 items-center px-1.5">
        {/* Dashboard */}
        <NavLink to="/dashboard" end className={navItemClass}>
          {({ isActive }) => (
            <>
              <LayoutDashboard
                className={`h-5 w-5 transition-transform ${
                  isActive ? "scale-110" : ""
                }`}
                strokeWidth={isActive ? 2.3 : 1.8}
                aria-hidden="true"
              />
              <span>Overview</span>

              {isActive && (
                <span className="absolute top-0 h-0.5 w-6 rounded-full bg-[#F4B64F]" />
              )}
            </>
          )}
        </NavLink>

        {/* Reports */}
        <NavLink to="/reports" className={navItemClass}>
          {({ isActive }) => (
            <>
              <ClipboardList
                className={`h-5 w-5 transition-transform ${
                  isActive ? "scale-110" : ""
                }`}
                strokeWidth={isActive ? 2.3 : 1.8}
                aria-hidden="true"
              />
              <span>Reports</span>

              {isActive && (
                <span className="absolute top-0 h-0.5 w-6 rounded-full bg-[#F4B64F]" />
              )}
            </>
          )}
        </NavLink>

        {/* Primary Create Action */}
        <div className="flex items-center justify-center">
          <NavLink
            to="/create"
            aria-label="Create field report"
            className={({ isActive }) =>
              `relative -mt-5 flex h-[54px] w-[54px] items-center justify-center rounded-[19px] border shadow-[0_7px_18px_rgba(10,10,10,0.22)] transition-all duration-200 active:scale-95 ${
                isActive
                  ? "border-[#BE732F] bg-[#552F0B] text-[#F4B64F]"
                  : "border-[#552F0B] bg-[#0A0A0A] text-[#F4B64F] hover:bg-[#552F0B]"
              }`
            }
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />

            <span className="absolute -bottom-5 whitespace-nowrap text-[9px] font-bold tracking-wide text-[#552F0B]">
              CREATE
            </span>
          </NavLink>
        </div>

        {/* Coordinator */}
        <NavLink to="/coordinator" className={navItemClass}>
          {({ isActive }) => (
            <>
              <ShieldCheck
                className={`h-5 w-5 transition-transform ${
                  isActive ? "scale-110" : ""
                }`}
                strokeWidth={isActive ? 2.3 : 1.8}
                aria-hidden="true"
              />
              <span>Dispatch</span>

              {isActive && (
                <span className="absolute top-0 h-0.5 w-6 rounded-full bg-[#F4B64F]" />
              )}
            </>
          )}
        </NavLink>

        {/* Sync Center */}
        <NavLink to="/sync" className={navItemClass}>
          {({ isActive }) => (
            <>
              <span className="relative">
                <RefreshCw
                  className={`h-5 w-5 transition-transform ${
                    isActive ? "scale-110" : ""
                  }`}
                  strokeWidth={isActive ? 2.3 : 1.8}
                  aria-hidden="true"
                />

                {pendingCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-[#EFEEEC] bg-[#F4B64F] px-1 font-mono text-[9px] font-bold tabular-nums text-[#552F0B]">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </span>

              <span>Sync</span>

              {isActive && (
                <span className="absolute top-0 h-0.5 w-6 rounded-full bg-[#F4B64F]" />
              )}
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
