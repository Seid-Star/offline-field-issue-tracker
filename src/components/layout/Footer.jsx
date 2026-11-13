import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const PLATFORM_LINKS = [
  { label: "Features", href: "/#features", external: true },
  { label: "How It Works", href: "/#how-it-works", external: true },
  { label: "About", href: "/#about", external: true },
  { label: "Live Workspace", href: "/dashboard" },
];

const ACCOUNT_LINKS = [
  { label: "Sign In to Workspace", href: "/login" },
  { label: "Create Field Account", href: "/register" },
  { label: "Browse Local Reports", href: "/reports" },
  { label: "Synchronization Center", href: "/sync" },
];

function FooterLink({ item }) {
  const className =
    "group inline-flex items-center gap-1.5 text-sm text-[#EFEEEC]/65 transition-colors duration-200 hover:text-[#F4B64F]";

  if (item.external) {
    return (
      <a href={item.href} className={className}>
        {item.label}
        <ArrowUpRight
          className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
          aria-hidden="true"
        />
      </a>
    );
  }

  return (
    <Link to={item.href} className={className}>
      {item.label}
      <ArrowUpRight
        className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
        aria-hidden="true"
      />
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0A0A0A] text-[#EFEEEC]">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -top-40 right-[-8rem] h-80 w-80 rounded-full bg-[#552F0B]/25 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 border-b border-[#EFEEEC]/10 py-14 md:grid-cols-12 md:gap-10 lg:py-16">
          {/* Brand */}
          <div className="space-y-6 md:col-span-5">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="Offline Field Issue Tracker home"
            >
              <img
                src="/logo.png"
                alt="Offline Field Issue Tracker"
                className="h-12 w-12 shrink-0 object-contain"
              />

              <span className="text-lg font-bold tracking-tight text-[#EFEEEC]">
                Offline Field Issue Tracker
              </span>
            </Link>

            <p className="max-w-md text-sm leading-7 text-[#EFEEEC]/60">
              Resilient field operations reporting built for disconnected
              environments. Capture, manage, and synchronize field issues
              reliably, even when connectivity is unavailable.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <span className="h-2 w-2 rounded-full bg-[#F4B64F]" />
              <span className="text-xs font-medium tracking-wide text-[#EFEEEC]/55">
                BUILT FOR RELIABLE FIELD OPERATIONS
              </span>
            </div>
          </div>

          {/* Platform navigation */}
          <div className="space-y-5 md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4B64F]">
              Platform
            </h3>

            <ul className="space-y-4">
              {PLATFORM_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </div>

          {/* Account navigation */}
          <div className="space-y-5 md:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4B64F]">
              Access &amp; Accounts
            </h3>

            <ul className="space-y-4">
              {ACCOUNT_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-[#EFEEEC]/45">
            © {new Date().getFullYear()} Offline Field Issue Tracker.
            <span className="mx-1.5 text-[#BE732F]">·</span>
            Seid Jemal
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#EFEEEC]/45">
            <span className="rounded-full border border-[#BE732F]/30 bg-[#552F0B]/25 px-3 py-1.5 text-[#F4B64F]/80">
              Offline-first PWA
            </span>
            <span>Powered by IndexedDB &amp; Service Worker</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
