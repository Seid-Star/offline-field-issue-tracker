import { AlertCircle, CheckCircle2, Info, ShieldCheck } from "lucide-react";
import { AppShell } from "../components/layout/AppShell.jsx";
import { SyncCenterPanel } from "../components/sync/SyncCenterPanel.jsx";

export function SyncCenter() {
  return (
    <AppShell
      title="Synchronization Center"
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Sync Center" },
      ]}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Page introduction */}
        <section className="relative overflow-hidden rounded-[26px] border border-[#BE732F]/20 bg-[#0A0A0A] px-5 py-6 text-[#EFEEEC] shadow-[0_12px_35px_rgba(10,10,10,0.10)] sm:px-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-[#F4B64F]/15"
          />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#F4B64F]/25 bg-[#F4B64F]/10 text-[#F4B64F]">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.7} />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-[0.16em] text-[#F4B64F]">
                DATA RELIABILITY
              </span>

              <h2 className="mt-1 font-display text-xl font-bold tracking-tight sm:text-2xl">
                Synchronization Management
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#EFEEEC]/60">
                Monitor your local synchronization queue, manage transmission
                attempts, and ensure field reports remain safely stored until
                they can be synchronized.
              </p>
            </div>
          </div>
        </section>

        {/* Important distinction */}
        <section className="rounded-[22px] border border-[#BE732F]/20 bg-white p-4 shadow-[0_6px_24px_rgba(85,47,11,0.035)] sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4B64F]/15 text-[#552F0B]">
              <Info className="h-4.5 w-4.5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0A0A0A]">
                Understanding Synchronization States
              </h3>

              <p className="mt-1.5 text-xs leading-6 text-[#552F0B]/70">
                Not every report waiting for synchronization has failed. Pending
                reports are safely stored in IndexedDB and are waiting for
                transmission. Failed reports have experienced an unsuccessful
                synchronization attempt and remain preserved for retry.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#BE732F]/15 pt-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl bg-[#F4B64F]/[0.09] p-3.5">
              <ClockIcon />
              <div>
                <p className="text-xs font-bold text-[#552F0B]">
                  Pending / Offline
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[#552F0B]/65">
                  Stored locally and waiting for a synchronization opportunity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-[#552F0B]/[0.055] p-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#552F0B]" />
              <div>
                <p className="text-xs font-bold text-[#552F0B]">Failed</p>
                <p className="mt-1 text-[11px] leading-5 text-[#552F0B]/65">
                  An attempted transmission was unsuccessful. The report is
                  preserved for an idempotent retry.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold tracking-wide text-[#BE732F]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            LOCAL DATA IS PRESERVED DURING SYNCHRONIZATION RETRIES
          </div>
        </section>

        {/* Synchronization interface */}
        <SyncCenterPanel />
      </div>
    </AppShell>
  );
}

function ClockIcon() {
  return (
    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-[#BE732F]">
      <span className="text-sm font-bold">◷</span>
    </div>
  );
}
