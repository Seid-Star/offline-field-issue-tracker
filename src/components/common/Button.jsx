export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const base =
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B64F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EFEEEC] active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45";

  const variants = {
    primary:
      "border border-[#0A0A0A] bg-[#0A0A0A] text-[#F4B64F] shadow-[0_4px_12px_rgba(10,10,10,0.12)] hover:border-[#552F0B] hover:bg-[#552F0B] hover:shadow-[0_7px_18px_rgba(85,47,11,0.18)]",

    emerald:
      "border border-[#0A0A0A] bg-[#0A0A0A] text-[#F4B64F] shadow-[0_4px_12px_rgba(10,10,10,0.12)] hover:bg-[#552F0B]",

    secondary:
      "border border-[#BE732F]/25 bg-[#EFEEEC] text-[#552F0B] hover:border-[#BE732F]/50 hover:bg-[#F4B64F]/15",

    ghost:
      "border border-transparent bg-transparent text-[#552F0B] hover:border-[#BE732F]/15 hover:bg-[#BE732F]/10",

    danger:
      "border border-[#552F0B] bg-[#552F0B] text-[#EFEEEC] shadow-sm hover:border-[#0A0A0A] hover:bg-[#0A0A0A]",

    "danger-outline":
      "border border-[#552F0B]/30 bg-[#EFEEEC] text-[#552F0B] hover:border-[#552F0B]/55 hover:bg-[#552F0B]/[0.07]",

    glass:
      "border border-[#EFEEEC]/20 bg-[#EFEEEC]/[0.08] text-[#EFEEEC] backdrop-blur-md hover:border-[#F4B64F]/35 hover:bg-[#F4B64F]/15 hover:text-[#F4B64F]",
  };

  const sizes = {
    sm: "min-h-[38px] rounded-lg px-3 py-1.5 text-xs",
    md: "min-h-[44px] px-4 py-2 text-sm",
    lg: "min-h-[48px] rounded-xl px-5 py-2.5 text-sm",
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
