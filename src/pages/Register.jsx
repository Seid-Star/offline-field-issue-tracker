import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  HardHat,
  Lock,
  Mail,
  MapPin,
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
  if (!password)
    return { score: 0, label: "Enter a password", barClass: "bg-[#123D35]/15" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", barClass: "bg-[#DC5555]" };
  if (score === 2) return { score: 2, label: "Fair", barClass: "bg-[#E6A23C]" };
  if (score === 3)
    return { score: 3, label: "Strong", barClass: "bg-[#1B5B4C]" };
  return { score: 4, label: "Very Strong", barClass: "bg-[#16A477]" };
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
    <AuthLayout theme="clay">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <ClayCard className="p-6 sm:p-9">
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="clay-icon-well w-10 h-10 rounded-2xl text-[#123D35] flex items-center justify-center shrink-0">
                <MapPin
                  className="w-4 h-4"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              </span>
              <span className="text-sm font-bold font-display text-[#123D35]">
                Offline Field Issue Tracker
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#172B27] tracking-tight">
              Create Field Account
            </h1>
            <p className="mt-1.5 text-sm text-[#71817B]">
              Register your secure field worker account.
            </p>
            <p className="mt-1.5 text-xs font-medium text-[#1B5B4C]">
              Secure registration connected to the backend.
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-5 py-2">
              <div className="clay-inset rounded-2xl p-5 border border-[#16A477]/25 space-y-2">
                <div className="flex items-center gap-2.5 text-[#0E7A57]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h2 className="text-base font-semibold font-display">
                    Registration Successful
                  </h2>
                </div>
                <p className="text-sm text-[#172B27] leading-relaxed">
                  Welcome, <strong>{form.fullName}</strong>. Your field worker
                  account has been created.
                </p>
              </div>

              <PrimaryButton
                variant="clay"
                size="lg"
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                <span>Enter Field Workspace</span>
                <ArrowRight className="w-4 h-4" />
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
                placeholder="Your full name"
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
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  error={errors.password}
                />

                <div className="px-1 space-y-1">
                  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full transition-colors duration-200 ${
                          strength.score >= step
                            ? strength.barClass
                            : "bg-[#123D35]/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-[#71817B]">
                    Password strength:{" "}
                    <span className="font-semibold text-[#172B27]">
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
                placeholder="Re-enter password"
                autoComplete="new-password"
                error={errors.confirmPassword}
              />

              <div className="clay-inset rounded-xl p-3 flex items-center gap-3">
                <HardHat className="w-5 h-5 text-[#123D35]" />
                <div>
                  <p className="text-sm font-semibold text-[#172B27]">
                    Field Worker Account
                  </p>
                  <p className="text-xs text-[#71817B]">
                    Coordinator accounts are provisioned by an administrator.
                  </p>
                </div>
              </div>

              <div>
                <label className="flex items-start gap-2.5 text-xs text-[#172B27] cursor-pointer select-none py-1">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) =>
                      updateField("acceptTerms", e.target.checked)
                    }
                    className="w-4 h-4 mt-0.5 rounded accent-[#123D35] cursor-pointer shrink-0"
                  />
                  <span className="leading-relaxed text-[#71817B]">
                    I agree to the{" "}
                    <span className="font-semibold text-[#123D35]">
                      Terms and Conditions
                    </span>{" "}
                    and understand that reports are stored locally when offline.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-xs text-[#B23B3B]" role="alert">
                    {errors.acceptTerms}
                  </p>
                )}
              </div>

              <PrimaryButton
                type="submit"
                variant="clay"
                size="lg"
                disabled={isSubmitting}
                className="w-full mt-2"
              >
                <span>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </PrimaryButton>
            </form>
          )}

          <p className="mt-6 pt-5 border-t border-[#123D35]/10 text-center text-xs text-[#71817B]">
            Already have a workspace profile?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#123D35] hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </ClayCard>
      </motion.div>
    </AuthLayout>
  );
}
