import { useEffect, useState } from 'react';
import { WifiOff, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useNetwork } from '../../context/NetworkContext.jsx';
import { SyncCenterDrawer } from '../sync/SyncCenterDrawer.jsx';
import { Header } from './Header.jsx';
import { MobileBottomNav } from './MobileBottomNav.jsx';
import { Sidebar } from './Sidebar.jsx';

export function AppShell({ title, breadcrumbs = [], children }) {
  const { syncDrawerOpen, setSyncDrawerOpen } = useApp();
  const { effectiveOnline, toggleSimulatedOffline, simulatedOffline } = useNetwork();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#F5F7F5] text-[#172B27] flex">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen shrink-0 p-3 pr-0">
        <div className="h-full rounded-2xl overflow-hidden shadow-xl">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex bg-[#092B27]/55 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="relative h-full w-72 max-w-[82vw]">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <Header
          title={title}
          breadcrumbs={breadcrumbs}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Non-intrusive offline indicator banner */}
        {!effectiveOnline && (
          <div className="bg-[#092B27] text-white px-4 lg:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-[#E6A23C] shrink-0" aria-hidden="true" />
              <span>
                Offline Mode active — Reports are saved to IndexedDB and queued safely for sync.
              </span>
            </div>
            {simulatedOffline && (
              <button
                type="button"
                onClick={() => toggleSimulatedOffline(false)}
                className="text-[#16A477] hover:underline font-semibold cursor-pointer"
              >
                Reconnect Simulation
              </button>
            )}
          </div>
        )}

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-5 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      <MobileBottomNav />

      <SyncCenterDrawer
        isOpen={syncDrawerOpen}
        onClose={() => setSyncDrawerOpen(false)}
      />
    </div>
  );
}
