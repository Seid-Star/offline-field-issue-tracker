import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  RefreshCw,
  Search,
  Settings,
  UserCheck,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { useNetwork } from "../../context/NetworkContext.jsx";
import { DEMO_USERS } from "../../utils/constants.js";
import { Avatar } from "../common/Avatar.jsx";
import { PWAInstallButton } from "../common/PWAInstallButton.jsx";

export function Header({ title, breadcrumbs = [], onOpenMobileMenu }) {
  const navigate = useNavigate();

  const {
    currentUser,
    demoRole,
    switchRole,
    stats,
    isSyncing,
    setSyncDrawerOpen,
    globalSearch,
    setGlobalSearch,
  } = useApp();

  const {
    effectiveOnline,
    simulatedOffline,
    toggleSimulatedOffline,
    reachabilityReason,
  } = useNetwork();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [networkPopoverOpen, setNetworkPopoverOpen] = useState(false);

  const profileRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }

      if (networkRef.current && !networkRef.current.contains(e.target)) {
        setNetworkPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/reports");
  };

  const pendingBadgeCount = stats.pendingSync + stats.failedSync;

  return (
    <header className="sticky top-0 z-30 border-b border-[#BE732F]/15 bg-[#EFEEEC]/95 px-3 py-3 shadow-[0_4px_20px_rgba(85,47,11,0.035)] backdrop-blur-xl sm:px-5 lg:px-7">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Menu and Page Title */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-xl border border-[#BE732F]/20 text-[#552F0B] transition-colors hover:bg-[#F4B64F]/15 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            {breadcrumbs.length > 0 && (
              <nav
                aria-label="Breadcrumb"
                className="mb-1 hidden items-center gap-1 text-[11px] text-[#552F0B]/55 sm:flex"
              >
                {breadcrumbs.map((crumb, idx) => (
                  <span key={crumb.label} className="flex items-center gap-1">
                    {idx > 0 && (
                      <ChevronRight
                        className="h-3 w-3 text-[#BE732F]"
                        aria-hidden="true"
                      />
                    )}

                    {crumb.to ? (
                      <Link
                        to={crumb.to}
                        className="transition-colors hover:text-[#BE732F]"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-[#552F0B]">
                        {crumb.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            )}

            <h1 className="truncate font-display text-base font-bold tracking-tight text-[#0A0A0A] sm:text-lg">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Workspace Controls */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden w-52 md:block xl:w-72"
          >
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#BE732F]"
              aria-hidden="true"
            />

            <input
              type="search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search reports, locations..."
              aria-label="Search field reports"
              className="h-10 w-full rounded-xl border border-[#BE732F]/20 bg-white/70 pl-9 pr-3 text-sm text-[#0A0A0A] placeholder:text-[#552F0B]/45 transition-all focus:border-[#BE732F]/60 focus:outline-none focus:ring-2 focus:ring-[#F4B64F]/40"
            />
          </form>

          {/* PWA Installation */}
          <div className="hidden sm:block">
            <PWAInstallButton compact variant="secondary" />
          </div>

          {/* Connectivity */}
          <div className="relative" ref={networkRef}>
            <button
              type="button"
              onClick={() => setNetworkPopoverOpen((v) => !v)}
              aria-expanded={networkPopoverOpen}
              aria-label={`Connectivity: ${effectiveOnline ? "Online" : "Offline"}`}
              className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3 ${
                effectiveOnline
                  ? "border-[#BE732F]/25 bg-[#F4B64F]/10 text-[#552F0B] hover:bg-[#F4B64F]/20"
                  : "border-[#552F0B]/30 bg-[#552F0B]/10 text-[#552F0B] hover:bg-[#552F0B]/15"
              }`}
            >
              {effectiveOnline ? (
                <Wifi className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              )}

              <span className="hidden sm:inline">
                {effectiveOnline ? "Online" : "Offline"}
              </span>
            </button>

            {networkPopoverOpen && (
              <div className="absolute right-0 z-50 mt-2 w-[min(288px,calc(100vw-24px))] rounded-2xl border border-[#BE732F]/25 bg-[#EFEEEC] p-4 shadow-[0_18px_50px_rgba(10,10,10,0.16)]">
                <div className="flex items-center gap-2">
                  {effectiveOnline ? (
                    <Wifi className="h-4 w-4 text-[#BE732F]" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-[#552F0B]" />
                  )}

                  <p className="text-xs font-bold text-[#0A0A0A]">
                    Connectivity & Reachability
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#552F0B]/75">
                  {reachabilityReason}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#BE732F]/20 pt-3">
                  <div>
                    <p className="text-xs font-semibold text-[#0A0A0A]">
                      Simulate Offline Mode
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#552F0B]/60">
                      Test disconnected workflows
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={simulatedOffline}
                    aria-label="Simulate offline mode"
                    onClick={() => toggleSimulatedOffline()}
                    className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors ${
                      simulatedOffline ? "bg-[#BE732F]" : "bg-[#552F0B]/25"
                    }`}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full bg-[#EFEEEC] shadow-sm transition-transform ${
                        simulatedOffline ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Synchronization Center */}
          <button
            type="button"
            onClick={() => setSyncDrawerOpen(true)}
            aria-label={`Open Synchronization Center (${pendingBadgeCount} pending items)`}
            className="relative flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#BE732F]/20 bg-white/70 px-2.5 text-[#552F0B] transition-all hover:border-[#BE732F]/45 hover:bg-[#F4B64F]/10"
          >
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 animate-spin text-[#BE732F]" />
            ) : (
              <Bell className="h-4 w-4" />
            )}

            {pendingBadgeCount > 0 && (
              <span className="font-mono text-[11px] font-bold tabular-nums text-[#552F0B]">
                {pendingBadgeCount}
              </span>
            )}

            {pendingBadgeCount > 0 && (
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#F4B64F]" />
            )}
          </button>

          {/* Profile and Demo Role Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileMenuOpen((v) => !v)}
              aria-expanded={profileMenuOpen}
              aria-label="Open profile menu"
              className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#BE732F]/20 bg-white/70 py-1 pl-1.5 pr-2 transition-all hover:border-[#BE732F]/45 hover:bg-[#F4B64F]/10"
            >
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="sm"
              />

              <div className="hidden text-left xl:block">
                <p className="max-w-28 truncate text-xs font-bold leading-tight text-[#0A0A0A]">
                  {currentUser.name}
                </p>

                <p className="mt-0.5 text-[10px] capitalize leading-tight text-[#552F0B]/60">
                  {currentUser.role}
                </p>
              </div>

              <ChevronDown className="hidden h-3.5 w-3.5 text-[#BE732F] sm:block" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[#BE732F]/25 bg-[#EFEEEC] shadow-[0_18px_50px_rgba(10,10,10,0.16)]">
                {/* User Details */}
                <div className="border-b border-[#BE732F]/20 bg-[#F4B64F]/10 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={currentUser.avatar}
                      name={currentUser.name}
                      size="md"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#0A0A0A]">
                        {currentUser.name}
                      </p>
                      <p className="truncate text-[11px] text-[#552F0B]/65">
                        {currentUser.unit}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Demo Role Switch */}
                <div className="p-2">
                  <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#BE732F]">
                    Switch Demo Role
                  </p>

                  {Object.values(DEMO_USERS).map((persona) => (
                    <button
                      key={persona.roleKey}
                      type="button"
                      onClick={() => {
                        switchRole(persona.roleKey);
                        setProfileMenuOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                        demoRole === persona.roleKey
                          ? "bg-[#F4B64F]/20 font-bold text-[#552F0B]"
                          : "text-[#552F0B]/75 hover:bg-[#BE732F]/10 hover:text-[#0A0A0A]"
                      }`}
                    >
                      <span>{persona.role}</span>

                      {demoRole === persona.roleKey && (
                        <UserCheck className="h-4 w-4 text-[#BE732F]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Profile Actions */}
                <div className="space-y-1 border-t border-[#BE732F]/20 p-2">
                  <Link
                    to="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-[#552F0B] transition-colors hover:bg-[#BE732F]/10"
                  >
                    <Settings className="h-4 w-4 text-[#BE732F]" />
                    <span>Workspace Settings</span>
                  </Link>

                  <Link
                    to="/login"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#552F0B] transition-colors hover:bg-[#F4B64F]/20"
                  >
                    <span>Switch / Demo Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
