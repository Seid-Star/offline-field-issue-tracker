import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#092B27] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-[#16A477] text-[#092B27] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className="text-base font-bold font-display tracking-tight">
                Offline Field Issue Tracker
              </span>
            </Link>
            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              Resilient field operations reporting designed for disconnected environments, reliable IndexedDB persistence, and structured coordinator dispatch.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <p className="text-xs font-semibold text-white/90">Platform</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="/#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Live Workspace
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <p className="text-xs font-semibold text-white/90">Access &amp; Accounts</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In to Workspace
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Field Account
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-white transition-colors">
                  Browse Local Reports
                </Link>
              </li>
              <li>
                <Link to="/sync" className="hover:text-white transition-colors">
                  Synchronization Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/60">
          <p>
            &copy; {new Date().getFullYear()} Offline Field Issue Tracker · NilePixel Technologies Cohort 1
          </p>
          <p>Offline-first PWA powered by local IndexedDB &amp; Service Worker</p>
        </div>
      </div>
    </footer>
  );
}
