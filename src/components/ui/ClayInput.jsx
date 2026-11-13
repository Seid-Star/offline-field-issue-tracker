import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function ClayInput({
  id,
  label,
  type = 'text',
  icon: Icon = null,
  error = '',
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-[#172B27] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="w-4 h-4 text-[#71817B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          className={`clay-inset w-full h-12 rounded-2xl border text-sm text-[#172B27] placeholder:text-[#71817B]/80 transition-all duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#16A477] ${
            Icon ? 'pl-10' : 'pl-4'
          } ${isPassword ? 'pr-12' : 'pr-4'} ${
            error ? 'border-[#DC5555]' : 'border-[#123D35]/10 focus:border-[#16A477]'
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-[#71817B] hover:text-[#172B27] hover:bg-white/70 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[#B23B3B]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
