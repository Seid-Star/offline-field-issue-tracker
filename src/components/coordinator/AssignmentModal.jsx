import { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { FIELD_CREWS } from '../../utils/constants.js';
import { Button } from '../common/Button.jsx';
import { Modal } from '../common/Modal.jsx';

export function AssignmentModal({ isOpen, onClose, report }) {
  const { assignReport, addToast } = useApp();
  const [selectedCrew, setSelectedCrew] = useState(
    report?.assignee || FIELD_CREWS[0].name
  );
  const [customAssignee, setCustomAssignee] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!report) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const target = selectedCrew === '__custom__' ? customAssignee.trim() : selectedCrew;
    if (!target) {
      addToast({
        title: 'Assignee required',
        description: 'Select a response crew or enter a person name.',
        variant: 'warning',
      });
      return;
    }

    setSubmitting(true);
    try {
      await assignReport(report.clientId, target);
      onClose();
    } catch (err) {
      addToast({
        title: 'Assignment blocked',
        description: err.message,
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Responsibility"
      subtitle={`Dispatch team for: ${report.title}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#172B27]">Select Field Response Unit</p>
          <div className="space-y-2">
            {FIELD_CREWS.map((crew) => (
              <label
                key={crew.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedCrew === crew.name
                    ? 'bg-[#123D35]/6 border-[#123D35] text-[#172B27]'
                    : 'bg-white border-[#123D35]/12 hover:bg-[#F5F7F5]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="assignee"
                    value={crew.name}
                    checked={selectedCrew === crew.name}
                    onChange={(e) => setSelectedCrew(e.target.value)}
                    className="accent-[#123D35]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-[#172B27]">
                      {crew.name}
                    </span>
                    <span className="block text-xs text-[#71817B]">Lead: {crew.lead}</span>
                  </span>
                </span>
              </label>
            ))}

            <label
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                selectedCrew === '__custom__'
                  ? 'bg-[#123D35]/6 border-[#123D35]'
                  : 'bg-white border-[#123D35]/12 hover:bg-[#F5F7F5]'
              }`}
            >
              <input
                type="radio"
                name="assignee"
                value="__custom__"
                checked={selectedCrew === '__custom__'}
                onChange={(e) => setSelectedCrew(e.target.value)}
                className="accent-[#123D35]"
              />
              <span className="text-sm font-medium text-[#172B27]">
                Assign specific specialist
              </span>
            </label>
          </div>
        </div>

        {selectedCrew === '__custom__' && (
          <div>
            <label htmlFor="custom-assignee" className="block text-xs font-medium text-[#172B27] mb-1">
              Specialist or Contractor Name
            </label>
            <input
              id="custom-assignee"
              type="text"
              value={customAssignee}
              onChange={(e) => setCustomAssignee(e.target.value)}
              placeholder="e.g., Eng. Tariq Mansour"
              className="w-full h-11 px-3 rounded-xl bg-[#F5F7F5] border border-[#123D35]/15 text-sm text-[#172B27] focus:outline-none focus:ring-2 focus:ring-[#16A477]"
            />
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            <UserCheck className="w-4 h-4" />
            <span>{submitting ? 'Assigning...' : 'Confirm Assignment'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
