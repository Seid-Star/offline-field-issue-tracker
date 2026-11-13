import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileEdit,
  Send,
  UserCheck,
  Wrench,
} from "lucide-react";
import { formatDateTime } from "../../utils/formatters.js";

const TYPE_STYLE = {
  report_created: {
    icon: Send,
    bg: "bg-[#552F0B]",
    text: "text-[#F4B64F]",
    label: "Report created",
  },
  draft_saved: {
    icon: FileEdit,
    bg: "bg-[#BE732F]/15",
    text: "text-[#552F0B]",
    label: "Draft saved",
  },
  sync_queued: {
    icon: Clock,
    bg: "bg-[#F4B64F]/25",
    text: "text-[#552F0B]",
    label: "Sync queued",
  },
  sync_success: {
    icon: CheckCircle2,
    bg: "bg-[#BE732F]/20",
    text: "text-[#552F0B]",
    label: "Sync completed",
  },
  sync_failed: {
    icon: AlertCircle,
    bg: "bg-[#552F0B]/10",
    text: "text-[#552F0B]",
    label: "Sync failed",
  },
  assigned: {
    icon: UserCheck,
    bg: "bg-[#F4B64F]/25",
    text: "text-[#552F0B]",
    label: "Assigned",
  },
  status_changed: {
    icon: Wrench,
    bg: "bg-[#BE732F]/15",
    text: "text-[#552F0B]",
    label: "Status updated",
  },
  report_updated: {
    icon: FileEdit,
    bg: "bg-[#0A0A0A]/[0.07]",
    text: "text-[#0A0A0A]",
    label: "Report updated",
  },
};

export function ActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#BE732F]/25 bg-[#BE732F]/[0.04] px-5 py-9 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#BE732F]/10 text-[#552F0B]">
          <Clock className="h-5 w-5" />
        </div>

        <p className="text-sm font-semibold text-[#0A0A0A]">
          No activity recorded
        </p>

        <p className="mt-1 max-w-xs text-xs leading-5 text-[#552F0B]/65">
          Updates, assignments, and synchronization events will appear here.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-6 before:absolute before:bottom-3 before:left-[17px] before:top-3 before:w-px before:bg-gradient-to-b before:from-[#F4B64F] before:via-[#BE732F]/35 before:to-[#BE732F]/10">
      {activities.map((entry, index) => {
        const cfg = TYPE_STYLE[entry.type] || TYPE_STYLE.status_changed;
        const Icon = cfg.icon;

        return (
          <li key={entry.id} className="group relative flex gap-3.5">
            {/* Timeline marker */}
            <div className="relative z-10 shrink-0">
              <span
                className={`flex h-[35px] w-[35px] items-center justify-center rounded-xl border border-[#BE732F]/20 shadow-[0_3px_10px_rgba(85,47,11,0.07)] transition-transform duration-200 group-hover:scale-105 ${cfg.bg} ${cfg.text}`}
              >
                <Icon
                  className="h-4 w-4"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>
            </div>

            {/* Activity content */}
            <div
              className={`min-w-0 flex-1 pb-1 ${
                index !== activities.length - 1
                  ? "border-b border-[#BE732F]/10"
                  : ""
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-semibold text-[#0A0A0A]">
                    {entry.actor || "System"}
                  </span>

                  <span className="rounded-md border border-[#BE732F]/15 bg-[#BE732F]/[0.07] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#552F0B]">
                    {cfg.label}
                  </span>
                </div>

                <time
                  dateTime={
                    entry.timestamp
                      ? new Date(entry.timestamp).toISOString()
                      : undefined
                  }
                  className="shrink-0 font-mono text-[10px] tabular-nums text-[#552F0B]/55"
                >
                  {formatDateTime(entry.timestamp)}
                </time>
              </div>

              <p className="mt-2 pb-3 text-sm leading-6 text-[#552F0B]/80">
                {entry.message}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
