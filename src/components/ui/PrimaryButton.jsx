export function PrimaryButton({
  children,
  variant = 'emerald',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap shrink-0 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A477] focus-visible:ring-offset-2 disabled:opacity-55 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer';

  const variants = {
    emerald:
      'bg-[#16A477] text-[#092B27] hover:bg-[#19B583] shadow-[0_10px_24px_-10px_rgba(22,164,119,0.65)]',
    forest:
      'bg-[#123D35] text-white hover:bg-[#1B5B4C] shadow-[0_10px_24px_-10px_rgba(18,61,53,0.45)]',
    glass:
      'bg-white/12 text-white border border-white/25 hover:bg-white/20 backdrop-blur-md',
    clay:
      'bg-gradient-to-br from-[#16A477] to-[#128963] text-white shadow-[6px_6px_16px_rgba(18,61,53,0.22),-4px_-4px_12px_rgba(255,255,255,0.85),inset_1px_1px_2px_rgba(255,255,255,0.35)] hover:brightness-105',
  };

  const sizes = {
    sm: 'min-h-[40px] px-4 py-2 text-xs',
    md: 'min-h-[46px] px-5 py-2.5 text-sm',
    lg: 'min-h-[50px] px-6 py-3 text-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.emerald} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
