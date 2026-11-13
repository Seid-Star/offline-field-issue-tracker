export function ClayCard({ children, className = '', hover = false }) {
  return (
    <div
      className={`clay-surface rounded-[28px] text-[#172B27] ${
        hover
          ? 'transition-transform duration-200 hover:-translate-y-1'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
