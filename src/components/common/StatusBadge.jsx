import {
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CloudOff,
  FileEdit,
  Loader2,
  RefreshCw,
  Send,
  ShieldAlert,
  UserCheck,
  Wrench,
  XCircle,
} from "lucide-react";

const WORKFLOW_CONFIG = {
  Draft: {
    icon: FileEdit,
    className: "text-[#552F0B]/65 bg-[#552F0B]/[0.06] border-[#552F0B]/15",
    label: "Draft",
  },
  Submitted: {
    icon: Send,
    className: "text-[#552F0B] bg-[#BE732F]/[0.09] border-[#BE732F]/20",
    label: "Submitted",
  },
  Assigned: {
    icon: UserCheck,
    className: "text-[#552F0B] bg-[#F4B64F]/20 border-[#F4B64F]/40",
    label: "Assigned",
  },
  "In Progress": {
    icon: Wrench,
    className: "text-[#BE732F] bg-[#BE732F]/[0.10] border-[#BE732F]/25",
    label: "In Progress",
  },
  Resolved: {
    icon: CheckCircle2,
    className: "text-[#552F0B] bg-[#F4B64F]/25 border-[#F4B64F]/45",
    label: "Resolved",
  },
  Rejected: {
    icon: XCircle,
    className: "text-[#0A0A0A] bg-[#552F0B]/[0.08] border-[#552F0B]/25",
    label: "Rejected",
  },
};

const SYNC_CONFIG = {
  Pending: {
    icon: Clock,
    className: "text-[#552F0B] bg-[#F4B64F]/20 border-[#F4B64F]/40",
    label: "Pending Sync",
  },
  Syncing: {
    icon: Loader2,
    spin: true,
    className: "text-[#552F0B] bg-[#BE732F]/[0.10] border-[#BE732F]/25",
    label: "Syncing",
  },
  Synchronized: {
    icon: CheckCircle2,
    className: "text-[#552F0B] bg-[#F4B64F]/25 border-[#F4B64F]/45",
    label: "Synchronized",
  },
  Failed: {
    icon: CloudOff,
    className: "text-[#0A0A0A] bg-[#552F0B]/[0.08] border-[#552F0B]/25",
    label: "Sync Failed",
  },
};

const PRIORITY_CONFIG = {
  Low: {
    icon: ArrowUpRight,
    className: "text-[#552F0B]/55",
  },
  Medium: {
    icon: AlertTriangle,
    className: "text-[#BE732F]",
  },
  High: {
    icon: ShieldAlert,
    className: "text-[#552F0B]",
  },
  Critical: {
    icon: AlertOctagon,
    className: "text-[#0A0A0A]",
  },
};

function getSizeClass(size) {
  return size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
}

export function WorkflowStatusBadge({ status, size = "md" }) {
  const cfg = WORKFLOW_CONFIG[status] || WORKFLOW_CONFIG.Submitted;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border font-semibold ${getSizeClass(size)} ${cfg.className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{cfg.label}</span>
    </span>
  );
}

export function SyncStatusBadge({ syncStatus, isDraft = false, size = "md" }) {
  if (isDraft) {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#552F0B]/15 bg-[#552F0B]/[0.06] font-semibold text-[#552F0B]/65 ${getSizeClass(size)}`}
      >
        <FileEdit className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Local Only</span>
      </span>
    );
  }

  const cfg = SYNC_CONFIG[syncStatus] || SYNC_CONFIG.Pending;
  const Icon = cfg.icon || RefreshCw;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border font-semibold ${getSizeClass(size)} ${cfg.className}`}
    >
      <Icon
        className={`h-3.5 w-3.5 shrink-0 ${cfg.spin ? "animate-spin" : ""}`}
        aria-hidden="true"
      />
      <span>{cfg.label}</span>
    </span>
  );
}

export function PriorityIndicator({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-bold ${cfg.className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{priority}</span>
    </span>
  );
}
