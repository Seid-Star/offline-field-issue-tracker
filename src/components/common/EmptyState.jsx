import { Inbox } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action = null,
}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[26px] border border-[#BE732F]/20 bg-[#EFEEEC] px-6 py-14 text-center shadow-[0_10px_35px_rgba(85,47,11,0.045)]">
      {/* Decorative background detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#F4B64F]/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border border-[#BE732F]/10"
      />

      {/* Icon */}
      <div className="relative mb-5 flex h-[62px] w-[62px] items-center justify-center rounded-[20px] border border-[#BE732F]/25 bg-[#F4B64F]/15 text-[#552F0B] shadow-[0_5px_16px_rgba(85,47,11,0.06)]">
        <Icon className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative max-w-md">
        <h3 className="font-display text-lg font-bold tracking-tight text-[#0A0A0A]">
          {title}
        </h3>

        {description && (
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#552F0B]/70">
            {description}
          </p>
        )}
      </div>

      {/* Optional action */}
      {action && <div className="relative mt-6">{action}</div>}
    </div>
  );
}
