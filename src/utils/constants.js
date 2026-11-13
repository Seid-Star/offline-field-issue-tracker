export const CATEGORIES = [
  'Water Infrastructure',
  'Electrical Equipment',
  'Road Infrastructure',
  'Public Facilities',
  'Safety Concern',
  'Maintenance',
  'Other',
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const WORKFLOW_STATUSES = [
  'Draft',
  'Submitted',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected',
];

export const SYNC_STATUSES = [
  'Pending',
  'Syncing',
  'Synchronized',
  'Failed',
];

/**
 * Strict state machine enforced in reportService.js and represented in UI.
 * Draft remains local until explicitly submitted.
 */
export const ALLOWED_TRANSITIONS = {
  Draft: ['Submitted'],
  Submitted: ['Assigned', 'Rejected'],
  Assigned: ['In Progress', 'Rejected'],
  'In Progress': ['Resolved'],
  Resolved: [],
  Rejected: [],
};

export const TRANSITION_RULES_SUMMARY = [
  { from: 'Draft', to: ['Submitted'], note: 'Local draft must be submitted before sync or triage.' },
  { from: 'Submitted', to: ['Assigned', 'Rejected'], note: 'Coordinator reviews and assigns or rejects.' },
  { from: 'Assigned', to: ['In Progress', 'Rejected'], note: 'Crew begins field remediation or rejects.' },
  { from: 'In Progress', to: ['Resolved'], note: 'Only active remediation can be marked Resolved.' },
  { from: 'Resolved', to: [], note: 'Terminal state — closed after verification.' },
  { from: 'Rejected', to: [], note: 'Terminal state — closed without field dispatch.' },
];

export const DEMO_USERS = {
  field_worker: {
    id: 'usr-fw-01',
    name: 'Amira Hassan',
    role: 'Field Worker',
    roleKey: 'field_worker',
    unit: 'Sector North Infrastructure Team',
    email: 'amira.hassan@fieldops.org',
    avatar: '/src/assets/images/avatar_field_worker_1794512992067.jpg',
  },
  coordinator: {
    id: 'usr-co-01',
    name: 'Elena Vance',
    role: 'Operations Coordinator',
    roleKey: 'coordinator',
    unit: 'Central Dispatch & Triage Desk',
    email: 'elena.vance@fieldops.org',
    avatar: '/src/assets/images/avatar_coordinator_1794512990583.jpg',
  },
};

export const FIELD_CREWS = [
  { id: 'crew-hyd-1', name: 'Hydraulics Response Unit A', lead: 'K. Okafor' },
  { id: 'crew-elec-2', name: 'Grid & Substation Team B', lead: 'M. Lindqvist' },
  { id: 'crew-civil-3', name: 'Civil Roads & Drainage Crew', lead: 'S. Darwish' },
  { id: 'crew-fac-4', name: 'Municipal Facilities Maintenance', lead: 'R. Mensah' },
  { id: 'crew-safe-5', name: 'Rapid Safety & Hazard Unit', lead: 'N. Farouk' },
];
