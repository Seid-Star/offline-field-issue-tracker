import { z } from 'zod';
import { REPORT_CATEGORIES, REPORT_PRIORITIES, WORKFLOW_STATUSES } from '../models/Report.js';
import { normalizeStatus } from '../utils/workflowEngine.js';

// Normalizers
const normalizePriority = (val) => {
  if (!val || typeof val !== 'string') return val;
  const upper = val.trim().toUpperCase();
  const map = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical',
  };
  return map[upper] || val.trim();
};

export const createReportSchema = z.object({
  clientId: z
    .string({ required_error: 'Client UUID (clientId) is required' })
    .uuid('clientId must be a valid UUID v4')
    .or(z.string().min(10, 'clientId must be at least 10 characters')),
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters long'),
  category: z
    .string({ required_error: 'Category is required' })
    .refine((val) => REPORT_CATEGORIES.includes(val), {
      message: `Category must be one of: ${REPORT_CATEGORIES.join(', ')}`,
    }),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, 'Description must be at least 10 characters long'),
  location: z.object({
    name: z
      .string({ required_error: 'Location name is required' })
      .trim()
      .min(2, 'Location name must be at least 2 characters'),
    latitude: z
      .number()
      .min(-90)
      .max(90)
      .nullable()
      .optional()
      .default(null),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .nullable()
      .optional()
      .default(null),
  }),
  priority: z
    .string()
    .transform(normalizePriority)
    .refine((val) => REPORT_PRIORITIES.includes(val), {
      message: `Priority must be one of: ${REPORT_PRIORITIES.join(', ')}`,
    })
    .default('Medium'),
  status: z
    .string()
    .transform(normalizeStatus)
    .refine((val) => WORKFLOW_STATUSES.includes(val), {
      message: `Status must be one of: ${WORKFLOW_STATUSES.join(', ')}`,
    })
    .default('Submitted'),
  reportedBy: z.string().trim().optional(),
  assignee: z.string().trim().nullable().optional(),
  reportedAt: z
    .string()
    .datetime({ offset: true })
    .or(z.string().datetime())
    .optional()
    .transform((val) => (val ? new Date(val) : new Date())),
  syncVersion: z.number().int().min(1).default(1),
});

export const updateReportSchema = z.object({
  title: z.string().trim().min(3).optional(),
  category: z
    .string()
    .refine((val) => REPORT_CATEGORIES.includes(val), {
      message: `Category must be one of: ${REPORT_CATEGORIES.join(', ')}`,
    })
    .optional(),
  description: z.string().trim().min(10).optional(),
  location: z
    .object({
      name: z.string().trim().min(2),
      latitude: z.number().min(-90).max(90).nullable().optional(),
      longitude: z.number().min(-180).max(180).nullable().optional(),
    })
    .optional(),
  priority: z
    .string()
    .transform(normalizePriority)
    .refine((val) => REPORT_PRIORITIES.includes(val), {
      message: `Priority must be one of: ${REPORT_PRIORITIES.join(', ')}`,
    })
    .optional(),
  syncVersion: z
    .number({ required_error: 'syncVersion is required for optimistic concurrency verification' })
    .int()
    .min(1),
});

export const transitionStatusSchema = z.object({
  status: z
    .string({ required_error: 'Target status is required' })
    .transform(normalizeStatus)
    .refine((val) => WORKFLOW_STATUSES.includes(val), {
      message: `Target status must be one of: ${WORKFLOW_STATUSES.join(', ')}`,
    }),
  note: z.string().trim().optional(),
  actor: z.string().trim().optional(),
  syncVersion: z
    .number({ required_error: 'Current syncVersion is required' })
    .int()
    .min(1),
});

export const assignReportSchema = z.object({
  assignee: z
    .string({ required_error: 'Assignee is required' })
    .trim()
    .min(2, 'Assignee name must be at least 2 characters'),
  actor: z.string().trim().optional(),
  syncVersion: z
    .number({ required_error: 'Current syncVersion is required' })
    .int()
    .min(1),
});

export const queryReportsSchema = z.object({
  category: z.string().optional(),
  priority: z.string().transform(normalizePriority).optional(),
  status: z.string().transform(normalizeStatus).optional(),
  search: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 20)),
  since: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : null)),
});

