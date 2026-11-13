import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function ClayInput({
  id,
  label,
  type = "text",
  icon: Icon = null,
  error = "",
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-xs font-semibold text-[#552F0B]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#BE732F]"
            aria-hidden="true"
          />
        )}

        <input
          id={id}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          className={`h-12 w-full rounded-xl border bg-white text-sm text-[#0A0A0A] placeholder:text-[#552F0B]/45 transition-all duration-200 focus:border-[#BE732F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4B64F]/35 ${
            Icon ? "pl-10" : "pl-4"
          } ${isPassword ? "pr-12" : "pr-4"} ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
              : "border-[#BE732F]/20"
          }`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1.5 top-1/2 flex min-h-[38px] min-w-[38px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#BE732F] transition-colors hover:bg-[#EFEEEC] hover:text-[#552F0B]"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
