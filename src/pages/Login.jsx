import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  WifiOff,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout.jsx";
import { PrimaryButton } from "../components/ui/PrimaryButton.jsx";
import { useApp } from "../context/AppContext.jsx";
import * as api from "../services/api.js";

export function Login() {
  const navigate = useNavigate();
  const { addToast, stats, setAuthenticatedUser } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotNotice, setForgotNotice] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const validate = () => {
    const next = {};

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Please enter a valid work email address.";
    }

    if (!password || password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = await api.login({
        email: email.trim(),
        password,
      });

      await setAuthenticatedUser(result.user);

      addToast({
        title: "Sign-in successful",
        description: `Welcome, ${result.user.name}.`,
        variant: "success",
      });

      navigate("/dashboard");
    } catch (error) {
      addToast({
        title: "Sign-in failed",
        description: error.message || "Please check your credentials.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const visualAside = (
    <div className="relative flex h-full min-h-[390px] flex-col justify-between overflow-hidden bg-[#0A0A0A] px-7 py-8 text-[#EFEEEC] sm:px-10 sm:py-10 lg:min-h-[calc(100svh-40px)] lg:px-12 lg:py-12">
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_48%_42%,rgba(190,115,47,0.19),transparent_48%)]" />

      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#BE732F]/10 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#F4B64F]/10 blur-[110px]" />

      {/* Abstract metallic centerpiece */}
      <div className="pointer-events-none absolute left-1/2 top-[43%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 sm:h-[470px] sm:w-[470px] lg:h-[540px] lg:w-[540px]">
        <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#F4B64F_0%,#BE732F_22%,#552F0B_50%,#0A0A0A_78%)] shadow-[0_0_100px_rgba(190,115,47,0.24)]" />

        <div className="absolute inset-[8%] rotate-[-32deg] scale-x-[0.62] rounded-full border-[2px] border-[#F4B64F]/60 shadow-[0_0_25px_rgba(244,182,79,0.12)]" />

        <div className="absolute inset-[15%] rotate-[35deg] scale-x-[0.7] rounded-full border border-[#BE732F]/80" />

        <div className="absolute inset-[24%] rotate-[-15deg] scale-y-[0.65] rounded-full border border-[#F4B64F]/35" />

        <div className="absolute left-[19%] top-[20%] h-[62%] w-[62%] rotate-[-35deg] rounded-[42%] border border-[#F4B64F]/25 bg-gradient-to-br from-[#F4B64F]/15 via-[#BE732F]/10 to-transparent shadow-[inset_12px_12px_45px_rgba(244,182,79,0.12)] backdrop-blur-[2px]" />

        <div className="absolute left-[37%] top-[37%] h-[26%] w-[26%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#F4B64F,#BE732F_45%,#552F0B_80%)] shadow-[0_0_55px_rgba(244,182,79,0.25)]" />

        <div className="absolute left-[10%] top-[45%] h-2 w-2 rounded-full bg-[#F4B64F] shadow-[0_0_20px_#F4B64F]" />

        <div className="absolute right-[13%] top-[28%] h-1.5 w-1.5 rounded-full bg-[#BE732F] shadow-[0_0_18px_#BE732F]" />
      </div>

      {/* Desktop brand */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between"
      >
        <Link to="/" className="inline-flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Offline Field Issue Tracker"
            className="h-11 w-11 shrink-0 object-contain"
          />

          <div>
            <p className="text-sm font-bold tracking-tight text-[#EFEEEC]">
              Offline Field Issue Tracker
            </p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#EFEEEC]/40">
              NilePixel Technologies
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-[#F4B64F]/20 bg-[#F4B64F]/10 px-3 py-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F4B64F]" />

          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#F4B64F]">
            Offline first
          </span>
        </div>
      </motion.div>

      {/* Desktop bottom content */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1 }}
        className="relative z-10 mt-auto max-w-lg pt-32 sm:pt-40 lg:pt-48"
      >
        <div className="mb-5 inline-flex items-center gap-2">
          <span className="h-px w-8 bg-[#F4B64F]" />

          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4B64F]">
            Field operations, reimagined
          </span>
        </div>

        <h2 className="max-w-md text-[36px] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[58px]">
          Keep work
          <br />
          moving.
          <span className="block text-[#F4B64F]">Even offline.</span>
        </h2>

        <p className="mt-5 max-w-sm text-sm leading-7 text-[#EFEEEC]/55">
          Capture issues, coordinate teams, and manage field operations without
          depending on a constant internet connection.
        </p>

        {/* Platform capabilities */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#EFEEEC]/10 pt-6">
          <div className="flex items-center gap-2">
            <WifiOff size={15} className="text-[#F4B64F]" />
            <span className="text-[11px] text-[#EFEEEC]/65">Offline ready</span>
          </div>

          <div className="flex items-center gap-2">
            <RefreshCw size={15} className="text-[#F4B64F]" />
            <span className="text-[11px] text-[#EFEEEC]/65">
              Smart synchronization
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-[#F4B64F]" />
            <span className="text-[11px] text-[#EFEEEC]/65">
              Secure workspace
            </span>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between text-[10px] text-[#EFEEEC]/35">
          <span>© {new Date().getFullYear()} NilePixel Technologies</span>
          <span>{stats?.pendingSync ?? 0} pending sync</span>
        </div>
      </motion.div>
    </div>
  );

  return (
    <AuthLayout aside={visualAside}>
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-[390px]"
      >
        {/* Mobile brand */}
        <Link to="/" className="mb-10 inline-flex items-center gap-3 lg:hidden">
          <img
            src="/logo.png"
            alt="Offline Field Issue Tracker"
            className="h-11 w-11 shrink-0 object-contain"
          />

          <div>
            <p className="text-sm font-bold tracking-tight text-[#0A0A0A]">
              Offline Field Issue Tracker
            </p>

            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#552F0B]/45">
              NilePixel Technologies
            </p>
          </div>
        </Link>

        {/* Heading */}
        <div className="mb-9">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#BE732F]">
            YOUR WORKSPACE AWAITS
          </p>

          <h1 className="text-[42px] font-semibold leading-[1.08] tracking-[-0.055em] text-[#0A0A0A] sm:text-[48px]">
            Welcome
            <br />
            <span className="text-[#BE732F]">back.</span>
          </h1>

          <p className="mt-4 max-w-[330px] text-[13px] leading-6 text-[#552F0B]/65">
            Sign in to continue managing your field operations and keeping your
            team connected.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-2.5 block text-[12px] font-semibold text-[#0A0A0A]"
            >
              Email address
            </label>

            <div
              className={`group flex h-[57px] items-center gap-3 rounded-xl border bg-white px-4 transition-all duration-200 ${
                errors.email
                  ? "border-[#BE732F] ring-2 ring-[#BE732F]/10"
                  : "border-[#552F0B]/10 hover:border-[#552F0B]/25 focus-within:border-[#BE732F] focus-within:ring-4 focus-within:ring-[#F4B64F]/15"
              }`}
            >
              <Mail
                size={18}
                className="shrink-0 text-[#BE732F]/80 transition-colors group-focus-within:text-[#BE732F]"
              />

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (errors.email) {
                    setErrors((p) => ({ ...p, email: "" }));
                  }
                }}
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "login-email-error" : undefined
                }
                className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-[#0A0A0A] outline-none placeholder:text-[#552F0B]/35"
              />
            </div>

            {errors.email && (
              <p
                id="login-email-error"
                className="mt-2 text-xs text-[#BE732F]"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="text-[12px] font-semibold text-[#0A0A0A]"
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setForgotNotice((v) => !v)}
                className="text-[11px] font-semibold text-[#BE732F] transition-colors hover:text-[#552F0B]"
              >
                Forgot password?
              </button>
            </div>

            <div
              className={`group flex h-[57px] items-center gap-3 rounded-xl border bg-white px-4 transition-all duration-200 ${
                errors.password
                  ? "border-[#BE732F] ring-2 ring-[#BE732F]/10"
                  : "border-[#552F0B]/10 hover:border-[#552F0B]/25 focus-within:border-[#BE732F] focus-within:ring-4 focus-within:ring-[#F4B64F]/15"
              }`}
            >
              <Lock
                size={18}
                className="shrink-0 text-[#BE732F]/80 transition-colors group-focus-within:text-[#BE732F]"
              />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  if (errors.password) {
                    setErrors((p) => ({ ...p, password: "" }));
                  }
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
                className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-[#0A0A0A] outline-none placeholder:text-[#552F0B]/35"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#552F0B]/45 transition-all hover:bg-[#F4B64F]/15 hover:text-[#552F0B]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {errors.password && (
              <p
                id="login-password-error"
                className="mt-2 text-xs text-[#BE732F]"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember and security */}
          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-[11px] text-[#552F0B]/70">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded accent-[#BE732F]"
              />
              Remember me
            </label>

            <span className="flex items-center gap-1.5 text-[10px] text-[#552F0B]/50">
              <ShieldCheck size={14} className="text-[#BE732F]" />
              Secure sign in
            </span>
          </div>

          {/* Recovery notice */}
          {forgotNotice && (
            <div className="rounded-xl border border-[#BE732F]/20 bg-[#F4B64F]/10 p-3.5">
              <p className="text-xs leading-5 text-[#552F0B]">
                Password recovery is not yet configured. Please contact your
                system administrator.
              </p>
            </div>
          )}

          {/* Submit */}
          <PrimaryButton
            type="submit"
            variant="dark"
            size="lg"
            disabled={isSubmitting}
            className="group mt-2 !min-h-[56px] w-full rounded-xl text-[13px] shadow-[0_10px_25px_-12px_rgba(10,10,10,0.5)] transition-all hover:shadow-[0_14px_30px_-12px_rgba(10,10,10,0.55)]"
          >
            {isSubmitting ? "Signing you in..." : "Sign in to workspace"}

            {!isSubmitting && (
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            )}
          </PrimaryButton>
        </form>

        {/* Registration */}
        <div className="mt-9 text-center">
          <p className="text-[12px] text-[#552F0B]/65">
            New to the platform?{" "}
            <Link
              to="/register"
              className="font-bold text-[#BE732F] transition-colors hover:text-[#552F0B]"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <span className="h-px flex-1 bg-[#552F0B]/10" />

          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#552F0B]/35">
            Built for the field
          </span>

          <span className="h-px flex-1 bg-[#552F0B]/10" />
        </div>
      </motion.div>
    </AuthLayout>
  );
}
