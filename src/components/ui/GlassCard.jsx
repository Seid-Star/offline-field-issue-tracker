export function GlassCard({ children, className = '', hover = false }) {
  return (
    <div
      className={`glass-frosted rounded-2xl text-white ${
        hover
          ? 'transition-transform duration-200 hover:-translate-y-0.5'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
