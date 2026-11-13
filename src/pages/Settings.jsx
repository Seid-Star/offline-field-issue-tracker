import { useState } from 'react';
import {
  Database,
  RefreshCw,
  RotateCcw,
  Shield,
  Smartphone,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Avatar } from '../components/common/Avatar.jsx';
import { Button } from '../components/common/Button.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { PWAInstallButton } from '../components/common/PWAInstallButton.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useNetwork } from '../context/NetworkContext.jsx';
import { API_CONFIG } from '../services/api.js';
import { DEMO_USERS } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';

function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return 'Unavailable';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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

  const [confirmModal, setConfirmModal] = useState(null); // 'reset' | 'clear' | null
  const [busy, setBusy] = useState(false);

  const handleConfirmAction = async () => {
    setBusy(true);
    try {
      if (confirmModal === 'reset') {
        await resetDemoData();
      } else if (confirmModal === 'clear') {
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
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Settings' }]}
    >
      <div className="max-w-4xl mx-auto space-y-5">
        {/* User Profile & Demo Role */}
        <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#123D35]/10">
            <div className="flex items-center gap-4">
              <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" />
              <div>
                <h2 className="text-lg font-semibold text-[#172B27] font-display">
                  {currentUser.name}
                </h2>
                <p className="text-sm text-[#71817B]">
                  {currentUser.role} · {currentUser.unit}
                </p>
                <p className="text-xs text-[#71817B] font-mono mt-0.5">{currentUser.email}</p>
              </div>
            </div>
            <PWAInstallButton />
          </div>

          <div className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-[#123D35]" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-[#172B27]">
                Demo Role Selection
              </h3>
            </div>
            <p className="text-xs text-[#71817B] mb-3">
              Switch between Field Worker and Operations Coordinator personas to test report submission and coordinator triage rules.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(DEMO_USERS).map((persona) => {
                const active = demoRole === persona.roleKey;
                return (
                  <button
                    key={persona.roleKey}
                    type="button"
                    onClick={() => switchRole(persona.roleKey)}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      active
                        ? 'bg-[#123D35]/8 border-[#123D35] ring-1 ring-[#123D35]/20'
                        : 'bg-[#F5F7F5] border-[#123D35]/10 hover:bg-[#EAEFEA]'
                    }`}
                  >
                    <Avatar src={persona.avatar} name={persona.name} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#172B27]">{persona.role}</p>
                      <p className="text-xs text-[#71817B] truncate">
                        {persona.name} · {persona.unit}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Connectivity & Simulation */}
        <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {effectiveOnline ? (
                <Wifi className="w-4 h-4 text-[#16A477]" aria-hidden="true" />
              ) : (
                <WifiOff className="w-4 h-4 text-[#E6A23C]" aria-hidden="true" />
              )}
              <h3 className="text-base font-semibold text-[#172B27] font-display">
                Connectivity &amp; Adapter Reachability
              </h3>
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={isChecking}
              onClick={() => checkConnectivity()}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>Re-check Reachability</span>
            </Button>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-[#F5F7F5] p-3.5 border border-[#123D35]/8">
              <dt className="text-[#71817B]">Browser navigator.onLine</dt>
              <dd className="mt-1 text-sm font-semibold text-[#172B27]">
                {isBrowserOnline ? 'Online' : 'Offline'}
              </dd>
            </div>
            <div className="rounded-xl bg-[#F5F7F5] p-3.5 border border-[#123D35]/8">
              <dt className="text-[#71817B]">Simulated API Reachable</dt>
              <dd className="mt-1 text-sm font-semibold text-[#172B27]">
                {isServerReachable ? 'Reachable' : 'Unreachable'}
              </dd>
            </div>
            <div className="rounded-xl bg-[#F5F7F5] p-3.5 border border-[#123D35]/8">
              <dt className="text-[#71817B]">Last Probe</dt>
              <dd className="mt-1 text-sm font-medium text-[#172B27] font-mono tabular-nums">
                {formatDateTime(lastCheckedAt)}
              </dd>
            </div>
          </dl>

          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between gap-4 py-2 border-t border-[#123D35]/8">
              <div>
                <p className="text-sm font-medium text-[#172B27]">Simulate Offline Mode</p>
                <p className="text-xs text-[#71817B]">
                  Force the app into offline mode to test local IndexedDB report creation and queuing.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={simulatedOffline}
                onClick={() => toggleSimulatedOffline()}
                className={`w-12 h-7 rounded-full transition-colors p-1 shrink-0 cursor-pointer ${
                  simulatedOffline ? 'bg-[#E6A23C]' : 'bg-[#123D35]/20'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    simulatedOffline ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 py-2 border-t border-[#123D35]/8">
              <div>
                <p className="text-sm font-medium text-[#172B27]">Simulate Server Sync Error (503)</p>
                <p className="text-xs text-[#71817B]">
                  Test failed synchronization handling and verify reports remain safely preserved for retry.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={simulatedFailSync}
                onClick={() => toggleSimulatedFailSync()}
                className={`w-12 h-7 rounded-full transition-colors p-1 shrink-0 cursor-pointer ${
                  simulatedFailSync ? 'bg-[#DC5555]' : 'bg-[#123D35]/20'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    simulatedFailSync ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Data Storage & Reset Controls */}
        <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#123D35]" aria-hidden="true" />
            <h3 className="text-base font-semibold text-[#172B27] font-display">
              IndexedDB Local Storage (Dexie.js)
            </h3>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-[#F5F7F5] p-3.5 border border-[#123D35]/8">
              <dt className="text-[#71817B]">Reports Table</dt>
              <dd className="mt-1 text-lg font-semibold text-[#172B27] font-display tabular-nums">
                {storageInfo.reportsCount}
              </dd>
            </div>
            <div className="rounded-xl bg-[#F5F7F5] p-3.5 border border-[#123D35]/8">
              <dt className="text-[#71817B]">Sync Queue</dt>
              <dd className="mt-1 text-lg font-semibold text-[#172B27] font-display tabular-nums">
                {storageInfo.queueCount}
              </dd>
            </div>
            <div className="rounded-xl bg-[#F5F7F5] p-3.5 border border-[#123D35]/8">
              <dt className="text-[#71817B]">Activity Events</dt>
              <dd className="mt-1 text-lg font-semibold text-[#172B27] font-display tabular-nums">
                {storageInfo.activitiesCount}
              </dd>
            </div>
            <div className="rounded-xl bg-[#F5F7F5] p-3.5 border border-[#123D35]/8">
              <dt className="text-[#71817B]">Browser Storage Used</dt>
              <dd className="mt-1 text-sm font-semibold text-[#172B27] font-mono tabular-nums">
                {formatBytes(storageInfo.usageBytes)}
              </dd>
            </div>
          </dl>

          <div className="pt-3 border-t border-[#123D35]/10 flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setConfirmModal('reset')}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore Demo Dataset</span>
            </Button>
            <Button
              variant="danger-outline"
              onClick={() => setConfirmModal('clear')}
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Local Data</span>
            </Button>
          </div>
        </section>

        {/* Application Information */}
        <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#123D35]" aria-hidden="true" />
            <h3 className="text-base font-semibold text-[#172B27] font-display">
              Application &amp; Architecture Info
            </h3>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-[#71817B]">Application</dt>
              <dd className="mt-0.5 font-medium text-[#172B27]">
                Offline Field Issue Tracker · NilePixel Technologies Cohort 1
              </dd>
            </div>
            <div>
              <dt className="text-[#71817B]">Data Adapter Mode</dt>
              <dd className="mt-0.5 font-mono text-[#172B27]">
                {API_CONFIG.mode} (target: {API_CONFIG.baseUrl})
              </dd>
            </div>
            <div>
              <dt className="text-[#71817B]">Offline Layers</dt>
              <dd className="mt-0.5 text-[#172B27]">
                Service Worker (App Shell) + Dexie IndexedDB (Reports) + Sync Queue (Deferred Handoff)
              </dd>
            </div>
            <div>
              <dt className="text-[#71817B]">Backend Integration Contract</dt>
              <dd className="mt-0.5 font-mono text-[#172B27]">docs/API_CONTRACT.md</dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={Boolean(confirmModal)}
        onClose={() => setConfirmModal(null)}
        title={
          confirmModal === 'clear'
            ? 'Clear all local IndexedDB data?'
            : 'Restore sample demo dataset?'
        }
        subtitle={
          confirmModal === 'clear'
            ? 'This permanently removes all reports, sync queue entries, and activity logs from this browser.'
            : 'This replaces current local records with the initial 10 realistic field operations reports.'
        }
      >
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="secondary" onClick={() => setConfirmModal(null)} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant={confirmModal === 'clear' ? 'danger' : 'primary'}
            onClick={handleConfirmAction}
            disabled={busy}
          >
            {busy
              ? 'Processing...'
              : confirmModal === 'clear'
                ? 'Yes, Clear Local Data'
                : 'Restore Demo Data'}
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}
