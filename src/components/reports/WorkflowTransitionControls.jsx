import { useState } from 'react';
import { Lock, ShieldCheck, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { canTransition } from '../../services/reportService.js';
import { ALLOWED_TRANSITIONS, WORKFLOW_STATUSES } from '../../utils/constants.js';
import { Button } from '../common/Button.jsx';

export function WorkflowTransitionControls({ report, onOpenAssignModal }) {
  const { demoRole, switchRole, submitDraft, transitionStatus, addToast } = useApp();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const isCoordinator = demoRole === 'coordinator';
  const allowedNext = ALLOWED_TRANSITIONS[report.status] || [];

  const handleTransition = async (nextStatus) => {
    setBusy(true);
    try {
      if (report.status === 'Draft' && nextStatus === 'Submitted') {
        await submitDraft(report.clientId);
      } else {
        await transitionStatus(report.clientId, nextStatus, note);
        setNote('');
      }
    } catch (err) {
      addToast({
        title: 'Transition rejected by workflow rules',
        description: err.message,
        variant: 'error',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white border border-[#123D35]/10 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#172B27] font-display">
            Workflow Progression
          </h3>
          <p className="text-xs text-[#71817B] mt-0.5">
            Enforced path: Draft → Submitted → Assigned → In Progress → Resolved (or Rejected)
          </p>
        </div>
        {!isCoordinator && report.status !== 'Draft' && allowedNext.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => switchRole('coordinator')}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#123D35]" />
            <span>Switch to Coordinator Role</span>
          </Button>
        )}
      </div>

      {/* Visual Stage Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {WORKFLOW_STATUSES.map((status) => {
          const isCurrent = report.status === status;
          const isAllowedNext = canTransition(report.status, status);
          const isBlocked = !isCurrent && !isAllowedNext;

          return (
            <div
              key={status}
              className={`rounded-xl border px-3 py-2.5 text-xs transition-colors ${
                isCurrent
                  ? 'bg-[#123D35] text-white border-[#123D35] font-semibold'
                  : isAllowedNext
                    ? 'bg-[#16A477]/10 text-[#0E7A57] border-[#16A477]/35 font-medium'
                    : 'bg-[#F5F7F5] text-[#71817B] border-[#123D35]/8'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="truncate">{status}</span>
                {isBlocked && (
                  <Lock className="w-3 h-3 shrink-0 opacity-60" aria-hidden="true" />
                )}
              </div>
              <p
                className={`mt-1 text-[10px] ${
                  isCurrent
                    ? 'text-white/75'
                    : isAllowedNext
                      ? 'text-[#0E7A57]'
                      : 'text-[#71817B]/80'
                }`}
              >
                {isCurrent
                  ? 'Current state'
                  : isAllowedNext
                    ? 'Valid next step'
                    : 'Locked'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Action Controls */}
      {allowedNext.length === 0 ? (
        <div className="rounded-xl bg-[#F5F7F5] border border-[#123D35]/10 px-4 py-3 text-xs text-[#71817B]">
          This report is in a terminal workflow state (<strong>{report.status}</strong>). No further status transitions are permitted.
        </div>
      ) : report.status === 'Draft' ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#123D35]/8">
          <p className="text-xs text-[#71817B]">
            Drafts stay local in IndexedDB. Submit when ready to enter triage &amp; synchronization.
          </p>
          <Button
            variant="primary"
            disabled={busy}
            onClick={() => handleTransition('Submitted')}
          >
            Submit Report
          </Button>
        </div>
      ) : (
        <div className="space-y-3 pt-2 border-t border-[#123D35]/8">
          {!isCoordinator && (
            <p className="text-xs text-[#8A5708] bg-[#E6A23C]/12 border border-[#E6A23C]/30 rounded-xl px-3.5 py-2.5">
              Coordinator role is required to triage, assign, or resolve submitted reports. Switch to Coordinator above to test dispatch actions.
            </p>
          )}

          <div>
            <label htmlFor="transition-note" className="block text-xs font-medium text-[#172B27] mb-1">
              Optional transition note
            </label>
            <input
              id="transition-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={!isCoordinator || busy}
              placeholder="e.g., Crew dispatched with isolation clamps..."
              className="w-full h-10 px-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/12 text-sm text-[#172B27] placeholder:text-[#71817B] focus:outline-none focus:ring-2 focus:ring-[#16A477] disabled:opacity-60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {allowedNext.includes('Assigned') && (
              <Button
                variant="primary"
                disabled={!isCoordinator || busy}
                onClick={onOpenAssignModal}
              >
                <UserPlus className="w-4 h-4" />
                <span>Assign &amp; Move to Assigned</span>
              </Button>
            )}

            {allowedNext.includes('In Progress') && (
              <Button
                variant="primary"
                disabled={!isCoordinator || busy}
                onClick={() => handleTransition('In Progress')}
              >
                Start Field Work (In Progress)
              </Button>
            )}

            {allowedNext.includes('Resolved') && (
              <Button
                variant="emerald"
                disabled={!isCoordinator || busy}
                onClick={() => handleTransition('Resolved')}
              >
                Mark Resolved
              </Button>
            )}

            {allowedNext.includes('Rejected') && (
              <Button
                variant="danger-outline"
                disabled={!isCoordinator || busy}
                onClick={() => handleTransition('Rejected')}
              >
                Reject Report
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
