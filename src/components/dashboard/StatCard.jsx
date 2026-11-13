export function StatCard({
  label,
  value,
  caption,
  accent = "default",
  delayClass = "",
}) {
  const accentStyles = {
    default: {
      value: "text-[#0A0A0A]",
      indicator: "bg-[#552F0B]",
      border: "border-[#BE732F]/15",
    },
    amber: {
      value: "text-[#BE732F]",
      indicator: "bg-[#F4B64F]",
      border: "border-[#F4B64F]/35",
    },
    bronze: {
      value: "text-[#552F0B]",
      indicator: "bg-[#BE732F]",
      border: "border-[#BE732F]/25",
    },
    emerald: {
      value: "text-[#BE732F]",
      indicator: "bg-[#BE732F]",
      border: "border-[#BE732F]/25",
    },
    critical: {
      value: "text-[#552F0B]",
      indicator: "bg-[#552F0B]",
      border: "border-[#552F0B]/25",
    },
  };

  const styles = accentStyles[accent] || accentStyles.default;

  return (
    <div
      className={`animate-enter ${delayClass} group relative overflow-hidden rounded-[22px] border ${styles.border} bg-[#EFEEEC] p-4 shadow-[0_5px_20px_rgba(85,47,11,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(85,47,11,0.09)] sm:p-5`}
    >
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-[#F4B64F]/10 transition-transform duration-300 group-hover:scale-150" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#552F0B]/65">
            {label}
          </p>

          <span
            className={`h-2 w-2 shrink-0 rounded-full ${styles.indicator}`}
            aria-hidden="true"
          />
        </div>

        <p
          className={`text-2xl font-bold tracking-tight tabular-nums sm:text-3xl ${styles.value}`}
        >
          {value}
        </p>

        {caption && (
          <p
            className="mt-2 truncate text-[11px] leading-5 text-[#552F0B]/55 sm:text-xs"
            title={caption}
          >
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
