export function StatCard({ label, value, caption, accent = 'default', delayClass = '' }) {
  const accentStyles = {
    default: 'text-[#172B27]',
    emerald: 'text-[#16A477]',
    amber: 'text-[#B57614]',
    critical: 'text-[#DC5555]',
  };

  return (
    <div
      className={`animate-enter ${delayClass} rounded-2xl bg-white border border-[#123D35]/10 p-4 sm:p-5 transition-transform duration-150 hover:-translate-y-0.5`}
    >
      <p className="text-xs font-medium text-[#71817B]">{label}</p>
      <p
        className={`mt-2 text-2xl sm:text-3xl font-bold font-display tabular-nums tracking-tight ${
          accentStyles[accent] || accentStyles.default
        }`}
      >
        {value}
      </p>
      {caption && (
        <p className="mt-1.5 text-xs text-[#71817B] truncate">{caption}</p>
      )}
    </div>
  );
}
