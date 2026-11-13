import {
  ClipboardList,
  Globe,
  LayoutDashboard,
  PlusCircle,
  RefreshCw,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { Avatar } from "../common/Avatar.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/reports", label: "All Reports", icon: ClipboardList },
  { to: "/create", label: "Create Report", icon: PlusCircle },
  { to: "/coordinator", label: "Coordinator", icon: ShieldCheck },
  { to: "/sync", label: "Sync Center", icon: RefreshCw },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onNavigate }) {
  const { currentUser, stats } = useApp();
  const queueBadgeCount = stats.pendingSync + stats.failedSync;

  return (
    <aside className="flex h-full w-64 select-none flex-col justify-between border-r border-[#BE732F]/15 bg-[#0A0A0A] p-4 text-[#EFEEEC]">
      <div>
        {/* Brand Header */}
        <div className="mb-7 flex items-center gap-3 border-b border-[#EFEEEC]/10 px-2 pb-5 pt-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#BE732F]/30 bg-[#552F0B]/35 p-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.2)]">
            <img
              src="/logo.png"
              alt="Offline Field Issue Tracker logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold tracking-tight text-[#EFEEEC]">
              FieldTrack
            </p>
            <p className="mt-0.5 truncate text-[10px] font-medium tracking-wide text-[#F4B64F]/75">
              OFFLINE FIELD ISSUE TRACKER
            </p>
          </div>
        </div>

        {/* Navigation Label */}
        <div className="mb-3 px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#BE732F]">
            Workspace
          </p>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main navigation" className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => onNavigate?.()}
                className={({ isActive }) =>
                  `group relative flex items-center justify-between gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-[#F4B64F]/25 bg-[#F4B64F]/[0.12] text-[#F4B64F] shadow-[inset_3px_0_0_#F4B64F]"
                      : "border-transparent text-[#EFEEEC]/65 hover:border-[#BE732F]/15 hover:bg-[#EFEEEC]/[0.05] hover:text-[#EFEEEC]"
                  }`
                }
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Icon
                    className="h-[18px] w-[18px] shrink-0"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </span>

                {item.to === "/sync" && queueBadgeCount > 0 && (
                  <span className="rounded-md border border-[#F4B64F]/30 bg-[#F4B64F]/15 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-[#F4B64F]">
                    {queueBadgeCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Links & User Profile */}
      <div className="space-y-3 border-t border-[#EFEEEC]/10 pt-4">
        <NavLink
          to="/"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-[#EFEEEC]/60 transition-colors hover:bg-[#EFEEEC]/[0.05] hover:text-[#F4B64F]"
        >
          <Globe
            className="h-4 w-4 shrink-0"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <span>Public Landing Page</span>
        </NavLink>

        <NavLink
          to="/settings"
          onClick={() => onNavigate?.()}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
              isActive
                ? "border-[#BE732F]/35 bg-[#552F0B]/30"
                : "border-[#EFEEEC]/10 bg-[#EFEEEC]/[0.04] hover:border-[#BE732F]/30 hover:bg-[#EFEEEC]/[0.07]"
            }`
          }
        >
          <Avatar src={currentUser.avatar} name={currentUser.name} size="md" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#EFEEEC]">
              {currentUser.name}
            </p>
            <p className="mt-0.5 truncate text-xs capitalize text-[#F4B64F]/70">
              {currentUser.role}
            </p>
          </div>

          <Settings
            className="h-4 w-4 shrink-0 text-[#BE732F]"
            aria-hidden="true"
          />
        </NavLink>

        <p className="px-2 pt-1 text-center text-[10px] tracking-wide text-[#EFEEEC]/30">
          FIELD OPERATIONS · BUILT FOR OFFLINE
        </p>
      </div>
    </aside>
  );
}
