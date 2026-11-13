import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthLayout({
  theme = 'glass',
  children,
  aside = null,
}) {
  const isGlass = theme === 'glass';

  return (
    <div
      className={`min-h-screen relative overflow-hidden flex flex-col ${
        isGlass
          ? 'bg-gradient-to-br from-[#092B27] via-[#0F352E] to-[#123D35] text-white'
          : 'bg-gradient-to-br from-[#F5F7F5] via-[#ECF3EF] to-[#E6EFEA] text-[#172B27]'
      }`}
    >
      {/* Subtle Ambient Decorative Backdrop */}
      {isGlass ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-[#16A477]/22 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#1B5B4C]/35 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-[#E6A23C]/10 blur-3xl" />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-28 -right-20 w-96 h-96 rounded-full bg-[#16A477]/12 blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#123D35]/8 blur-3xl" />
        </div>
      )}

      {/* Minimal Top Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A477]"
        >
          <span className="w-9 h-9 rounded-xl bg-[#16A477] text-[#092B27] flex items-center justify-center shadow-sm shrink-0">
            <MapPin className="w-4 h-4" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="text-sm sm:text-base font-bold font-display tracking-tight">
            Offline Field Issue Tracker
          </span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <Link
            to="/"
            className={`font-medium transition-colors ${
              isGlass
                ? 'text-white/75 hover:text-white'
                : 'text-[#71817B] hover:text-[#123D35]'
            }`}
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div
          className={`w-full mx-auto ${
            aside
              ? 'max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'
              : 'max-w-xl'
          }`}
        >
          <div className={aside ? 'lg:col-span-6' : 'w-full'}>{children}</div>
          {aside && <div className="hidden lg:block lg:col-span-6">{aside}</div>}
        </div>
      </main>
    </div>
  );
}
