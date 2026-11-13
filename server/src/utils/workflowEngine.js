export const ALLOWED_TRANSITIONS = {
  Draft: ['Submitted'],
  Submitted: ['Assigned', 'Rejected'],
  Assigned: ['In Progress', 'Rejected'],
  'In Progress': ['Resolved'],
  Resolved: [],
  Rejected: [],
};

// Map uppercase variants to standard TitleCase
const STATUS_NORMALIZATION_MAP = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  'IN PROGRESS': 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
};

export function normalizeStatus(status) {
  if (!status || typeof status !== 'string') return status;
  const upper = status.trim().toUpperCase();
  return STATUS_NORMALIZATION_MAP[upper] || status.trim();
}

export function canTransition(fromStatus, toStatus) {
  const normFrom = normalizeStatus(fromStatus);
  const normTo = normalizeStatus(toStatus);
  const allowed = ALLOWED_TRANSITIONS[normFrom] || [];
  return allowed.includes(normTo);
}

export function validateTransition(fromStatus, toStatus, userRole = null) {
  const normFrom = normalizeStatus(fromStatus);
  const normTo = normalizeStatus(toStatus);

  if (normFrom === normTo) {
    return {
      valid: false,
      code: 'SAME_STATUS',
      reason: `Report is already in "${normFrom}" status.`,
      currentStatus: normFrom,
      requestedStatus: normTo,
      allowedTransitions: ALLOWED_TRANSITIONS[normFrom] || [],
    };
  }

  const allowed = ALLOWED_TRANSITIONS[normFrom] || [];
  if (!allowed.includes(normTo)) {
    return {
      valid: false,
      code: 'INVALID_TRANSITION',
      reason: `Workflow cannot transition directly from "${normFrom}" to "${normTo}". Allowed transitions: ${
        allowed.length > 0 ? allowed.join(', ') : 'none (terminal state)'
      }.`,
      currentStatus: normFrom,
      requestedStatus: normTo,
      allowedTransitions: allowed,
    };
  }

  // Role-based transition checks
  if (userRole) {
    const isCoordinator = userRole === 'COORDINATOR';

    if (normTo === 'Assigned' && !isCoordinator) {
      return {
        valid: false,
        code: 'UNAUTHORIZED_ROLE',
        reason: 'Only a Coordinator can assign reports.',
        currentStatus: normFrom,
        requestedStatus: normTo,
        allowedTransitions: allowed,
      };
    }

    if (normTo === 'Rejected' && !isCoordinator) {
      return {
        valid: false,
        code: 'UNAUTHORIZED_ROLE',
        reason: 'Only a Coordinator can reject reports.',
        currentStatus: normFrom,
        requestedStatus: normTo,
        allowedTransitions: allowed,
      };
    }
  }

  return { valid: true, reason: null, normalizedTo: normTo, normalizedFrom: normFrom };
}

