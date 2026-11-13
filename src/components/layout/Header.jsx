import { useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useNetwork } from '../../context/NetworkContext.jsx';
import { DEMO_USERS } from '../../utils/constants.js';
import { Avatar } from '../common/Avatar.jsx';
import { PWAInstallButton } from '../common/PWAInstallButton.jsx';

export function Header({
  title,
  breadcrumbs = [],
  onOpenMobileMenu,
}) {
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/reports');
  };

  const pendingBadgeCount = stats.pendingSync + stats.failedSync;

  return (
    <header className="sticky top-0 z-30 glass-light border-b border-[#123D35]/10 px-4 lg:px-6 py-2.5 lg:py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Trigger + Title & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-[#172B27] hover:bg-[#123D35]/8 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            {breadcrumbs.length > 0 && (
              <nav
                aria-label="Breadcrumb"
                className="hidden sm:flex items-center gap-1 text-[11px] text-[#71817B] mb-0.5"
              >
                {breadcrumbs.map((crumb, idx) => (
                  <span key={crumb.label} className="flex items-center gap-1">
                    {idx > 0 && <ChevronRight className="w-3 h-3" aria-hidden="true" />}
                    {crumb.to ? (
                      <Link to={crumb.to} className="hover:text-[#123D35] transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
            <h1 className="text-base sm:text-lg font-semibold text-[#172B27] font-display truncate">
              {title}
            </h1>
          </div>
        </div>

        {/* Center/Right: Search + Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-56 xl:w-72">
            <Search
              className="w-4 h-4 text-[#71817B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search reports, locations..."
              aria-label="Search field reports"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-[#123D35]/14 text-sm text-[#172B27] placeholder:text-[#71817B] focus:outline-none focus:ring-2 focus:ring-[#16A477] focus:border-transparent"
            />
          </form>

          {/* PWA Install button (hidden automatically when installed) */}
          <div className="hidden sm:block">
            <PWAInstallButton compact variant="secondary" />
          </div>

          {/* Connectivity Indicator */}
          <div className="relative" ref={networkRef}>
            <button
              type="button"
              onClick={() => setNetworkPopoverOpen((v) => !v)}
              aria-expanded={networkPopoverOpen}
              className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                effectiveOnline
                  ? 'bg-[#16A477]/12 border-[#16A477]/30 text-[#0E7A57] hover:bg-[#16A477]/18'
                  : 'bg-[#E6A23C]/16 border-[#E6A23C]/40 text-[#8A5708] hover:bg-[#E6A23C]/22'
              }`}
            >
              {effectiveOnline ? (
                <Wifi className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {effectiveOnline ? 'Online' : 'Offline Mode'}
              </span>
            </button>

            {networkPopoverOpen && (
              <div className="animate-modal absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#123D35]/15 shadow-xl p-4 z-50">
                <p className="text-xs font-semibold text-[#172B27]">
                  Connectivity &amp; Reachability
                </p>
                <p className="mt-1 text-xs text-[#71817B] leading-relaxed">
                  {reachabilityReason}
                </p>
                <div className="mt-3 pt-3 border-t border-[#123D35]/10 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#172B27]">
                    Simulate Offline Mode
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={simulatedOffline}
                    onClick={() => toggleSimulatedOffline()}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                      simulatedOffline ? 'bg-[#E6A23C]' : 'bg-[#123D35]/20'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        simulatedOffline ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sync Queue / Notifications Trigger */}
          <button
            type="button"
            onClick={() => setSyncDrawerOpen(true)}
            aria-label={`Open Synchronization Center (${pendingBadgeCount} pending items)`}
            className="relative min-h-[40px] min-w-[40px] px-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-white border border-[#123D35]/14 text-[#172B27] hover:bg-[#F5F7F5] transition-colors cursor-pointer"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 text-[#16A477] animate-spin" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
            {pendingBadgeCount > 0 && (
              <span className="text-[11px] font-mono tabular-nums font-semibold text-[#8A5708]">
                {pendingBadgeCount}
              </span>
            )}
          </button>

          {/* User Profile & Role Switcher Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileMenuOpen((v) => !v)}
              aria-expanded={profileMenuOpen}
              className="min-h-[40px] pl-1.5 pr-2 py-1 rounded-xl bg-white border border-[#123D35]/14 flex items-center gap-2 hover:bg-[#F5F7F5] transition-colors cursor-pointer"
            >
              <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-[#172B27] leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[#71817B] leading-tight">
                  {currentUser.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#71817B] hidden sm:block" />
            </button>

            {profileMenuOpen && (
              <div className="animate-modal absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#123D35]/15 shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-[#123D35]/10">
                  <p className="text-xs font-semibold text-[#172B27]">{currentUser.name}</p>
                  <p className="text-[11px] text-[#71817B]">{currentUser.unit}</p>
                </div>

                <div className="py-1.5">
                  <p className="px-3 py-1 text-[11px] font-medium text-[#71817B]">
                    Demo Role Switch
                  </p>
                  {Object.values(DEMO_USERS).map((persona) => (
                    <button
                      key={persona.roleKey}
                      type="button"
                      onClick={() => {
                        switchRole(persona.roleKey);
                        setProfileMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        demoRole === persona.roleKey
                          ? 'bg-[#123D35]/8 text-[#123D35] font-semibold'
                          : 'text-[#172B27] hover:bg-[#F5F7F5]'
                      }`}
                    >
                      <span>{persona.role}</span>
                      {demoRole === persona.roleKey && (
                        <UserCheck className="w-3.5 h-3.5 text-[#16A477]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-[#123D35]/10 space-y-0.5">
                  <Link
                    to="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-[#172B27] hover:bg-[#F5F7F5] flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#71817B]" />
                    <span>Workspace Settings</span>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-[#123D35] font-medium hover:bg-[#F5F7F5] flex items-center gap-2"
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
