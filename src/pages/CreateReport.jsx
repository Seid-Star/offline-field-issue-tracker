import { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Crosshair,
  FileEdit,
  MapPin,
  Send,
  ShieldCheck,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button.jsx";
import { AppShell } from "../components/layout/AppShell.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useNetwork } from "../context/NetworkContext.jsx";
import { CATEGORIES, PRIORITIES } from "../utils/constants.js";
import { toLocalDateTimeInputValue } from "../utils/formatters.js";

const inputClass =
  "h-12 w-full rounded-xl border border-[#BE732F]/20 bg-[#EFEEEC]/65 px-3.5 text-sm text-[#0A0A0A] placeholder:text-[#552F0B]/45 outline-none transition-all duration-200 focus:border-[#BE732F] focus:bg-white focus:ring-2 focus:ring-[#F4B64F]/30";

const labelClass = "mb-2 block text-xs font-bold tracking-wide text-[#552F0B]";

const sectionClass =
  "rounded-2xl border border-[#BE732F]/15 bg-white p-5 shadow-[0_8px_30px_rgba(85,47,11,0.035)] sm:p-6";

function FieldError({ children }) {
  if (!children) return null;

  return (
    <p
      className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[#552F0B]"
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#BE732F]" />
      {children}
    </p>
  );
}

function SectionHeading({ number, title, description, icon: Icon }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#BE732F]/20 bg-[#F4B64F]/15">
        <Icon className="h-5 w-5 text-[#BE732F]" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#BE732F]">
          Section {number}
        </p>
        <h3 className="mt-0.5 text-base font-bold text-[#0A0A0A]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[#552F0B]/60">
          {description}
        </p>
      </div>
    </div>
  );
}

export function CreateReport() {
  const navigate = useNavigate();
  const { createReport, addToast } = useApp();
  const { effectiveOnline } = useNetwork();

  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    description: "",
    locationName: "",
    latitude: "",
    longitude: "",
    priority: "Medium",
    reportedAt: toLocalDateTimeInputValue(),
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.category) {
      nextErrors.category = "Please select an infrastructure category.";
    }

    if (!form.locationName.trim() || form.locationName.trim().length < 3) {
      nextErrors.locationName =
        "Enter a specific site or location name (at least 3 characters).";
    }

    if (!form.description.trim() || form.description.trim().length < 12) {
      nextErrors.description =
        "Provide a clear field description (at least 12 characters) so crews can prepare.";
    }

    if (!form.priority) {
      nextErrors.priority = "Select an issue priority level.";
    }

    if (!form.reportedAt) {
      nextErrors.reportedAt = "Specify when the issue was observed.";
    }

    if (form.latitude !== "") {
      const lat = Number(form.latitude);

      if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
        nextErrors.latitude = "Latitude must be between -90 and 90.";
      }
    }

    if (form.longitude !== "") {
      const lng = Number(form.longitude);

      if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
        nextErrors.longitude = "Longitude must be between -180 and 180.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleUseDeviceGPS = () => {
    if (!navigator.geolocation) {
      addToast({
        title: "Geolocation unavailable",
        description:
          "This browser does not support GPS capture. You can enter coordinates manually.",
        variant: "warning",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateField("latitude", pos.coords.latitude.toFixed(6));
        updateField("longitude", pos.coords.longitude.toFixed(6));

        setIsLocating(false);

        addToast({
          title: "GPS coordinates captured",
          description: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          variant: "success",
        });
      },
      (error) => {
        setIsLocating(false);

        addToast({
          title: "Could not read GPS location",
          description:
            error.code === 1
              ? "Location permission was denied. You can enter coordinates manually."
              : "GPS signal unavailable or timed out. Coordinates remain optional.",
          variant: "warning",
        });
      },
      { enableHighAccuracy: true, timeout: 7000 },
    );
  };

  const handleSave = async (submitImmediately) => {
    if (isSaving) return;

    if (!validate()) {
      addToast({
        title: "Check required fields",
        description:
          "Please fix the highlighted validation messages before saving.",
        variant: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      const created = await createReport(form, {
        submitImmediately,
        autoSyncIfOnline: true,
      });

      navigate(`/reports/${created.clientId}`);
    } catch (err) {
      addToast({
        title: "Failed to save report locally",
        description: err.message,
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell
      title="Create Field Report"
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Reports", to: "/reports" },
        { label: "Create" },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Page Introduction */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A] p-5 text-[#EFEEEC] shadow-[0_12px_35px_rgba(85,47,11,0.12)] sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full border border-[#F4B64F]/15" />
          <div className="pointer-events-none absolute -right-5 -top-12 h-36 w-36 rounded-full border border-[#BE732F]/20" />

          <div className="relative">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4B64F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F4B64F]" />
              Field Operations
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Document an issue.
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-[#EFEEEC]/65">
              Capture infrastructure problems, record precise locations, and
              submit actionable information for your operations team.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#EFEEEC]/65">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#F4B64F]" />
                Local-first protection
              </span>
              <span className="h-1 w-1 rounded-full bg-[#BE732F]" />
              <span>Offline-ready reporting</span>
            </div>
          </div>
        </div>

        {/* Connectivity Status */}
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 ${
            effectiveOnline
              ? "border-[#BE732F]/25 bg-[#F4B64F]/10"
              : "border-[#BE732F]/35 bg-[#EFEEEC]"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
            {effectiveOnline ? (
              <Wifi className="h-4 w-4 text-[#BE732F]" />
            ) : (
              <WifiOff className="h-4 w-4 text-[#552F0B]" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-[#0A0A0A]">
              {effectiveOnline
                ? "Connected — local save before synchronization"
                : "Offline mode — your report stays on this device"}
            </p>

            <p className="mt-1 text-xs leading-5 text-[#552F0B]/70">
              {effectiveOnline
                ? "Your report is persisted in IndexedDB before synchronization is attempted."
                : "Your report will be saved in IndexedDB and added to the local synchronization queue."}{" "}
              Saving a draft keeps it local-only until you submit it.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave(true);
          }}
          noValidate
          className="space-y-4"
        >
          {/* Issue Information */}
          <section className={sectionClass}>
            <SectionHeading
              number="01"
              title="Issue Information"
              description="Identify the infrastructure issue and when it was observed."
              icon={FileEdit}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className={labelClass}>
                  Infrastructure Category
                  <span className="ml-1 text-[#BE732F]">*</span>
                </label>

                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  aria-invalid={Boolean(errors.category)}
                  className={inputClass}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <FieldError>{errors.category}</FieldError>
              </div>

              <div>
                <label htmlFor="reportedAt" className={labelClass}>
                  Observation Date &amp; Time
                  <span className="ml-1 text-[#BE732F]">*</span>
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#BE732F]" />

                  <input
                    id="reportedAt"
                    type="datetime-local"
                    value={form.reportedAt}
                    onChange={(e) => updateField("reportedAt", e.target.value)}
                    aria-invalid={Boolean(errors.reportedAt)}
                    className={`${inputClass} pl-10 font-mono text-xs tabular-nums`}
                  />
                </div>

                <FieldError>{errors.reportedAt}</FieldError>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="title" className={labelClass}>
                Short Issue Summary
                <span className="ml-2 font-normal text-[#552F0B]/50">
                  Optional
                </span>
              </label>

              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Main water valve casing fracture"
                className={inputClass}
              />

              <p className="mt-1.5 text-[11px] text-[#552F0B]/50">
                Leave blank to allow the application to generate a title.
              </p>
            </div>
          </section>

          {/* Priority Selection */}
          <section className={sectionClass}>
            <SectionHeading
              number="02"
              title="Issue Priority"
              description="Select the urgency level based on the observed impact."
              icon={AlertCircle}
            />

            <div
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              role="radiogroup"
              aria-label="Priority Level"
            >
              {PRIORITIES.map((prio) => {
                const active = form.priority === prio;

                return (
                  <button
                    key={prio}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => updateField("priority", prio)}
                    className={`min-h-12 cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                      active
                        ? "border-[#0A0A0A] bg-[#0A0A0A] text-[#F4B64F] shadow-[0_4px_14px_rgba(10,10,10,0.15)] ring-2 ring-[#F4B64F]/40"
                        : "border-[#BE732F]/20 bg-[#EFEEEC]/65 text-[#552F0B] hover:border-[#BE732F]/55 hover:bg-[#F4B64F]/10"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F4B64F]" />
                      )}
                      {prio}
                    </span>
                  </button>
                );
              })}
            </div>

            <FieldError>{errors.priority}</FieldError>

            <p className="mt-3 text-[11px] leading-5 text-[#552F0B]/55">
              Choose Critical for issues requiring immediate attention, High for
              serious disruptions, Medium for standard issues, and Low for minor
              maintenance concerns.
            </p>
          </section>

          {/* Location Information */}
          <section className={sectionClass}>
            <SectionHeading
              number="03"
              title="Location Details"
              description="Identify where the issue occurred. GPS coordinates are optional."
              icon={MapPin}
            />

            <div>
              <label htmlFor="locationName" className={labelClass}>
                Site Name / Location Identifier
                <span className="ml-1 text-[#BE732F]">*</span>
              </label>

              <input
                id="locationName"
                type="text"
                value={form.locationName}
                onChange={(e) => updateField("locationName", e.target.value)}
                aria-invalid={Boolean(errors.locationName)}
                placeholder="e.g. Main water pumping station"
                className={inputClass}
              />

              <FieldError>{errors.locationName}</FieldError>
            </div>

            <div className="mt-5 rounded-xl border border-[#BE732F]/15 bg-[#EFEEEC]/55 p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#0A0A0A]">
                    GPS Coordinates
                  </p>
                  <p className="mt-1 text-[11px] text-[#552F0B]/55">
                    Add geographical coordinates for more precise field
                    identification.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isLocating || isSaving}
                  onClick={handleUseDeviceGPS}
                >
                  <Crosshair className="h-3.5 w-3.5" />
                  <span>{isLocating ? "Locating..." : "Capture GPS"}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="latitude" className={labelClass}>
                    Latitude
                  </label>

                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => updateField("latitude", e.target.value)}
                    aria-invalid={Boolean(errors.latitude)}
                    placeholder="e.g. 8.9806"
                    className={`${inputClass} font-mono tabular-nums`}
                  />

                  <FieldError>{errors.latitude}</FieldError>
                </div>

                <div>
                  <label htmlFor="longitude" className={labelClass}>
                    Longitude
                  </label>

                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => updateField("longitude", e.target.value)}
                    aria-invalid={Boolean(errors.longitude)}
                    placeholder="e.g. 38.7578"
                    className={`${inputClass} font-mono tabular-nums`}
                  />

                  <FieldError>{errors.longitude}</FieldError>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 border-t border-[#BE732F]/15 pt-3">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#BE732F]" />
                <p className="text-[10px] leading-5 text-[#552F0B]/60">
                  GPS access requires browser permission and a supported secure
                  context. You can also enter coordinates manually.
                </p>
              </div>
            </div>
          </section>

          {/* Field Description */}
          <section className={sectionClass}>
            <SectionHeading
              number="04"
              title="Field Observation"
              description="Provide enough detail for the response team to understand and assess the problem."
              icon={FileEdit}
            />

            <label htmlFor="description" className={labelClass}>
              Description &amp; Damage Details
              <span className="ml-1 text-[#BE732F]">*</span>
            </label>

            <textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              aria-invalid={Boolean(errors.description)}
              placeholder="Describe the infrastructure failure, visible damage, immediate hazards, temporary containment applied, and access instructions for the response team..."
              className="w-full resize-y rounded-xl border border-[#BE732F]/20 bg-[#EFEEEC]/65 p-4 text-sm leading-7 text-[#0A0A0A] placeholder:text-[#552F0B]/45 outline-none transition-all duration-200 focus:border-[#BE732F] focus:bg-white focus:ring-2 focus:ring-[#F4B64F]/30"
            />

            <div className="mt-2 flex items-start justify-between gap-3">
              <FieldError>{errors.description}</FieldError>
              <span className="shrink-0 text-[10px] tabular-nums text-[#552F0B]/45">
                {form.description.trim().length} characters
              </span>
            </div>
          </section>

          {/* Submission Actions */}
          <section className="overflow-hidden rounded-2xl border border-[#BE732F]/20 bg-white shadow-[0_8px_30px_rgba(85,47,11,0.045)]">
            <div className="border-b border-[#BE732F]/15 bg-[#EFEEEC]/55 px-5 py-4">
              <p className="text-xs font-bold text-[#0A0A0A]">
                Ready to save your report?
              </p>
              <p className="mt-1 text-[11px] leading-5 text-[#552F0B]/60">
                Choose whether to keep it as a local draft or submit it for
                synchronization.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                disabled={isSaving || isLocating}
                onClick={() => handleSave(false)}
                className="w-full sm:w-auto"
              >
                <FileEdit className="h-4 w-4" />
                <span>Save Draft Locally</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSaving || isLocating}
                className="w-full sm:w-auto"
              >
                <Send className="h-4 w-4" />
                <span>
                  {isSaving
                    ? "Saving Report..."
                    : effectiveOnline
                      ? "Submit & Sync Report"
                      : "Save & Queue Offline"}
                </span>
              </Button>
            </div>
          </section>
        </form>
      </div>
    </AppShell>
  );
}
