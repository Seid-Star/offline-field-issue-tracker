import { useState } from 'react';
import { Download, Share, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall.js';
import { Button } from './Button.jsx';
import { Modal } from './Modal.jsx';

export function PWAInstallButton({ compact = false, variant = 'secondary' }) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <Button
        variant={variant}
        size={compact ? 'sm' : 'md'}
        onClick={install}
        title="Install Offline Field Issue Tracker as an app"
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </Button>
    );
  }

  if (isIOS) {
    return (
      <>
        <Button
          variant={variant}
          size={compact ? 'sm' : 'md'}
          onClick={() => setShowGuide(true)}
        >
          <Smartphone className="w-4 h-4" />
          <span>Install on iOS</span>
        </Button>

        <Modal
          isOpen={showGuide}
          onClose={() => setShowGuide(false)}
          title="Install FieldTrack on iPhone or iPad"
          subtitle="Run offline from your home screen with cached app shell and local IndexedDB."
        >
          <ol className="space-y-3 text-sm text-[#172B27]">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#123D35] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                1
              </span>
              <span>
                Tap the <strong className="inline-flex items-center gap-1"><Share className="w-3.5 h-3.5" /> Share</strong> button in Safari&apos;s toolbar.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#123D35] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                2
              </span>
              <span>
                Scroll down and select <strong>Add to Home Screen</strong>.
              </span>
            </li>
          </ol>
          <div className="mt-5 flex justify-end">
            <Button onClick={() => setShowGuide(false)}>Done</Button>
          </div>
        </Modal>
      </>
    );
  }

  return null;
}
