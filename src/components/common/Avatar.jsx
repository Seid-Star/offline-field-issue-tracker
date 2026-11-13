import { useState } from "react";

export function Avatar({ src, name, size = "md", className = "" }) {
  const [hasError, setHasError] = useState(false);

  const initials = (name || "User")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizes = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-14 w-14 text-base",
  };

  const sizeClass = sizes[size] || sizes.md;

  const fallback = (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#BE732F]/35 bg-[#552F0B] font-bold tracking-wide text-[#F4B64F] shadow-[0_3px_10px_rgba(85,47,11,0.14)] ${sizeClass} ${className}`}
      role="img"
      aria-label={name || "User avatar"}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#BE732F]/30 via-transparent to-[#0A0A0A]/30" />
      <span className="relative">{initials || "U"}</span>
    </div>
  );

  if (!src || hasError) {
    return fallback;
  }

  return (
    <img
      src={src}
      alt={name || "User avatar"}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`shrink-0 rounded-full border border-[#BE732F]/30 bg-[#EFEEEC] object-cover shadow-[0_3px_10px_rgba(85,47,11,0.10)] ${sizeClass} ${className}`}
    />
  );
}
