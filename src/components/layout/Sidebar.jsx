import {
  ClipboardList,
  Globe,
  LayoutDashboard,
  MapPin,
  PlusCircle,
  RefreshCw,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { Avatar } from '../common/Avatar.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/reports', label: 'All Reports', icon: ClipboardList },
  { to: '/create', label: 'Create Report', icon: PlusCircle },
  { to: '/coordinator', label: 'Coordinator', icon: ShieldCheck },
  { to: '/sync', label: 'Sync Center', icon: RefreshCw },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ onNavigate }) {
  const { currentUser, stats } = useApp();
  const queueBadgeCount = stats.pendingSync + stats.failedSync;

  return (
    <aside className="glass-dark text-white w-64 h-full flex flex-col justify-between p-4 select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#16A477] text-[#092B27] flex items-center justify-center shadow-sm shrink-0">
            <MapPin className="w-5 h-5" strokeWidth={2.3} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold font-display tracking-tight text-white truncate">
              FieldTrack
            </p>
            <p className="text-[11px] text-white/65 truncate">
              Offline Field Issue Tracker
            </p>
          </div>
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
                  `group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white/15 text-white shadow-sm border border-white/15'
                      : 'text-white/75 hover:text-white hover:bg-white/8 border border-transparent'
                  }`
                }
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.to === '/sync' && queueBadgeCount > 0 && (
                  <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md bg-[#E6A23C]/20 text-[#F7C97E] border border-[#E6A23C]/35">
                    {queueBadgeCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Links & User Profile */}
      <div className="pt-4 border-t border-white/12 space-y-2">
        <NavLink
          to="/"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/8 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Public Landing Page</span>
        </NavLink>

        <NavLink
          to="/settings"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-white/6 hover:bg-white/12 border border-white/10 transition-colors"
        >
          <Avatar src={currentUser.avatar} name={currentUser.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-white/65 truncate">{currentUser.role}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
