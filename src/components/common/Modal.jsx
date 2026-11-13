import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle = "",
  children,
  maxWidth = "max-w-lg",
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0A0A0A]/65 p-0 backdrop-blur-[5px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`animate-modal w-full ${maxWidth} overflow-hidden rounded-t-[28px] border border-[#BE732F]/25 bg-[#EFEEEC] shadow-[0_25px_90px_rgba(10,10,10,0.35)] sm:rounded-[24px]`}
      >
        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 border-b border-[#BE732F]/20 bg-[#EFEEEC] px-5 py-5 sm:px-6">
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-[#552F0B] via-[#F4B64F] to-[#BE732F]"
          />

          <div className="min-w-0 pt-1">
            <h2
              id="modal-title"
              className="font-display text-base font-bold tracking-tight text-[#0A0A0A] sm:text-lg"
            >
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1.5 text-xs leading-5 text-[#552F0B]/65 sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#BE732F]/20 bg-[#BE732F]/[0.07] text-[#552F0B] transition-all duration-200 hover:border-[#BE732F]/45 hover:bg-[#F4B64F]/20 hover:text-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F]"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[82vh] overflow-y-auto overscroll-contain p-5 sm:max-h-[78vh] sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
