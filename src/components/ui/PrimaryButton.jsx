export function PrimaryButton({
  children,
  variant = "gold",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
  onClick,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap shrink-0 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE732F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EFEEEC] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer";

  const variants = {
    gold: "bg-[#F4B64F] text-[#0A0A0A] hover:bg-[#BE732F] hover:text-[#EFEEEC] shadow-[0_8px_24px_-10px_rgba(190,115,47,0.65)]",
    dark: "bg-[#0A0A0A] text-[#EFEEEC] hover:bg-[#552F0B] shadow-[0_8px_24px_-10px_rgba(10,10,10,0.35)]",
    bronze:
      "bg-[#BE732F] text-[#EFEEEC] hover:bg-[#552F0B] shadow-[0_8px_24px_-10px_rgba(85,47,11,0.3)]",
    outline:
      "border border-[#552F0B]/20 bg-transparent text-[#552F0B] hover:bg-[#F4B64F]/15 hover:border-[#BE732F]/50",
    glass:
      "bg-[#EFEEEC]/10 text-[#EFEEEC] border border-[#EFEEEC]/20 hover:bg-[#EFEEEC]/15 backdrop-blur-md",

    // Backward-compatible variants
    emerald:
      "bg-[#F4B64F] text-[#0A0A0A] hover:bg-[#BE732F] hover:text-[#EFEEEC] shadow-[0_8px_24px_-10px_rgba(190,115,47,0.65)]",
    forest: "bg-[#0A0A0A] text-[#EFEEEC] hover:bg-[#552F0B]",
    clay: "bg-gradient-to-br from-[#F4B64F] to-[#BE732F] text-[#0A0A0A] hover:brightness-105 shadow-[0_8px_24px_-10px_rgba(190,115,47,0.45)]",
  };

  const sizes = {
    sm: "min-h-[40px] px-4 py-2 text-xs",
    md: "min-h-[46px] px-5 py-2.5 text-sm",
    lg: "min-h-[54px] px-6 py-3 text-sm",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.gold} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
