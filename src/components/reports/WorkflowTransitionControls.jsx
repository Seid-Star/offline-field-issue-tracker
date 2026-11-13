import { useState } from "react";
import {
  Lock,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  ArrowRight,
  Clock,
  AlertCircle,
  Workflow,
} from "lucide-react";

import { useApp } from "../../context/AppContext.jsx";
import { canTransition } from "../../services/reportService.js";
import {
  ALLOWED_TRANSITIONS,
  WORKFLOW_STATUSES,
} from "../../utils/constants.js";
import { Button } from "../common/Button.jsx";

export function WorkflowTransitionControls({ report, onOpenAssignModal }) {
  const { demoRole, switchRole, submitDraft, transitionStatus, addToast } =
    useApp();

  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const isCoordinator = demoRole === "coordinator";
  const allowedNext = ALLOWED_TRANSITIONS[report.status] || [];

  const handleTransition = async (nextStatus) => {
    setBusy(true);

    try {
      if (report.status === "Draft" && nextStatus === "Submitted") {
        await submitDraft(report.clientId);
      } else {
        await transitionStatus(report.clientId, nextStatus, note);
        setNote("");
      }
    } catch (err) {
      addToast({
        title: "Transition rejected by workflow rules",
        description: err.message,
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const isTerminal = allowedNext.length === 0;

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#BE732F]/20 bg-[#EFEEEC] shadow-[0_8px_30px_rgba(85,47,11,0.05)]">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-[#BE732F]/15 bg-[#0A0A0A] px-5 py-5 sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full border border-[#F4B64F]/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-5 -top-12 h-36 w-36 rounded-full border border-[#BE732F]/15"
        />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F4B64F]/25 bg-[#F4B64F]/10 text-[#F4B64F]">
              <Workflow className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-[#EFEEEC] sm:text-lg">
                Workflow Progression
              </h3>
              <p className="mt-1 max-w-xl text-xs leading-5 text-[#EFEEEC]/55">
                Track the report lifecycle and manage its next permitted
                transition.
              </p>
            </div>
          </div>

          <span className="rounded-full border border-[#F4B64F]/25 bg-[#F4B64F]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#F4B64F]">
            {report.status}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        {/* Workflow stages */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.13em] text-[#552F0B]">
                Lifecycle stages
              </h4>
              <p className="mt-1 text-[11px] text-[#552F0B]/60">
                Current state and permitted next steps
              </p>
            </div>

            <span className="text-[10px] font-medium text-[#552F0B]/55">
              {WORKFLOW_STATUSES.length} stages
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {WORKFLOW_STATUSES.map((status, index) => {
              const isCurrent = report.status === status;
              const isAllowedNext = canTransition(report.status, status);
              const isBlocked = !isCurrent && !isAllowedNext;

              return (
                <div
                  key={status}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`relative min-w-0 rounded-2xl border p-3 transition-all duration-200 ${
                    isCurrent
                      ? "border-[#552F0B] bg-[#552F0B] shadow-[0_5px_15px_rgba(85,47,11,0.15)]"
                      : isAllowedNext
                        ? "border-[#BE732F]/45 bg-[#F4B64F]/15"
                        : "border-[#BE732F]/15 bg-white/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                        isCurrent
                          ? "bg-[#F4B64F] text-[#552F0B]"
                          : isAllowedNext
                            ? "bg-[#BE732F]/20 text-[#552F0B]"
                            : "bg-[#BE732F]/10 text-[#552F0B]/60"
                      }`}
                    >
                      {isCurrent ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        index + 1
                      )}
                    </span>

                    {isBlocked && (
                      <Lock
                        className="h-3 w-3 shrink-0 text-[#552F0B]/35"
                        aria-label="Locked stage"
                      />
                    )}

                    {isAllowedNext && (
                      <ArrowRight className="h-3 w-3 shrink-0 text-[#BE732F]" />
                    )}
                  </div>

                  <p
                    className={`mt-3 truncate text-xs font-bold ${
                      isCurrent
                        ? "text-[#F4B64F]"
                        : isAllowedNext
                          ? "text-[#552F0B]"
                          : "text-[#552F0B]/65"
                    }`}
                    title={status}
                  >
                    {status}
                  </p>

                  <p
                    className={`mt-1 text-[9px] font-medium ${
                      isCurrent
                        ? "text-[#EFEEEC]/65"
                        : isAllowedNext
                          ? "text-[#BE732F]"
                          : "text-[#552F0B]/40"
                    }`}
                  >
                    {isCurrent
                      ? "Current state"
                      : isAllowedNext
                        ? "Next available"
                        : "Locked"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role notice */}
        {!isCoordinator &&
          report.status !== "Draft" &&
          allowedNext.length > 0 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-[#BE732F]/25 bg-[#F4B64F]/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#552F0B] text-[#F4B64F]">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#0A0A0A]">
                    Coordinator authorization required
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#552F0B]/70">
                    Switch to Coordinator mode to manage assignments and
                    workflow transitions in this demo.
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => switchRole("coordinator")}
                className="shrink-0"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Switch Role
              </Button>
            </div>
          )}

        {/* Terminal state */}
        {isTerminal ? (
          <div className="flex items-start gap-3 rounded-2xl border border-[#BE732F]/20 bg-[#BE732F]/[0.07] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#552F0B] text-[#F4B64F]">
              <Lock className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#0A0A0A]">
                Workflow completed
              </p>
              <p className="mt-1 text-xs leading-5 text-[#552F0B]/70">
                This report is in a terminal state (
                <strong>{report.status}</strong>). No further status transitions
                are permitted.
              </p>
            </div>
          </div>
        ) : report.status === "Draft" ? (
          /* Draft submission */
          <div className="flex flex-col gap-4 border-t border-[#BE732F]/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4B64F]/20 text-[#552F0B]">
                <Clock className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#0A0A0A]">
                  Ready for submission?
                </p>
                <p className="mt-1 max-w-md text-xs leading-5 text-[#552F0B]/65">
                  Drafts remain stored locally in IndexedDB until submitted.
                  Submission starts the triage and synchronization process.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              disabled={busy}
              onClick={() => handleTransition("Submitted")}
              className="w-full shrink-0 sm:w-auto"
            >
              {busy ? "Submitting..." : "Submit Report"}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          /* Coordinator actions */
          <div className="space-y-4 border-t border-[#BE732F]/15 pt-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#BE732F]/15 text-[#552F0B]">
                <UserPlus className="h-4 w-4" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0A0A0A]">
                  Available actions
                </h4>
                <p className="text-[11px] text-[#552F0B]/60">
                  Actions are determined by the current workflow state.
                </p>
              </div>
            </div>

            {/* Transition note */}
            <div className="space-y-2">
              <label
                htmlFor="transition-note"
                className="block text-xs font-bold text-[#552F0B]"
              >
                Transition note
                <span className="ml-1 font-normal text-[#552F0B]/50">
                  (Optional)
                </span>
              </label>

              <input
                id="transition-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={!isCoordinator || busy}
                placeholder="Add context about this workflow change..."
                className="h-11 w-full rounded-xl border border-[#BE732F]/20 bg-white px-3.5 text-sm text-[#0A0A0A] outline-none transition-all placeholder:text-[#552F0B]/40 hover:border-[#BE732F]/40 focus:border-[#BE732F] focus:ring-2 focus:ring-[#F4B64F]/30 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2.5">
              {allowedNext.includes("Assigned") && (
                <Button
                  variant="primary"
                  disabled={!isCoordinator || busy}
                  onClick={onOpenAssignModal}
                >
                  <UserPlus className="h-4 w-4" />
                  Assign Responsibility
                </Button>
              )}

              {allowedNext.includes("In Progress") && (
                <Button
                  variant="primary"
                  disabled={!isCoordinator || busy}
                  onClick={() => handleTransition("In Progress")}
                >
                  <Clock className="h-4 w-4" />
                  Start Field Work
                </Button>
              )}

              {allowedNext.includes("Resolved") && (
                <Button
                  variant="secondary"
                  disabled={!isCoordinator || busy}
                  onClick={() => handleTransition("Resolved")}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Resolved
                </Button>
              )}

              {allowedNext.includes("Rejected") && (
                <Button
                  variant="danger-outline"
                  disabled={!isCoordinator || busy}
                  onClick={() => handleTransition("Rejected")}
                >
                  <AlertCircle className="h-4 w-4" />
                  Reject Report
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
