import { useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import { SyncCenterPanel } from "./SyncCenterPanel.jsx";

export function SyncCenterDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0A0A0A]/65 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-label="Synchronization Center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside className="animate-modal flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-[#BE732F]/25 bg-[#EFEEEC] shadow-[-20px_0_60px_rgba(10,10,10,0.2)]">
        {/* Header */}
        <header className="relative shrink-0 overflow-hidden border-b border-[#BE732F]/20 bg-[#0A0A0A] px-5 py-5 sm:px-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full border border-[#F4B64F]/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full border border-[#BE732F]/20"
          />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#F4B64F]/25 bg-[#F4B64F]/10 text-[#F4B64F]">
                <RefreshCw className="h-5 w-5" strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h2 className="font-display text-base font-bold tracking-tight text-[#EFEEEC] sm:text-lg">
                  Synchronization Center
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#EFEEEC]/55">
                  Local queue management and server synchronization
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Synchronization Center"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#EFEEEC]/10 bg-[#EFEEEC]/[0.06] text-[#EFEEEC]/65 transition-all duration-200 hover:border-[#F4B64F]/35 hover:bg-[#F4B64F]/10 hover:text-[#F4B64F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mt-5 h-[2px] w-full overflow-hidden rounded-full bg-[#EFEEEC]/10">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#BE732F] to-[#F4B64F]" />
          </div>
        </header>

        {/* Scrollable content */}
        <main className="min-h-0 flex-1 overflow-y-auto bg-[#EFEEEC] p-4 sm:p-6">
          <SyncCenterPanel compact onNavigate={onClose} />
        </main>

        {/* Footer */}
        <footer className="shrink-0 border-t border-[#BE732F]/15 bg-[#EFEEEC] px-5 py-3 sm:px-7">
          <p className="text-center text-[10px] font-semibold tracking-[0.16em] text-[#552F0B]/55">
            OFFLINE-FIRST FIELD OPERATIONS
          </p>
        </footer>
      </aside>
    </div>
  );
}
