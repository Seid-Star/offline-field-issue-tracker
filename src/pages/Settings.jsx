import { useState } from "react";
import {
  Database,
  RefreshCw,
  RotateCcw,
  Shield,
  Smartphone,
  Trash2,
  Wifi,
  WifiOff,
  HardDrive,
  Activity,
  Server,
  Clock3,
  Cloud,
} from "lucide-react";
import { Avatar } from "../components/common/Avatar.jsx";
import { Button } from "../components/common/Button.jsx";
import { Modal } from "../components/common/Modal.jsx";
import { PWAInstallButton } from "../components/common/PWAInstallButton.jsx";
import { AppShell } from "../components/layout/AppShell.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useNetwork } from "../context/NetworkContext.jsx";
import { API_CONFIG } from "../services/api.js";
import { DEMO_USERS } from "../utils/constants.js";
import { formatDateTime } from "../utils/formatters.js";

function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return "Unavailable";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4B64F]/20 text-[#BE732F]">
        <Icon size={19} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <h3 className="text-base font-bold tracking-tight text-[#0A0A0A]">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-xs leading-relaxed text-[#552F0B]/60">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusCard({ label, value, icon: Icon, active, detail }) {
  return (
    <div className="rounded-xl border border-[#BE732F]/15 bg-[#EFEEEC] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#552F0B]/55">
          {label}
        </span>

        <Icon
          size={16}
          className={active ? "text-[#BE732F]" : "text-[#552F0B]/40"}
        />
      </div>

      <p className="mt-3 text-lg font-bold tracking-tight text-[#0A0A0A]">
        {value}
      </p>

      {detail && <p className="mt-1 text-[10px] text-[#552F0B]/50">{detail}</p>}
    </div>
  );
}

function StorageCard({ label, value, icon: Icon, detail }) {
  return (
    <div className="rounded-xl border border-[#BE732F]/15 bg-[#EFEEEC] p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#552F0B]/55">
          {label}
        </span>

        <Icon size={16} className="text-[#BE732F]" />
      </div>

      <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight text-[#0A0A0A]">
        {value}
      </p>

      {detail && <p className="mt-1 text-[10px] text-[#552F0B]/50">{detail}</p>}
    </div>
  );
}

function SettingSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F] focus-visible:ring-offset-2 ${
        checked ? "bg-[#BE732F]" : "bg-[#552F0B]/20"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function Settings() {
  const {
    currentUser,
    demoRole,
    switchRole,
    storageInfo,
    resetDemoData,
    clearAllData,
  } = useApp();

  const {
    isBrowserOnline,
    isServerReachable,
    effectiveOnline,
    simulatedOffline,
    simulatedFailSync,
    lastCheckedAt,
    isChecking,
    checkConnectivity,
    toggleSimulatedOffline,
    toggleSimulatedFailSync,
  } = useNetwork();

  const [confirmModal, setConfirmModal] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleConfirmAction = async () => {
    setBusy(true);

    try {
      if (confirmModal === "reset") {
        await resetDemoData();
      } else if (confirmModal === "clear") {
        await clearAllData();
      }

      setConfirmModal(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell
      title="Settings & Storage"
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Settings" },
      ]}
    >
      <div className="mx-auto max-w-5xl space-y-6 pb-8">
        {/* Page introduction */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A] p-5 text-[#EFEEEC] sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#BE732F]/15 blur-[75px]" />

          <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4B64F]">
                Workspace configuration
              </p>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Control your workspace.
              </h2>

              <p className="mt-2 max-w-lg text-xs leading-6 text-[#EFEEEC]/55 sm:text-sm">
                Manage your profile, connectivity, local data, and application
                environment from one place.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#F4B64F]/20 bg-[#F4B64F]/10">
              <Database size={26} className="text-[#F4B64F]" />
            </div>
          </div>
        </div>

        {/* Profile and demo role */}
        <section className="space-y-5 rounded-2xl border border-[#BE732F]/15 bg-white p-5 shadow-[0_8px_30px_rgba(85,47,11,0.04)] sm:p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-[#BE732F]/15 pb-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="lg"
              />

              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold tracking-tight text-[#0A0A0A]">
                  {currentUser.name}
                </h2>

                <p className="mt-0.5 text-xs text-[#BE732F]">
                  {currentUser.role} · {currentUser.unit}
                </p>

                <p className="mt-1 truncate text-xs text-[#552F0B]/55">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <PWAInstallButton />
          </div>

          <div>
            <SectionHeading
              icon={Shield}
              title="Demo Role Selection"
              description="Switch between personas to test field reporting and coordinator workflows."
            />

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.values(DEMO_USERS).map((persona) => {
                const active = demoRole === persona.roleKey;

                return (
                  <button
                    key={persona.roleKey}
                    type="button"
                    onClick={() => switchRole(persona.roleKey)}
                    aria-pressed={active}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F] ${
                      active
                        ? "border-[#BE732F] bg-[#F4B64F]/10 shadow-[0_0_0_1px_rgba(190,115,47,0.15)]"
                        : "border-[#BE732F]/15 bg-[#EFEEEC]/60 hover:border-[#BE732F]/40 hover:bg-[#EFEEEC]"
                    }`}
                  >
                    <Avatar
                      src={persona.avatar}
                      name={persona.name}
                      size="md"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#0A0A0A]">
                        {persona.role}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-[#552F0B]/55">
                        {persona.name} · {persona.unit}
                      </p>
                    </div>

                    {active && <CheckCircle2Icon />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Connectivity */}
        <section className="space-y-5 rounded-2xl border border-[#BE732F]/15 bg-white p-5 shadow-[0_8px_30px_rgba(85,47,11,0.04)] sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <SectionHeading
              icon={Activity}
              title="Connectivity & Reachability"
              description="Monitor browser connectivity and backend availability."
            />

            <Button
              variant="secondary"
              size="sm"
              disabled={isChecking}
              onClick={() => checkConnectivity()}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isChecking ? "animate-spin" : ""}`}
              />
              <span>Re-check</span>
            </Button>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              effectiveOnline
                ? "border-[#BE732F]/20 bg-[#F4B64F]/10"
                : "border-[#552F0B]/20 bg-[#552F0B]/5"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
              {effectiveOnline ? (
                <Wifi size={19} className="text-[#BE732F]" />
              ) : (
                <WifiOff size={19} className="text-[#552F0B]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#0A0A0A]">
                {effectiveOnline ? "Connection available" : "Currently offline"}
              </p>

              <p className="mt-0.5 text-[11px] text-[#552F0B]/60">
                {simulatedOffline
                  ? "Offline mode is being simulated."
                  : "Based on the current connectivity state."}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${
                effectiveOnline
                  ? "bg-[#F4B64F]/25 text-[#552F0B]"
                  : "bg-[#552F0B]/10 text-[#552F0B]"
              }`}
            >
              {effectiveOnline ? "Online" : "Offline"}
            </span>
          </div>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatusCard
              label="Browser Status"
              value={isBrowserOnline ? "Online" : "Offline"}
              icon={Smartphone}
              active={isBrowserOnline}
              detail="navigator.onLine"
            />

            <StatusCard
              label="API Reachability"
              value={isServerReachable ? "Reachable" : "Unreachable"}
              icon={Server}
              active={isServerReachable}
              detail="Backend connection probe"
            />

            <StatusCard
              label="Last Probe"
              value={
                lastCheckedAt ? formatDateTime(lastCheckedAt) : "Not checked"
              }
              icon={Clock3}
              active={Boolean(lastCheckedAt)}
              detail="Most recent connectivity check"
            />
          </dl>

          <div className="space-y-1 border-t border-[#BE732F]/15 pt-3">
            <div className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0A0A0A]">
                  Simulate Offline Mode
                </p>

                <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#552F0B]/60">
                  Force offline mode to test local IndexedDB report creation and
                  synchronization queuing.
                </p>
              </div>

              <SettingSwitch
                checked={simulatedOffline}
                onChange={() => toggleSimulatedOffline()}
                label="Simulate offline mode"
              />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[#BE732F]/10 py-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0A0A0A]">
                  Simulate Server Sync Error
                </p>

                <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#552F0B]/60">
                  Simulate a 503 response to test failed synchronization and
                  safe retry handling.
                </p>
              </div>

              <SettingSwitch
                checked={simulatedFailSync}
                onChange={() => toggleSimulatedFailSync()}
                label="Simulate server synchronization error"
              />
            </div>
          </div>
        </section>

        {/* Local storage */}
        <section className="space-y-5 rounded-2xl border border-[#BE732F]/15 bg-white p-5 shadow-[0_8px_30px_rgba(85,47,11,0.04)] sm:p-6">
          <SectionHeading
            icon={HardDrive}
            title="Local Data & Storage"
            description="Review locally stored records and manage your browser database."
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StorageCard
              label="Reports"
              value={storageInfo.reportsCount}
              icon={Database}
              detail="Stored records"
            />

            <StorageCard
              label="Sync Queue"
              value={storageInfo.queueCount}
              icon={RefreshCw}
              detail="Pending handoffs"
            />

            <StorageCard
              label="Activity"
              value={storageInfo.activitiesCount}
              icon={Activity}
              detail="Activity events"
            />

            <StorageCard
              label="Storage Used"
              value={formatBytes(storageInfo.usageBytes)}
              icon={HardDrive}
              detail="Browser storage"
            />
          </div>

          <div className="rounded-xl border border-[#BE732F]/15 bg-[#EFEEEC]/60 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4B64F]/25">
                <Cloud size={16} className="text-[#BE732F]" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#0A0A0A]">
                  Offline-first data protection
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-[#552F0B]/60">
                  Reports are stored locally using Dexie.js and queued for
                  synchronization when connectivity becomes available.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#BE732F]/15 pt-4 sm:flex-row sm:flex-wrap">
            <Button
              variant="secondary"
              onClick={() => setConfirmModal("reset")}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restore Demo Dataset</span>
            </Button>

            <Button
              variant="danger-outline"
              onClick={() => setConfirmModal("clear")}
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All Local Data</span>
            </Button>
          </div>
        </section>

        {/* Application information */}
        <section className="space-y-5 rounded-2xl border border-[#BE732F]/15 bg-white p-5 shadow-[0_8px_30px_rgba(85,47,11,0.04)] sm:p-6">
          <SectionHeading
            icon={Smartphone}
            title="Application Information"
            description="Technical details about this application and its offline architecture."
          />

          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[#552F0B]/50">
                Application
              </dt>

              <dd className="mt-1.5 text-sm font-semibold text-[#0A0A0A]">
                Offline Field Issue Tracker
              </dd>

              <dd className="mt-0.5 text-[11px] text-[#552F0B]/55">
                NilePixel Technologies
              </dd>
            </div>

            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[#552F0B]/50">
                Data Adapter Mode
              </dt>

              <dd className="mt-1.5 break-all font-mono text-xs font-semibold text-[#0A0A0A]">
                {API_CONFIG.mode}
              </dd>

              <dd className="mt-0.5 break-all text-[11px] text-[#552F0B]/55">
                Target: {API_CONFIG.baseUrl}
              </dd>
            </div>

            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[#552F0B]/50">
                Offline Architecture
              </dt>

              <dd className="mt-1.5 text-xs leading-relaxed text-[#0A0A0A]">
                Service Worker · Dexie IndexedDB · Deferred Sync Queue
              </dd>
            </div>

            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[#552F0B]/50">
                Backend Integration
              </dt>

              <dd className="mt-1.5 font-mono text-xs text-[#0A0A0A]">
                docs/API_CONTRACT.md
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Confirmation modal */}
      <Modal
        isOpen={Boolean(confirmModal)}
        onClose={() => !busy && setConfirmModal(null)}
        title={
          confirmModal === "clear"
            ? "Clear all local data?"
            : "Restore demo dataset?"
        }
        subtitle={
          confirmModal === "clear"
            ? "This permanently removes all reports, sync queue entries, and activity logs from this browser."
            : "This replaces current local records with the initial 10 realistic field operations reports."
        }
      >
        <div className="flex flex-col-reverse justify-end gap-2.5 pt-2 sm:flex-row">
          <Button
            variant="secondary"
            onClick={() => setConfirmModal(null)}
            disabled={busy}
          >
            Cancel
          </Button>

          <Button
            variant={confirmModal === "clear" ? "danger" : "primary"}
            onClick={handleConfirmAction}
            disabled={busy}
          >
            {busy
              ? "Processing..."
              : confirmModal === "clear"
                ? "Yes, Clear Local Data"
                : "Restore Demo Data"}
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}

function CheckCircle2Icon() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F4B64F]/25 text-[#BE732F]">
      <Shield size={14} />
    </span>
  );
}
