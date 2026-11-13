import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const VARIANT_STYLES = {
  success: {
    icon: CheckCircle2,
    border: 'border-[#16A477]/35',
    iconColor: 'text-[#16A477]',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-[#E6A23C]/40',
    iconColor: 'text-[#E6A23C]',
  },
  error: {
    icon: XCircle,
    border: 'border-[#DC5555]/40',
    iconColor: 'text-[#DC5555]',
  },
  info: {
    icon: Info,
    border: 'border-[#123D35]/20',
    iconColor: 'text-[#123D35]',
  },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[60] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const cfg = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info;
        const Icon = cfg.icon;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto animate-enter glass-light rounded-xl border ${cfg.border} p-3.5 flex items-start gap-3`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.iconColor}`} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#172B27]">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-[#71817B] leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg text-[#71817B] hover:text-[#172B27] hover:bg-[#123D35]/6 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
