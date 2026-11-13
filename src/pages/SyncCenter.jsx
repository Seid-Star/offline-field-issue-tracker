import { AppShell } from '../components/layout/AppShell.jsx';
import { SyncCenterPanel } from '../components/sync/SyncCenterPanel.jsx';

export function SyncCenter() {
  return (
    <AppShell
      title="Synchronization Center"
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Sync Center' }]}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="rounded-2xl bg-white border border-[#123D35]/10 p-4 text-xs text-[#71817B] leading-relaxed">
          <strong className="text-[#172B27]">Important Distinction:</strong> An{' '}
          <span className="font-medium text-[#9A6510]">Offline / Pending</span> report is safely stored in IndexedDB awaiting transmission—it is not a{' '}
          <span className="font-medium text-[#B23B3B]">Failed</span> report. Failed items reflect an attempted sync rejected or timed out by the simulated backend adapter and remain intact for idempotent retry.
        </div>

        <SyncCenterPanel />
      </div>
    </AppShell>
  );
}
