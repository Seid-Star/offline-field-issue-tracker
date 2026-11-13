import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PrimaryButton } from "../ui/PrimaryButton.jsx";

const NAV_LINKS = [
  { label: "Home", hash: "#home" },
  { label: "Features", hash: "#features" },
  { label: "How It Works", hash: "#how-it-works" },
  { label: "About", hash: "#about" },
];

export function Navbar({ variant = "dark" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCinematic = variant === "cinematic";
  const isDark = variant === "dark" || isCinematic;

  const handleAnchorClick = (hash) => {
    setMobileOpen(false);

    if (location.pathname !== "/") {
      navigate(`/${hash}`);
      return;
    }

    document.querySelector(hash)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header
      className={
        isCinematic
          ? "absolute inset-x-0 top-0 z-40 text-white"
          : `sticky top-0 z-40 border-b transition-colors ${
              isDark
                ? "border-[#EFEEEC]/10 bg-[#0A0A0A]/90 text-[#EFEEEC] backdrop-blur-xl"
                : "border-[#BE732F]/15 bg-[#EFEEEC]/95 text-[#0A0A0A] backdrop-blur-xl"
            }`
      }
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 ${
          isCinematic ? "h-24" : "h-16"
        }`}
      >
        <Link
          to="/"
          className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F] ${
            isCinematic ? "text-2xl sm:text-3xl" : "text-sm sm:text-base"
          }`}
          style={
            isCinematic
              ? { fontFamily: "'Instrument Serif', serif" }
              : undefined
          }
        >
          {isCinematic ? (
            <>
              Fieldmark<sup className="ml-0.5 text-xs">®</sup>
            </>
          ) : (
            <>
              <img
                src="/logo.png"
                alt="Offline Field Issue Tracker"
                className="h-9 w-9 shrink-0 object-contain"
              />
              <span className="font-display">Offline Field Issue Tracker</span>
            </>
          )}
        </Link>

        <nav
          aria-label="Landing navigation"
          className={`hidden items-center md:flex ${
            isCinematic ? "gap-8" : "gap-7"
          }`}
        >
          {NAV_LINKS.map((item) => (
            <button
              key={item.hash}
              type="button"
              onClick={() => handleAnchorClick(item.hash)}
              className={`cursor-pointer whitespace-nowrap text-sm font-medium transition-colors ${
                isCinematic
                  ? item.label === "Home"
                    ? "text-white"
                    : "text-white/65 hover:text-white"
                  : isDark
                    ? "text-[#EFEEEC]/75 hover:text-[#F4B64F]"
                    : "text-[#552F0B]/75 hover:text-[#BE732F]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <Link
            to="/login"
            className={`flex min-h-[42px] items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isCinematic
                ? "text-white/85 hover:bg-white/10 hover:text-white"
                : isDark
                  ? "text-[#EFEEEC]/90 hover:bg-white/10 hover:text-[#F4B64F]"
                  : "text-[#552F0B] hover:bg-[#BE732F]/10"
            }`}
          >
            Login
          </Link>

          {isCinematic ? (
            <Link
              to="/register"
              className="rounded-full border border-[#F4B64F]/40 bg-[#552F0B]/40 px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#552F0B]/70"
            >
              Begin Reporting
            </Link>
          ) : (
            <Link to="/register">
              <PrimaryButton variant="gold" size="sm">
                Get Started
              </PrimaryButton>
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className={`-mr-2 flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl md:hidden ${
            isCinematic
              ? "text-white hover:bg-white/10"
              : isDark
                ? "text-[#EFEEEC] hover:bg-white/10"
                : "text-[#552F0B] hover:bg-[#BE732F]/10"
          }`}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          className={`mx-4 space-y-2 rounded-2xl border p-4 backdrop-blur-2xl md:hidden ${
            isCinematic
              ? "border-white/15 bg-[#0A0A0A]/95 text-white"
              : isDark
                ? "border-[#BE732F]/20 bg-[#0A0A0A]/95 text-[#EFEEEC]"
                : "border-[#BE732F]/20 bg-[#EFEEEC]/98 text-[#0A0A0A]"
          }`}
        >
          {NAV_LINKS.map((item) => (
            <button
              key={item.hash}
              type="button"
              onClick={() => handleAnchorClick(item.hash)}
              className="min-h-[44px] w-full rounded-xl px-3 text-left text-sm font-medium transition-colors hover:bg-[#BE732F]/15"
            >
              {item.label}
            </button>
          ))}

          <div className="grid grid-cols-2 gap-2.5 border-t border-current/15 pt-3">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center justify-center rounded-xl border border-current/20 text-sm font-medium"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center justify-center rounded-xl bg-[#F4B64F] text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-[#BE732F]"
            >
              Begin Reporting
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
