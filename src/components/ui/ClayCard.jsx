export function ClayCard({ children, className = "", hover = false }) {
  return (
    <div
      className={`rounded-[26px] border border-[#BE732F]/15 bg-[#EFEEEC] text-[#0A0A0A] shadow-[0_12px_40px_rgba(85,47,11,0.07)] ${
        hover
          ? "transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(85,47,11,0.12)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
