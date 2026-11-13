import { z } from 'zod';
import { createReportSchema } from './reportValidators.js';

export const syncItemSchema = z.object({
  queueId: z.string({ required_error: 'queueId is required' }),
  operation: z.enum(
    ['CREATE_REPORT', 'UPDATE_REPORT', 'UPDATE_STATUS', 'ASSIGN_REPORT'],
    { errorMap: () => ({ message: 'Invalid sync operation' }) }
  ),
  payloadVersion: z.number().int().min(1).default(1),
  report: createReportSchema.refine((r) => r.status !== 'Draft', {
    message: 'Draft reports remain local and cannot be synchronized until submitted.',
  }),
});

export const batchSyncSchema = z.object({
  items: z
    .array(syncItemSchema, { required_error: 'Sync payload must include items array' })
    .min(1, 'Sync payload items array cannot be empty')
    .max(50, 'Cannot synchronize more than 50 items in a single batch'),
});

