import { useEffect, useState } from "react";
import { WifiOff, X } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { useNetwork } from "../../context/NetworkContext.jsx";
import { SyncCenterDrawer } from "../sync/SyncCenterDrawer.jsx";
import { Header } from "./Header.jsx";
import { MobileBottomNav } from "./MobileBottomNav.jsx";
import { Sidebar } from "./Sidebar.jsx";

export function AppShell({ title, breadcrumbs = [], children }) {
  const { syncDrawerOpen, setSyncDrawerOpen } = useApp();

  const { effectiveOnline, toggleSimulatedOffline, simulatedOffline } =
    useNetwork();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex min-h-screen bg-[#EFEEEC] text-[#0A0A0A]">
      {/* Desktop Sidebar */}
      <div className="sticky top-0 hidden h-screen shrink-0 p-3 pr-0 lg:block">
        <div className="h-full overflow-hidden rounded-[22px] border border-[#BE732F]/20 shadow-[0_12px_40px_rgba(10,10,10,0.12)]">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-[#0A0A0A]/65 backdrop-blur-sm lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
        >
          <div className="relative h-full w-72 max-w-[82vw] animate-modal shadow-[15px_0_50px_rgba(0,0,0,0.25)]">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-3 top-3 flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-xl border border-[#EFEEEC]/15 bg-[#EFEEEC]/[0.06] text-[#EFEEEC]/75 transition-colors hover:bg-[#F4B64F]/15 hover:text-[#F4B64F]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Application Column */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header
          title={title}
          breadcrumbs={breadcrumbs}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Offline Status Banner */}
        {!effectiveOnline && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BE732F]/25 bg-[#552F0B] px-4 py-3 text-[#EFEEEC] lg:px-7">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#F4B64F]/25 bg-[#F4B64F]/15">
                <WifiOff
                  className="h-3.5 w-3.5 text-[#F4B64F]"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-[#F4B64F]">
                  Offline Mode Active
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#EFEEEC]/75">
                  Reports are saved locally and safely queued for
                  synchronization.
                </p>
              </div>
            </div>

            {simulatedOffline && (
              <button
                type="button"
                onClick={() => toggleSimulatedOffline(false)}
                className="shrink-0 cursor-pointer rounded-lg border border-[#F4B64F]/30 bg-[#F4B64F]/10 px-3 py-2 text-[11px] font-semibold text-[#F4B64F] transition-colors hover:bg-[#F4B64F]/20"
              >
                Reconnect Simulation
              </button>
            )}
          </div>
        )}

        {/* Page Content */}
        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-5 pb-28 sm:px-5 lg:px-7 lg:py-7 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Synchronization Drawer */}
      <SyncCenterDrawer
        isOpen={syncDrawerOpen}
        onClose={() => setSyncDrawerOpen(false)}
      />
    </div>
  );
}
