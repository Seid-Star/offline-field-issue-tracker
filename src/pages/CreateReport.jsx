import { useState } from 'react';
import { Crosshair, FileEdit, Send, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useNetwork } from '../context/NetworkContext.jsx';
import { CATEGORIES, PRIORITIES } from '../utils/constants.js';
import { toLocalDateTimeInputValue } from '../utils/formatters.js';

export function CreateReport() {
  const navigate = useNavigate();
  const { createReport, addToast } = useApp();
  const { effectiveOnline } = useNetwork();

  const [form, setForm] = useState({
    title: '',
    category: CATEGORIES[0],
    description: '',
    locationName: '',
    latitude: '',
    longitude: '',
    priority: 'Medium',
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
      nextErrors.category = 'Please select an infrastructure category.';
    }
    if (!form.locationName.trim() || form.locationName.trim().length < 3) {
      nextErrors.locationName = 'Enter a specific site or location name (at least 3 characters).';
    }
    if (!form.description.trim() || form.description.trim().length < 12) {
      nextErrors.description =
        'Provide a clear field description (at least 12 characters) so crews can prepare.';
    }
    if (!form.priority) {
      nextErrors.priority = 'Select an issue priority level.';
    }
    if (!form.reportedAt) {
      nextErrors.reportedAt = 'Specify when the issue was observed.';
    }
    if (form.latitude !== '') {
      const lat = Number(form.latitude);
      if (Number.isNaN(lat) || lat < -90 || lat > 90) {
        nextErrors.latitude = 'Latitude must be between -90 and 90.';
      }
    }
    if (form.longitude !== '') {
      const lng = Number(form.longitude);
      if (Number.isNaN(lng) || lng < -180 || lng > 180) {
        nextErrors.longitude = 'Longitude must be between -180 and 180.';
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleUseDeviceGPS = () => {
    if (!navigator.geolocation) {
      addToast({
        title: 'Geolocation unavailable',
        description: 'This browser does not support GPS capture. You can enter coordinates manually.',
        variant: 'warning',
      });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateField('latitude', pos.coords.latitude.toFixed(6));
        updateField('longitude', pos.coords.longitude.toFixed(6));
        setIsLocating(false);
        addToast({
          title: 'GPS coordinates captured',
          description: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          variant: 'success',
        });
      },
      () => {
        setIsLocating(false);
        addToast({
          title: 'Could not read GPS location',
          description: 'Permission denied or weak signal. Coordinates remain optional.',
          variant: 'warning',
        });
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  };

  const handleSave = async (submitImmediately) => {
    if (!validate()) {
      addToast({
        title: 'Check required fields',
        description: 'Please fix the highlighted validation messages before saving.',
        variant: 'error',
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
        title: 'Failed to save report locally',
        description: err.message,
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell
      title="Create Field Report"
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Reports', to: '/reports' },
        { label: 'Create' },
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Persistence & Connectivity Guidance Banner */}
        <div
          className={`rounded-2xl border p-4 flex items-start gap-3 ${
            effectiveOnline
              ? 'bg-[#16A477]/10 border-[#16A477]/30 text-[#0E7A57]'
              : 'bg-[#E6A23C]/12 border-[#E6A23C]/35 text-[#8A5708]'
          }`}
        >
          {effectiveOnline ? (
            <Wifi className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <WifiOff className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div className="text-xs leading-relaxed">
            <p className="font-semibold">
              {effectiveOnline
                ? 'Online: Report saves to IndexedDB first, then submits via simulated sync adapter'
                : 'Offline: Report will save safely in IndexedDB and enter the local sync queue'}
            </p>
            <p className="mt-0.5 opacity-90">
              Saving a Draft keeps the report local-only on this device without queuing it for synchronization.
            </p>
          </div>
        </div>

        {/* Form Surface */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave(true);
          }}
          noValidate
          className="rounded-2xl bg-white border border-[#123D35]/10 p-5 sm:p-6 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-[#172B27] mb-1.5">
                Category <span className="text-[#DC5555]">*</span>
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                aria-invalid={Boolean(errors.category)}
                className="w-full h-11 px-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/15 text-sm text-[#172B27] focus:outline-none focus:ring-2 focus:ring-[#16A477] focus:bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-[#DC5555]">{errors.category}</p>
              )}
            </div>

            {/* Observed Date & Time */}
            <div>
              <label htmlFor="reportedAt" className="block text-xs font-semibold text-[#172B27] mb-1.5">
                Observation Date &amp; Time <span className="text-[#DC5555]">*</span>
              </label>
              <input
                id="reportedAt"
                type="datetime-local"
                value={form.reportedAt}
                onChange={(e) => updateField('reportedAt', e.target.value)}
                aria-invalid={Boolean(errors.reportedAt)}
                className="w-full h-11 px-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/15 text-sm text-[#172B27] font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#16A477] focus:bg-white"
              />
              {errors.reportedAt && (
                <p className="mt-1 text-xs text-[#DC5555]">{errors.reportedAt}</p>
              )}
            </div>
          </div>

          {/* Short Summary Title (Optional) */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-[#172B27] mb-1.5">
              Short Issue Summary <span className="text-[#71817B] font-normal">(optional — auto-titled if blank)</span>
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g., Main borehole valve casing fracture"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F5F7F5] border border-[#123D35]/15 text-sm text-[#172B27] placeholder:text-[#71817B] focus:outline-none focus:ring-2 focus:ring-[#16A477] focus:bg-white"
            />
          </div>

          {/* Priority Tactile Selector */}
          <div>
            <span className="block text-xs font-semibold text-[#172B27] mb-1.5">
              Priority Level <span className="text-[#DC5555]">*</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Priority Level">
              {PRIORITIES.map((prio) => {
                const active = form.priority === prio;
                const activeStyle =
                  prio === 'Critical'
                    ? 'bg-[#DC5555] text-white border-[#DC5555]'
                    : prio === 'High'
                      ? 'bg-[#E6A23C] text-[#092B27] border-[#E6A23C] font-semibold'
                      : prio === 'Medium'
                        ? 'bg-[#123D35] text-white border-[#123D35]'
                        : 'bg-[#1B5B4C] text-white border-[#1B5B4C]';

                return (
                  <button
                    key={prio}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => updateField('priority', prio)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      active
                        ? activeStyle
                        : 'bg-[#F5F7F5] text-[#172B27] border-[#123D35]/12 hover:bg-[#EAEFEA]'
                    }`}
                  >
                    {prio}
                  </button>
                );
              })}
            </div>
            {errors.priority && (
              <p className="mt-1 text-xs text-[#DC5555]">{errors.priority}</p>
            )}
          </div>

          {/* Location Name & Optional Coordinates */}
          <div className="space-y-3">
            <div>
              <label htmlFor="locationName" className="block text-xs font-semibold text-[#172B27] mb-1.5">
                Location Name / Site Identifier <span className="text-[#DC5555]">*</span>
              </label>
              <input
                id="locationName"
                type="text"
                value={form.locationName}
                onChange={(e) => updateField('locationName', e.target.value)}
                aria-invalid={Boolean(errors.locationName)}
                placeholder="e.g., Kibera Sector 4 Pump House"
                className="w-full h-11 px-3.5 rounded-xl bg-[#F5F7F5] border border-[#123D35]/15 text-sm text-[#172B27] placeholder:text-[#71817B] focus:outline-none focus:ring-2 focus:ring-[#16A477] focus:bg-white"
              />
              {errors.locationName && (
                <p className="mt-1 text-xs text-[#DC5555]">{errors.locationName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label htmlFor="latitude" className="block text-xs font-medium text-[#71817B] mb-1">
                  Latitude (optional)
                </label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => updateField('latitude', e.target.value)}
                  placeholder="e.g., 15.5007"
                  className="w-full h-11 px-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/15 text-sm font-mono tabular-nums text-[#172B27] focus:outline-none focus:ring-2 focus:ring-[#16A477] focus:bg-white"
                />
                {errors.latitude && (
                  <p className="mt-1 text-xs text-[#DC5555]">{errors.latitude}</p>
                )}
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="longitude" className="block text-xs font-medium text-[#71817B] mb-1">
                  Longitude (optional)
                </label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => updateField('longitude', e.target.value)}
                  placeholder="e.g., 32.5599"
                  className="w-full h-11 px-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/15 text-sm font-mono tabular-nums text-[#172B27] focus:outline-none focus:ring-2 focus:ring-[#16A477] focus:bg-white"
                />
                {errors.longitude && (
                  <p className="mt-1 text-xs text-[#DC5555]">{errors.longitude}</p>
                )}
              </div>

              <div className="sm:col-span-4">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  disabled={isLocating}
                  onClick={handleUseDeviceGPS}
                >
                  <Crosshair className="w-4 h-4 text-[#123D35]" />
                  <span>{isLocating ? 'Locating...' : 'Use Device GPS'}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-[#172B27] mb-1.5">
              Field Observation &amp; Damage Details <span className="text-[#DC5555]">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              aria-invalid={Boolean(errors.description)}
              placeholder="Describe the infrastructure failure, immediate hazards, temporary containment applied, and access notes..."
              className="w-full p-3.5 rounded-xl bg-[#F5F7F5] border border-[#123D35]/15 text-sm text-[#172B27] placeholder:text-[#71817B] focus:outline-none focus:ring-2 focus:ring-[#16A477] focus:bg-white leading-relaxed"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-[#DC5555]">{errors.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#123D35]/10 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
            <Button
              variant="secondary"
              size="lg"
              disabled={isSaving}
              onClick={() => handleSave(false)}
              className="w-full sm:w-auto"
            >
              <FileEdit className="w-4 h-4" />
              <span>Save Draft Locally</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSaving
                  ? 'Saving...'
                  : effectiveOnline
                    ? 'Submit & Sync Report'
                    : 'Save & Queue Offline'}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
