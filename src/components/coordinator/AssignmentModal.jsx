import { useState } from "react";
import { UserCheck, Users, UserRound, Check, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { FIELD_CREWS } from "../../utils/constants.js";
import { Button } from "../common/Button.jsx";
import { Modal } from "../common/Modal.jsx";

export function AssignmentModal({ isOpen, onClose, report }) {
  const { assignReport, addToast } = useApp();

  const [selectedCrew, setSelectedCrew] = useState(
    report?.assignee || FIELD_CREWS[0].name,
  );
  const [customAssignee, setCustomAssignee] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!report) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const target =
      selectedCrew === "__custom__" ? customAssignee.trim() : selectedCrew;

    if (!target) {
      addToast({
        title: "Assignee required",
        description: "Select a response crew or enter a specialist name.",
        variant: "warning",
      });
      return;
    }

    setSubmitting(true);

    try {
      await assignReport(report.clientId, target);
      onClose();
    } catch (err) {
      addToast({
        title: "Assignment blocked",
        description: err.message,
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isCustomSelected = selectedCrew === "__custom__";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Responsibility"
      subtitle={`Dispatch a response team for: ${report.title}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Report context */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#BE732F]/20 bg-[#F4B64F]/10 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4B64F]/25 text-[#552F0B]">
            <UserCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#BE732F]">
              Assignment target
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-[#0A0A0A]">
              {report.title}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#552F0B]/70">
              Choose the team or specialist responsible for resolving this field
              issue.
            </p>
          </div>
        </div>

        {/* Crew selection */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#0A0A0A]">
                Response unit
              </h3>
              <p className="mt-1 text-xs text-[#552F0B]/65">
                Select an available field crew.
              </p>
            </div>

            <span className="rounded-full border border-[#BE732F]/20 bg-[#BE732F]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#552F0B]">
              {FIELD_CREWS.length} crews
            </span>
          </div>

          <div className="space-y-2">
            {FIELD_CREWS.map((crew) => {
              const isSelected = selectedCrew === crew.name;

              return (
                <label
                  key={crew.id}
                  className={`group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all duration-200 ${
                    isSelected
                      ? "border-[#BE732F]/60 bg-[#F4B64F]/15 shadow-[0_4px_16px_rgba(85,47,11,0.07)]"
                      : "border-[#BE732F]/15 bg-[#EFEEEC] hover:border-[#BE732F]/40 hover:bg-[#BE732F]/[0.05]"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isSelected
                          ? "bg-[#552F0B] text-[#F4B64F]"
                          : "bg-[#BE732F]/10 text-[#552F0B]"
                      }`}
                    >
                      <Users className="h-5 w-5" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[#0A0A0A]">
                        {crew.name}
                      </span>
                      <span className="mt-1 block text-xs text-[#552F0B]/65">
                        Team lead: {crew.lead}
                      </span>
                    </span>
                  </span>

                  <span className="flex shrink-0 items-center gap-2">
                    <input
                      type="radio"
                      name="assignee"
                      value={crew.name}
                      checked={isSelected}
                      onChange={(e) => setSelectedCrew(e.target.value)}
                      className="h-4 w-4 cursor-pointer accent-[#552F0B]"
                    />

                    {isSelected && <Check className="h-4 w-4 text-[#BE732F]" />}
                  </span>
                </label>
              );
            })}

            {/* Custom specialist */}
            <label
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all duration-200 ${
                isCustomSelected
                  ? "border-[#BE732F]/60 bg-[#F4B64F]/15 shadow-[0_4px_16px_rgba(85,47,11,0.07)]"
                  : "border-[#BE732F]/15 bg-[#EFEEEC] hover:border-[#BE732F]/40 hover:bg-[#BE732F]/[0.05]"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isCustomSelected
                      ? "bg-[#552F0B] text-[#F4B64F]"
                      : "bg-[#BE732F]/10 text-[#552F0B]"
                  }`}
                >
                  <UserRound className="h-5 w-5" />
                </span>

                <span>
                  <span className="block text-sm font-semibold text-[#0A0A0A]">
                    Assign a specialist
                  </span>
                  <span className="mt-1 block text-xs text-[#552F0B]/65">
                    Enter a contractor or individual name.
                  </span>
                </span>
              </span>

              <input
                type="radio"
                name="assignee"
                value="__custom__"
                checked={isCustomSelected}
                onChange={(e) => setSelectedCrew(e.target.value)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-[#552F0B]"
              />
            </label>
          </div>
        </section>

        {/* Custom assignee input */}
        {isCustomSelected && (
          <div className="space-y-2">
            <label
              htmlFor="custom-assignee"
              className="block text-xs font-bold uppercase tracking-wider text-[#552F0B]"
            >
              Specialist or contractor name
            </label>

            <input
              id="custom-assignee"
              type="text"
              value={customAssignee}
              onChange={(e) => setCustomAssignee(e.target.value)}
              placeholder="Enter specialist name"
              autoFocus
              className="h-12 w-full rounded-xl border border-[#BE732F]/25 bg-[#EFEEEC] px-4 text-sm text-[#0A0A0A] outline-none transition-all placeholder:text-[#552F0B]/40 focus:border-[#BE732F] focus:ring-2 focus:ring-[#F4B64F]/30"
            />

            <p className="text-xs text-[#552F0B]/60">
              Enter the full name of the person responsible for this issue.
            </p>
          </div>
        )}

        {/* Assignment summary */}
        <div className="flex items-center gap-3 rounded-xl border border-[#BE732F]/15 bg-[#BE732F]/[0.06] px-3.5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#BE732F]/15 text-[#552F0B]">
            <ArrowRight className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#BE732F]">
              Assigning to
            </p>
            <p className="truncate text-sm font-semibold text-[#0A0A0A]">
              {isCustomSelected
                ? customAssignee.trim() || "Specialist not specified"
                : selectedCrew}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 border-t border-[#BE732F]/15 pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            <UserCheck className="h-4 w-4" />
            <span>{submitting ? "Assigning..." : "Confirm Assignment"}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
