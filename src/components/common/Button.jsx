export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap shrink-0 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A477] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer';

  const variants = {
    primary:
      'bg-[#123D35] text-white hover:bg-[#1B5B4C] shadow-sm',
    emerald:
      'bg-[#16A477] text-[#092B27] font-semibold hover:bg-[#139169] shadow-sm',
    secondary:
      'bg-white text-[#172B27] border border-[#123D35]/15 hover:bg-[#F5F7F5]',
    ghost:
      'bg-transparent text-[#172B27] hover:bg-[#123D35]/8',
    danger:
      'bg-[#DC5555] text-white hover:bg-[#c84646] shadow-sm',
    'danger-outline':
      'bg-white text-[#DC5555] border border-[#DC5555]/30 hover:bg-[#DC5555]/8',
    glass:
      'bg-white/12 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md',
  };

  const sizes = {
    sm: 'min-h-[38px] px-3 py-1.5 text-xs',
    md: 'min-h-[44px] px-4 py-2 text-sm',
    lg: 'min-h-[48px] px-5 py-2.5 text-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
