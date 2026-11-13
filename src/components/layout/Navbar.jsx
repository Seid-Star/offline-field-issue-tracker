import { useState } from 'react';
import { MapPin, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../ui/PrimaryButton.jsx';

const NAV_LINKS = [
  { label: 'Home', hash: '#home' },
  { label: 'Features', hash: '#features' },
  { label: 'How It Works', hash: '#how-it-works' },
  { label: 'About', hash: '#about' },
];

export function Navbar({ variant = 'dark' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isDark = variant === 'dark';

  const handleAnchorClick = (hash) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
      return;
    }
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        isDark
          ? 'bg-[#092B27]/80 backdrop-blur-xl border-white/12 text-white'
          : 'bg-[#F5F7F5]/85 backdrop-blur-xl border-[#123D35]/10 text-[#172B27]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <Link
          to="/"
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A477] rounded-xl"
        >
          <span className="w-9 h-9 rounded-xl bg-[#16A477] text-[#092B27] flex items-center justify-center shadow-sm shrink-0">
            <MapPin className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="text-sm sm:text-base font-bold font-display tracking-tight">
            Offline Field Issue Tracker
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav aria-label="Landing navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <button
              key={item.hash}
              type="button"
              onClick={() => handleAnchorClick(item.hash)}
              className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer hover:underline underline-offset-4 ${
                isDark
                  ? 'text-white/80 hover:text-white'
                  : 'text-[#71817B] hover:text-[#123D35]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            to="/login"
            className={`min-h-[40px] px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-colors flex items-center ${
              isDark
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-[#123D35] hover:bg-[#123D35]/8'
            }`}
          >
            Login
          </Link>
          <Link to="/register">
            <PrimaryButton variant={isDark ? 'emerald' : 'forest'} size="sm">
              Get Started
            </PrimaryButton>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className={`md:hidden min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-xl cursor-pointer ${
            isDark
              ? 'text-white hover:bg-white/10'
              : 'text-[#172B27] hover:bg-[#123D35]/8'
          }`}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileOpen && (
        <div
          className={`md:hidden border-t px-4 py-4 space-y-2 ${
            isDark
              ? 'bg-[#092B27]/95 border-white/12 text-white'
              : 'bg-white/95 border-[#123D35]/10 text-[#172B27]'
          }`}
        >
          <div className="space-y-1">
            {NAV_LINKS.map((item) => (
              <button
                key={item.hash}
                type="button"
                onClick={() => handleAnchorClick(item.hash)}
                className={`w-full text-left min-h-[44px] px-3 rounded-xl text-sm font-medium flex items-center cursor-pointer ${
                  isDark ? 'hover:bg-white/10 text-white/90' : 'hover:bg-[#F5F7F5] text-[#172B27]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-current/10 grid grid-cols-2 gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className={`min-h-[44px] rounded-xl text-sm font-medium flex items-center justify-center border ${
                isDark
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-[#123D35]/15 text-[#123D35] hover:bg-[#F5F7F5]'
              }`}
            >
              Login
            </Link>
            <Link to="/register" onClick={() => setMobileOpen(false)}>
              <PrimaryButton variant={isDark ? 'emerald' : 'forest'} size="md" className="w-full">
                Get Started
              </PrimaryButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
