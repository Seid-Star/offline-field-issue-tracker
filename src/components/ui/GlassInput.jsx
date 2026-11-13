import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function GlassInput({
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
        <label htmlFor={id} className="block text-xs font-medium text-white/85 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="w-4 h-4 text-white/55 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          className={`w-full h-12 rounded-xl bg-white/[0.08] border text-sm text-white placeholder:text-white/45 transition-all duration-150 focus:outline-none focus:bg-white/[0.12] focus:ring-2 focus:ring-[#16A477] ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${isPassword ? 'pr-12' : 'pr-3.5'} ${
            error ? 'border-[#DC5555]' : 'border-white/20 focus:border-[#16A477]'
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg text-white/65 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[#FCA5A5]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
