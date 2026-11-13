import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SyncCenterPanel } from './SyncCenterPanel.jsx';

export function SyncCenterDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#092B27]/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Synchronization Center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-modal w-full max-w-xl h-full bg-[#F5F7F5] shadow-2xl border-l border-[#123D35]/15 flex flex-col">
        <div className="px-5 py-4 bg-white border-b border-[#123D35]/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#172B27] font-display">
              Synchronization Center
            </h2>
            <p className="text-xs text-[#71817B]">
              Local IndexedDB queue &amp; simulated server handoff
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Synchronization Center"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#71817B] hover:text-[#172B27] hover:bg-[#F5F7F5] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <SyncCenterPanel compact onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
