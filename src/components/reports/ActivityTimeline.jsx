import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileEdit,
  Send,
  UserCheck,
  Wrench,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters.js';

const TYPE_STYLE = {
  report_created: { icon: Send, bg: 'bg-[#123D35]', text: 'text-white' },
  draft_saved: { icon: FileEdit, bg: 'bg-[#EAEFEA]', text: 'text-[#71817B]' },
  sync_queued: { icon: Clock, bg: 'bg-[#E6A23C]/20', text: 'text-[#9A6510]' },
  sync_success: { icon: CheckCircle2, bg: 'bg-[#16A477]/20', text: 'text-[#0E7A57]' },
  sync_failed: { icon: AlertCircle, bg: 'bg-[#DC5555]/18', text: 'text-[#B23B3B]' },
  assigned: { icon: UserCheck, bg: 'bg-[#1B5B4C]/18', text: 'text-[#123D35]' },
  status_changed: { icon: Wrench, bg: 'bg-[#123D35]/12', text: 'text-[#123D35]' },
  report_updated: { icon: FileEdit, bg: 'bg-[#123D35]/12', text: 'text-[#123D35]' },
};

export function ActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <p className="text-sm text-[#71817B] py-4">
        No activity events recorded for this report yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-5 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-[#123D35]/12">
      {activities.map((entry) => {
        const cfg = TYPE_STYLE[entry.type] || TYPE_STYLE.status_changed;
        const Icon = cfg.icon;
        return (
          <li key={entry.id} className="relative pl-11">
            <span
              className={`absolute left-0 top-0.5 w-8 h-8 rounded-xl flex items-center justify-center border border-white shadow-sm ${cfg.bg} ${cfg.text}`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-xs font-semibold text-[#172B27]">{entry.actor}</span>
              <time className="text-[11px] text-[#71817B] font-mono tabular-nums">
                {formatDateTime(entry.timestamp)}
              </time>
            </div>
            <p className="mt-1 text-sm text-[#172B27] leading-relaxed">{entry.message}</p>
          </li>
        );
      })}
    </ol>
  );
}
