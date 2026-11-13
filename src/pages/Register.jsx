import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  HardHat,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout.jsx";
import { ClayCard } from "../components/ui/ClayCard.jsx";
import { ClayInput } from "../components/ui/ClayInput.jsx";
import { PrimaryButton } from "../components/ui/PrimaryButton.jsx";
import { useApp } from "../context/AppContext.jsx";
import * as api from "../services/api.js";

function evaluatePasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: "Enter a password",
      barClass: "bg-[#BE732F]",
    };
  }

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return { score: 1, label: "Weak", barClass: "bg-[#552F0B]" };
  }

  if (score === 2) {
    return { score: 2, label: "Fair", barClass: "bg-[#BE732F]" };
  }

  if (score === 3) {
    return { score: 3, label: "Strong", barClass: "bg-[#F4B64F]" };
  }

  return { score: 4, label: "Very Strong", barClass: "bg-[#F4B64F]" };
}

export function Register() {
  const navigate = useNavigate();
  const { setAuthenticatedUser, addToast } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const strength = useMemo(
    () => evaluatePasswordStrength(form.password),
    [form.password],
  );

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const next = {};

    if (form.fullName.trim().length < 2) {
      next.fullName = "Please enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Please enter a valid email address.";
    }

    if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters long.";
    }

    if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords do not match.";
    }

    if (!form.acceptTerms) {
      next.acceptTerms = "Please accept the Terms and Conditions.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = await api.register({
        name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        unit: "Field Operations Unit",
      });

      await setAuthenticatedUser(result.user);
      setIsSuccess(true);

      addToast({
        title: "Account created successfully",
        description: `Welcome, ${result.user.name}. Your field worker account is ready.`,
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Registration failed",
        description: error.message || "Unable to create your account.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-[460px]"
      >
        <ClayCard className="p-6 sm:p-8">
          <div className="mb-7">
            {/* Brand */}
            <Link to="/" className="mb-7 inline-flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Offline Field Issue Tracker"
                className="h-11 w-11 shrink-0 object-contain"
              />

              <div>
                <p className="text-sm font-bold tracking-tight text-[#0A0A0A]">
                  Offline Field Issue Tracker
                </p>

                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#BE732F]">
                  NilePixel Technologies
                </p>
              </div>
            </Link>

            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#BE732F]">
              Get started
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-[34px]">
              Create your account
              <span className="text-[#BE732F]">.</span>
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-[#552F0B]/70">
              Set up your field worker profile to start managing field reports.
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#BE732F]/20 bg-white p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4B64F]/25">
                    <CheckCircle2 className="h-5 w-5 text-[#BE732F]" />
                  </div>

                  <h2 className="text-base font-bold text-[#0A0A0A]">
                    Registration successful
                  </h2>
                </div>

                <p className="text-sm leading-relaxed text-[#552F0B]/75">
                  Welcome,{" "}
                  <strong className="text-[#0A0A0A]">{form.fullName}</strong>.
                  Your field worker account has been created successfully.
                </p>
              </div>

              <PrimaryButton
                variant="dark"
                size="lg"
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                <span>Enter Field Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <ClayInput
                id="reg-name"
                label="Full Name"
                type="text"
                icon={User}
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                error={errors.fullName}
              />

              <ClayInput
                id="reg-email"
                label="Email Address"
                type="email"
                icon={Mail}
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="name@organization.org"
                autoComplete="email"
                error={errors.email}
              />

              <div className="space-y-2">
                <ClayInput
                  id="reg-password"
                  label="Password"
                  type="password"
                  icon={Lock}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  error={errors.password}
                />

                <div className="space-y-1.5 px-1">
                  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full transition-colors duration-200 ${
                          strength.score >= step
                            ? strength.barClass
                            : "bg-[#BE732F]/15"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-[#552F0B]/65">
                    Password strength:{" "}
                    <span className="font-bold text-[#BE732F]">
                      {strength.label}
                    </span>
                  </p>
                </div>
              </div>

              <ClayInput
                id="reg-confirm-password"
                label="Confirm Password"
                type="password"
                icon={Lock}
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                error={errors.confirmPassword}
              />

              <div className="flex items-start gap-3 rounded-xl border border-[#BE732F]/20 bg-white p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F4B64F]/20">
                  <HardHat className="h-4 w-4 text-[#BE732F]" />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#0A0A0A]">
                    Field Worker Account
                  </p>

                  <p className="mt-0.5 text-xs leading-relaxed text-[#552F0B]/65">
                    Coordinator accounts are provisioned by an administrator.
                  </p>
                </div>
              </div>

              <div>
                <label className="flex cursor-pointer select-none items-start gap-2.5 py-1 text-xs">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) =>
                      updateField("acceptTerms", e.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#BE732F]"
                  />

                  <span className="leading-relaxed text-[#552F0B]/70">
                    I agree to the{" "}
                    <span className="font-bold text-[#BE732F]">
                      Terms and Conditions
                    </span>{" "}
                    and understand that reports are stored locally when offline.
                  </span>
                </label>

                {errors.acceptTerms && (
                  <p className="mt-1 text-xs text-[#BE732F]" role="alert">
                    {errors.acceptTerms}
                  </p>
                )}
              </div>

              <PrimaryButton
                type="submit"
                variant="dark"
                size="lg"
                disabled={isSubmitting}
                className="mt-2 w-full"
              >
                <span>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </span>

                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </PrimaryButton>
            </form>
          )}

          <div className="mt-6 border-t border-[#BE732F]/15 pt-5 text-center">
            <p className="text-xs text-[#552F0B]/65">
              Already have a workspace profile?{" "}
              <Link
                to="/login"
                className="font-bold text-[#BE732F] transition-colors hover:text-[#552F0B]"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </ClayCard>

        <p className="mt-5 text-center text-[10px] font-medium tracking-wide text-[#552F0B]/45">
          SECURE FIELD OPERATIONS · BUILT FOR RELIABLE WORK
        </p>
      </motion.div>
    </AuthLayout>
  );
}
