import { useState } from "react";
import {
  Download,
  Share,
  Smartphone,
  PlusSquare,
  ArrowDownToLine,
  CheckCircle2,
} from "lucide-react";
import { usePWAInstall } from "../../hooks/usePWAInstall.js";
import { Button } from "./Button.jsx";
import { Modal } from "./Modal.jsx";

export function PWAInstallButton({ compact = false, variant = "secondary" }) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <Button
        variant={variant}
        size={compact ? "sm" : "md"}
        onClick={install}
        title="Install Offline Field Issue Tracker as an app"
      >
        <Download className="h-4 w-4" />
        <span>Install App</span>
      </Button>
    );
  }

  if (isIOS) {
    return (
      <>
        <Button
          variant={variant}
          size={compact ? "sm" : "md"}
          onClick={() => setShowGuide(true)}
          title="Learn how to install the app on your iPhone or iPad"
        >
          <Smartphone className="h-4 w-4" />
          <span>Install on iOS</span>
        </Button>

        <Modal
          isOpen={showGuide}
          onClose={() => setShowGuide(false)}
          title="Install on your iPhone or iPad"
          subtitle="Add FieldTrack to your Home Screen for a convenient app-like experience."
        >
          <div className="space-y-5">
            {/* Intro */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#BE732F]/20 bg-[#F4B64F]/10 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#552F0B] text-[#F4B64F]">
                <Smartphone className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-[#0A0A0A]">
                  Install FieldTrack
                </p>
                <p className="mt-1 text-xs leading-5 text-[#552F0B]/70">
                  Follow these two steps in Safari to add the application to
                  your device.
                </p>
              </div>
            </div>

            {/* Installation steps */}
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#BE732F]/25 bg-[#552F0B] text-sm font-bold text-[#F4B64F]">
                  1
                </span>

                <div className="min-w-0 pt-1">
                  <p className="text-sm font-semibold text-[#0A0A0A]">
                    Open the Share menu
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#552F0B]/70">
                    Tap the{" "}
                    <strong className="inline-flex items-center gap-1 text-[#552F0B]">
                      <Share className="h-3.5 w-3.5" />
                      Share
                    </strong>{" "}
                    button in Safari&apos;s toolbar.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#BE732F]/25 bg-[#552F0B] text-sm font-bold text-[#F4B64F]">
                  2
                </span>

                <div className="min-w-0 pt-1">
                  <p className="text-sm font-semibold text-[#0A0A0A]">
                    Add to Home Screen
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#552F0B]/70">
                    Scroll through the available actions and select{" "}
                    <strong className="text-[#552F0B]">
                      Add to Home Screen
                    </strong>
                    .
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#BE732F]/25 bg-[#552F0B] text-sm font-bold text-[#F4B64F]">
                  3
                </span>

                <div className="min-w-0 pt-1">
                  <p className="text-sm font-semibold text-[#0A0A0A]">
                    Confirm installation
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#552F0B]/70">
                    Tap Add. FieldTrack will appear on your Home Screen.
                  </p>
                </div>
              </li>
            </ol>

            {/* Offline note */}
            <div className="flex items-start gap-2.5 rounded-xl border border-[#BE732F]/15 bg-[#BE732F]/[0.06] p-3.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#BE732F]" />
              <p className="text-xs leading-5 text-[#552F0B]/80">
                Once installed and its resources are cached, FieldTrack can
                provide its offline application experience and store field data
                locally.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-[#BE732F]/15 pt-4">
              <Button onClick={() => setShowGuide(false)}>Got it</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  return null;
}
