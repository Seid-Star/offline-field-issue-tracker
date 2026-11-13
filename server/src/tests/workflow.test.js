import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { Activity } from '../models/Activity.js';
import { Report } from '../models/Report.js';
import { seedInitialCoordinator } from '../services/authService.js';
import { signToken } from '../utils/token.js';
import { clearTestDB, setupTestDB, teardownTestDB } from './testHelper.js';

describe('Workflow Engine & Transition Rules', () => {
  let app;
  let workerToken;
  let coordinatorToken;

  beforeAll(async () => {
    await setupTestDB();
    app = createApp();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  const setupTokens = async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
  name: 'Field Worker Amira',
  email: 'amira@fieldops.org',
  password: 'Password123!',
  unit: 'Hydraulics Unit A',
});
    workerToken = regRes.body.token;

    const coordResult = await seedInitialCoordinator({
      email: 'coordinator@fieldops.org',
      password: 'CoordinatorPass123!',
      name: 'Elena Vance',
    });
    coordinatorToken = signToken({
      userId: coordResult.user.id,
      email: coordResult.user.email,
      role: coordResult.user.role,
    });
  };

  const seedReportWithStatus = async (status, syncVersion = 1) => {
    const clientId = `test-client-${Math.random().toString(36).substring(2, 9)}`;
    const report = await Report.create({
      clientId,
      serverId: `SRV-2026-${clientId.slice(-4).toUpperCase()}`,
      title: 'Infrastructure Defect',
      category: 'Public Facilities',
      description: 'Defect requiring triage and resolution.',
      location: { name: 'Town Square' },
      priority: 'High',
      status,
      syncVersion,
    });
    return report;
  };

  it('enforces full valid workflow path: Draft -> Submitted -> Assigned -> In Progress -> Resolved', async () => {
    await setupTokens();

    const report = await seedReportWithStatus('Draft', 1);

    // 1. Draft -> Submitted (by Field Worker)
    const step1 = await request(app)
      .patch(`/api/reports/${report.clientId}/status`)
      .set('Authorization', `Bearer ${workerToken}`)
      .send({ status: 'Submitted', syncVersion: 1 });
    expect(step1.status).toBe(200);
    expect(step1.body.status).toBe('Submitted');
    expect(step1.body.syncVersion).toBe(2);

    // 2. Submitted -> Assigned (by Coordinator via /assign)
    const step2 = await request(app)
      .patch(`/api/reports/${report.clientId}/assign`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .send({ assignee: 'Hydraulics Unit A', syncVersion: 2 });
    expect(step2.status).toBe(200);
    expect(step2.body.status).toBe('Assigned');
    expect(step2.body.assignee).toBe('Hydraulics Unit A');
    expect(step2.body.syncVersion).toBe(3);

    // 3. Assigned -> In Progress (Field work started)
    const step3 = await request(app)
      .patch(`/api/reports/${report.clientId}/status`)
      .set('Authorization', `Bearer ${workerToken}`)
      .send({ status: 'In Progress', note: 'Crew mobilized with tools', syncVersion: 3 });
    expect(step3.status).toBe(200);
    expect(step3.body.status).toBe('In Progress');
    expect(step3.body.syncVersion).toBe(4);

    // 4. In Progress -> Resolved (Remediation completed)
    const step4 = await request(app)
      .patch(`/api/reports/${report.clientId}/status`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .send({ status: 'Resolved', note: 'Verified by inspector', syncVersion: 4 });
    expect(step4.status).toBe(200);
    expect(step4.body.status).toBe('Resolved');
    expect(step4.body.syncVersion).toBe(5);

    // Check activity timeline recorded all transitions
    const activities = await Activity.find({ reportClientId: report.clientId }).sort({ timestamp: 1 });
    expect(activities.length).toBe(4);
    expect(activities[0].action).toBe('STATUS_CHANGED');
    expect(activities[1].action).toBe('REPORT_ASSIGNED');
    expect(activities[2].action).toBe('STATUS_CHANGED');
    expect(activities[3].action).toBe('STATUS_CHANGED');
  });

  it('allows rejection from Submitted or Assigned by Coordinator', async () => {
    await setupTokens();

    const report1 = await seedReportWithStatus('Submitted', 1);
    const rej1 = await request(app)
      .patch(`/api/reports/${report1.clientId}/status`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .send({ status: 'Rejected', note: 'Duplicate duplicate entry', syncVersion: 1 });
    expect(rej1.status).toBe(200);
    expect(rej1.body.status).toBe('Rejected');

    const report2 = await seedReportWithStatus('Assigned', 1);
    const rej2 = await request(app)
      .patch(`/api/reports/${report2.clientId}/status`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .send({ status: 'Rejected', note: 'Outside municipal zone', syncVersion: 1 });
    expect(rej2.status).toBe(200);
    expect(rej2.body.status).toBe('Rejected');
  });

  it('rejects forbidden transitions with HTTP 422 INVALID_TRANSITION', async () => {
    await setupTokens();

    // Direct transition: Draft -> Resolved
    const draftReport = await seedReportWithStatus('Draft', 1);
    const res1 = await request(app)
      .patch(`/api/reports/${draftReport.clientId}/status`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .send({ status: 'Resolved', syncVersion: 1 });
    expect(res1.status).toBe(422);
    expect(res1.body.error.code).toBe('INVALID_TRANSITION');
    expect(res1.body.error.details.currentStatus).toBe('Draft');

    // Direct transition: Submitted -> Resolved
    const submittedReport = await seedReportWithStatus('Submitted', 1);
    const res2 = await request(app)
      .patch(`/api/reports/${submittedReport.clientId}/status`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .send({ status: 'Resolved', syncVersion: 1 });
    expect(res2.status).toBe(422);
    expect(res2.body.error.code).toBe('INVALID_TRANSITION');

    // Terminal state locks: Resolved cannot transition anywhere
    const resolvedReport = await seedReportWithStatus('Resolved', 1);
    const res3 = await request(app)
      .patch(`/api/reports/${resolvedReport.clientId}/status`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .send({ status: 'In Progress', syncVersion: 1 });
    expect(res3.status).toBe(422);
    expect(res3.body.error.code).toBe('INVALID_TRANSITION');
  });

  it('restricts assignment endpoint strictly to COORDINATOR role', async () => {
    await setupTokens();

    const report = await seedReportWithStatus('Submitted', 1);

    // Field Worker attempting assignment -> 403 Forbidden
    const unauthAssign = await request(app)
      .patch(`/api/reports/${report.clientId}/assign`)
      .set('Authorization', `Bearer ${workerToken}`)
      .send({ assignee: 'Response Team B', syncVersion: 1 });
    expect(unauthAssign.status).toBe(403);
    expect(unauthAssign.body.error.code).toBe('FORBIDDEN');

    // Coordinator attempting assignment -> 200 OK
    const authAssign = await request(app)
      .patch(`/api/reports/${report.clientId}/assign`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .send({ assignee: 'Response Team B', syncVersion: 1 });
    expect(authAssign.status).toBe(200);
    expect(authAssign.body.assignee).toBe('Response Team B');
  });

  it('restricts rejection strictly to COORDINATOR role', async () => {
    await setupTokens();

    const report = await seedReportWithStatus('Submitted', 1);

    // Field worker trying to reject report -> 403 Forbidden
    const workerReject = await request(app)
      .patch(`/api/reports/${report.clientId}/status`)
      .set('Authorization', `Bearer ${workerToken}`)
      .send({ status: 'Rejected', syncVersion: 1 });
    expect(workerReject.status).toBe(403);
    expect(workerReject.body.error.code).toBe('UNAUTHORIZED_ROLE');
  });
});

