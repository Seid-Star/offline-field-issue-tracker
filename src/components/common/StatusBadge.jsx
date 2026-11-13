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
} from 'lucide-react';

const WORKFLOW_CONFIG = {
  Draft: {
    icon: FileEdit,
    className: 'text-[#71817B] bg-[#F0F3F1] border-[#123D35]/10',
    label: 'Draft',
  },
  Submitted: {
    icon: Send,
    className: 'text-[#123D35] bg-[#123D35]/8 border-[#123D35]/18',
    label: 'Submitted',
  },
  Assigned: {
    icon: UserCheck,
    className: 'text-[#1B5B4C] bg-[#16A477]/12 border-[#16A477]/25',
    label: 'Assigned',
  },
  'In Progress': {
    icon: Wrench,
    className: 'text-[#9A6510] bg-[#E6A23C]/14 border-[#E6A23C]/30',
    label: 'In Progress',
  },
  Resolved: {
    icon: CheckCircle2,
    className: 'text-[#0E7A57] bg-[#16A477]/14 border-[#16A477]/30',
    label: 'Resolved',
  },
  Rejected: {
    icon: XCircle,
    className: 'text-[#B23B3B] bg-[#DC5555]/12 border-[#DC5555]/25',
    label: 'Rejected',
  },
};

const SYNC_CONFIG = {
  Pending: {
    icon: Clock,
    className: 'text-[#9A6510] bg-[#E6A23C]/14 border-[#E6A23C]/30',
    label: 'Pending Sync',
  },
  Syncing: {
    icon: Loader2,
    spin: true,
    className: 'text-[#123D35] bg-[#123D35]/10 border-[#123D35]/20',
    label: 'Syncing',
  },
  Synchronized: {
    icon: CheckCircle2,
    className: 'text-[#0E7A57] bg-[#16A477]/14 border-[#16A477]/30',
    label: 'Synchronized',
  },
  Failed: {
    icon: CloudOff,
    className: 'text-[#B23B3B] bg-[#DC5555]/12 border-[#DC5555]/30',
    label: 'Sync Failed',
  },
};

const PRIORITY_CONFIG = {
  Low: {
    icon: ArrowUpRight,
    className: 'text-[#71817B]',
  },
  Medium: {
    icon: AlertTriangle,
    className: 'text-[#1B5B4C]',
  },
  High: {
    icon: ShieldAlert,
    className: 'text-[#9A6510]',
  },
  Critical: {
    icon: AlertOctagon,
    className: 'text-[#B23B3B]',
  },
};

export function WorkflowStatusBadge({ status, size = 'md' }) {
  const cfg = WORKFLOW_CONFIG[status] || WORKFLOW_CONFIG.Submitted;
  const Icon = cfg.icon;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap shrink-0 ${sizeClass} ${cfg.className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{cfg.label}</span>
    </span>
  );
}

export function SyncStatusBadge({ syncStatus, isDraft = false, size = 'md' }) {
  if (isDraft) {
    const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap shrink-0 text-[#71817B] bg-[#F5F7F5] border-[#123D35]/10 ${sizeClass}`}
      >
        <FileEdit className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Local Only</span>
      </span>
    );
  }

  const cfg = SYNC_CONFIG[syncStatus] || SYNC_CONFIG.Pending;
  const Icon = cfg.icon || RefreshCw;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap shrink-0 ${sizeClass} ${cfg.className}`}
    >
      <Icon
        className={`w-3.5 h-3.5 shrink-0 ${cfg.spin ? 'animate-spin' : ''}`}
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
    <span className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap ${cfg.className}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{priority}</span>
    </span>
  );
}
