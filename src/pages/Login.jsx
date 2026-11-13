import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Lock,
  Mail,
  MapPin,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout.jsx";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { GlassInput } from "../components/ui/GlassInput.jsx";
import { PrimaryButton } from "../components/ui/PrimaryButton.jsx";
import { useApp } from "../context/AppContext.jsx";
import * as api from "../services/api.js";

export function Login() {
  const navigate = useNavigate();
  const { addToast, stats, setAuthenticatedUser } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotNotice, setForgotNotice] = useState(false);

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
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/14">
          <div>
            <p className="text-xs font-medium text-[#16A477]">
              Field Sync Pipeline
            </p>
            <h2 className="mt-0.5 text-lg font-semibold font-display">
              Offline Capture &amp; Synchronization
            </h2>
          </div>
          <RefreshCw className="w-5 h-5 text-[#16A477]" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <div className="rounded-xl bg-white/[0.08] border border-white/14 p-3.5 flex items-start gap-3">
            <MapPin
              className="w-5 h-5 text-[#16A477] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium">1. Local Field Capture</p>
              <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
                Reports save immediately into IndexedDB, even without internet.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.08] border border-white/14 p-3.5 flex items-start gap-3">
            <Database
              className="w-5 h-5 text-[#E6A23C] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium">2. Resilient Sync Queue</p>
              <p className="text-xs text-white/70 mt-0.5">
                {stats.pendingSync} pending report
                {stats.pendingSync === 1 ? "" : "s"} queued.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.08] border border-white/14 p-3.5 flex items-start gap-3">
            <ShieldCheck
              className="w-5 h-5 text-[#5CE1B2] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium">3. Coordinator Dispatch</p>
              <p className="text-xs text-white/70 mt-0.5">
                Operations teams review issues, assign field units, and track
                resolution.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/12 flex items-center justify-between text-xs text-white/70">
          <span>Offline-ready workspace</span>
          <Link
            to="/dashboard"
            className="text-[#16A477] font-semibold hover:underline"
          >
            Preview Workspace
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );

  return (
    <AuthLayout theme="glass" aside={visualAside}>
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard className="p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-[#16A477] text-[#092B27] flex items-center justify-center shrink-0">
                <MapPin
                  className="w-4 h-4"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              </span>
              <span className="text-sm font-semibold font-display text-white">
                Offline Field Issue Tracker
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-sm text-white/75">
              Sign in to continue to your field workspace.
            </p>
            <p className="mt-2 text-xs text-[#5CE1B2]">
              Secure authentication powered by the backend.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <GlassInput
              id="login-email"
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: "" }));
              }}
              placeholder="name@organization.org"
              autoComplete="email"
              error={errors.email}
            />

            <GlassInput
              id="login-password"
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((p) => ({ ...p, password: "" }));
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password}
            />

            <div className="flex items-center justify-between gap-3 pt-1">
              <label className="inline-flex items-center gap-2 text-xs text-white/80 cursor-pointer select-none min-h-[36px]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#16A477] cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotNotice((v) => !v)}
                className="text-xs font-medium text-[#5CE1B2] hover:underline cursor-pointer min-h-[36px] px-1"
              >
                Forgot password?
              </button>
            </div>

            {forgotNotice && (
              <div className="rounded-xl bg-white/10 border border-white/15 px-3.5 py-2.5 text-xs text-white/85 flex items-start gap-2">
                <CheckCircle2
                  className="w-4 h-4 text-[#16A477] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  Password recovery is not yet configured. Contact your system
                  administrator.
                </span>
              </div>
            )}

            <PrimaryButton
              type="submit"
              variant="emerald"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </PrimaryButton>
          </form>

          <p className="mt-6 pt-5 border-t border-white/12 text-center text-xs text-white/75">
            New to the field platform?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#5CE1B2] hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </AuthLayout>
  );
}
