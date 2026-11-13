import { Inbox } from 'lucide-react';

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action = null,
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#123D35]/10 px-6 py-12 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-[#F5F7F5] border border-[#123D35]/10 flex items-center justify-center text-[#123D35] mb-4">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-[#172B27] font-display">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-[#71817B] max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
