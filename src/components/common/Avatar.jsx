import { useState } from 'react';

export function Avatar({ src, name, size = 'md', className = '' }) {
  const [hasError, setHasError] = useState(false);

  const initials = (name || 'U')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  if (!src || hasError) {
    return (
      <div
        className={`${sizes[size] || sizes.md} rounded-full bg-[#1B5B4C] text-white font-semibold flex items-center justify-center shrink-0 border border-white/20 ${className}`}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${sizes[size] || sizes.md} rounded-full object-cover shrink-0 border border-[#123D35]/15 ${className}`}
    />
  );
}
