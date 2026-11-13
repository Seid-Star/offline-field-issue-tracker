import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { Activity } from '../models/Activity.js';
import { Report } from '../models/Report.js';
import { clearTestDB, setupTestDB, teardownTestDB } from './testHelper.js';

describe('Reports API', () => {
  let app;
  let authToken;

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

  const getRegisteredToken = async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Worker One',
        email: 'worker1@fieldops.org',
        password: 'Password123!',
      });
    return res.body.token;
  };

  it('POST /api/reports creates report, issues serverId, and creates creation activity', async () => {
    authToken = await getRegisteredToken();

    const reportPayload = {
      clientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d401',
      title: 'Damaged water pipe junction',
      category: 'Water Infrastructure',
      description: 'Pressurized clean water leaking across access road near school gate.',
      location: {
        name: 'Sector 4 Junction',
        latitude: -1.3127,
        longitude: 36.7885,
      },
      priority: 'Critical',
      status: 'Submitted',
      syncVersion: 1,
    };

    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${authToken}`)
      .send(reportPayload);

    expect(res.status).toBe(201);
    expect(res.body.clientId).toBe(reportPayload.clientId);
    expect(res.body.serverId).toBeDefined();
    expect(res.body.serverId.startsWith('SRV-')).toBe(true);
    expect(res.body.syncVersion).toBe(1);

    // Verify activity record was created
    const activities = await Activity.find({ reportClientId: reportPayload.clientId });
    expect(activities.length).toBe(1);
    expect(activities[0].action).toBe('REPORT_CREATED');
    expect(activities[0].eventId).toBe(`act-${reportPayload.clientId}`);
  });

  it('GET /api/reports retrieves paginated and filtered results', async () => {
    authToken = await getRegisteredToken();

    // Seed 3 reports
    await request(app)
      .post('/api/reports')
      .send({
        clientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d401',
        title: 'Water valve leak',
        category: 'Water Infrastructure',
        description: 'Borehole station 4 pressurized leak.',
        location: { name: 'Kibera Pump 4' },
        priority: 'Critical',
        status: 'Submitted',
      });

    await request(app)
      .post('/api/reports')
      .send({
        clientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d402',
        title: 'Transformer arcing',
        category: 'Electrical Equipment',
        description: 'Feeder line B corona discharge audible.',
        location: { name: 'Substation Pole 12' },
        priority: 'Critical',
        status: 'Assigned',
      });

    await request(app)
      .post('/api/reports')
      .send({
        clientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d403',
        title: 'Road culvert washout',
        category: 'Road Infrastructure',
        description: 'Culvert shoulder undermined by stormwater.',
        location: { name: 'Wadi East KM 7' },
        priority: 'High',
        status: 'In Progress',
      });

    // Test list all
    const allRes = await request(app).get('/api/reports');
    expect(allRes.status).toBe(200);
    expect(allRes.body.total).toBe(3);
    expect(allRes.body.items.length).toBe(3);

    // Test filter by category
    const catRes = await request(app).get('/api/reports?category=Water%20Infrastructure');
    expect(catRes.status).toBe(200);
    expect(catRes.body.total).toBe(1);
    expect(catRes.body.items[0].title).toBe('Water valve leak');

    // Test search filter
    const searchRes = await request(app).get('/api/reports?search=culvert');
    expect(searchRes.status).toBe(200);
    expect(searchRes.body.total).toBe(1);
    expect(searchRes.body.items[0].title).toBe('Road culvert washout');
  });

  it('GET /api/reports/:id retrieves report by clientId or serverId', async () => {
    const createRes = await request(app)
      .post('/api/reports')
      .send({
        clientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d401',
        title: 'Water valve leak',
        category: 'Water Infrastructure',
        description: 'Borehole station 4 pressurized leak.',
        location: { name: 'Kibera Pump 4' },
        priority: 'Critical',
        status: 'Submitted',
      });

    const clientId = createRes.body.clientId;
    const serverId = createRes.body.serverId;

    // Fetch by clientId
    const byClient = await request(app).get(`/api/reports/${clientId}`);
    expect(byClient.status).toBe(200);
    expect(byClient.body.title).toBe('Water valve leak');

    // Fetch by serverId
    const byServer = await request(app).get(`/api/reports/${serverId}`);
    expect(byServer.status).toBe(200);
    expect(byServer.body.clientId).toBe(clientId);

    // 404 for unknown
    const notFound = await request(app).get('/api/reports/non-existent-uuid');
    expect(notFound.status).toBe(404);
    expect(notFound.body.error.code).toBe('NOT_FOUND');
  });

  it('PATCH /api/reports/:id enforces optimistic locking via syncVersion', async () => {
    authToken = await getRegisteredToken();

    const createRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        clientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d401',
        title: 'Initial Title',
        category: 'Water Infrastructure',
        description: 'Original description of the issue.',
        location: { name: 'Site A' },
        priority: 'Medium',
        status: 'Submitted',
        syncVersion: 1,
      });

    // Valid update with current syncVersion = 1
    const validUpdate = await request(app)
      .patch(`/api/reports/${createRes.body.clientId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Title',
        syncVersion: 1,
      });

    expect(validUpdate.status).toBe(200);
    expect(validUpdate.body.title).toBe('Updated Title');
    expect(validUpdate.body.syncVersion).toBe(2);

    // Stale update trying to use old syncVersion = 1 again
    const staleUpdate = await request(app)
      .patch(`/api/reports/${createRes.body.clientId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Stale Overwrite Attempt',
        syncVersion: 1, // Stale! Current is 2
      });

    expect(staleUpdate.status).toBe(409);
    expect(staleUpdate.body.error.code).toBe('VERSION_CONFLICT');
  });

  it('prevents a field worker from updating another worker\'s report', async () => {
    // Worker 1 registers and creates a report
    const worker1Token = await getRegisteredToken();
    const createRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${worker1Token}`)
      .send({
        clientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d498',
        title: 'Worker 1 Pipeline Defect',
        category: 'Water Infrastructure',
        description: 'Created by worker 1 description.',
        location: { name: 'Site W1' },
        priority: 'Medium',
        status: 'Submitted',
        syncVersion: 1,
      });

    // Worker 2 registers
    const worker2Res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Worker Two',
        email: 'worker2@fieldops.org',
        password: 'Password123!',
      });
    const worker2Token = worker2Res.body.token;

    // Worker 2 attempts to patch Worker 1's report -> 403 Forbidden
    const unauthPatch = await request(app)
      .patch(`/api/reports/${createRes.body.clientId}`)
      .set('Authorization', `Bearer ${worker2Token}`)
      .send({
        title: 'Hijacked by Worker 2',
        syncVersion: 1,
      });

    expect(unauthPatch.status).toBe(403);
    expect(unauthPatch.body.error.code).toBe('FORBIDDEN');
  });

  it('rejects invalid report validation fields', async () => {
    const res = await request(app)
      .post('/api/reports')
      .send({
        clientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d401',
        title: 'Ab', // Too short (< 3)
        category: 'NonExistentCategory',
        description: 'Short', // Too short (< 10)
        location: { name: 'A', latitude: 120 }, // Invalid latitude (> 90)
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details.title).toBeDefined();
    expect(res.body.error.details.category).toBeDefined();
    expect(res.body.error.details.description).toBeDefined();
    expect(res.body.error.details['location.latitude']).toBeDefined();
  });

  it('GET /api/dashboard/stats calculates accurate metrics from database records', async () => {
    // Seed reports with varying statuses and priorities
    await Report.create([
      {
        clientId: 'db-stat-1',
        title: 'Report 1',
        category: 'Water Infrastructure',
        description: 'Borehole station defect description.',
        location: { name: 'Loc A' },
        priority: 'Critical',
        status: 'Submitted',
        syncVersion: 1,
      },
      {
        clientId: 'db-stat-2',
        title: 'Report 2',
        category: 'Electrical Equipment',
        description: 'Transformer insulator problem description.',
        location: { name: 'Loc B' },
        priority: 'High',
        status: 'Assigned',
        assignee: 'Crew A',
        syncVersion: 1,
      },
      {
        clientId: 'db-stat-3',
        title: 'Report 3',
        category: 'Road Infrastructure',
        description: 'Culvert roadway collapse description.',
        location: { name: 'Loc C' },
        priority: 'Low',
        status: 'Resolved',
        syncVersion: 1,
      },
    ]);

    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(3);
    expect(res.body.submitted).toBe(1);
    expect(res.body.assigned).toBe(1);
    expect(res.body.resolved).toBe(1);
    expect(res.body.critical).toBe(1);
    expect(res.body.high).toBe(1);
    expect(res.body.unassigned).toBe(1); // db-stat-1 is Submitted with no assignee
    expect(res.body.activeOperations).toBe(2);
  });

  it('GET /api/reports/:id/activities returns chronological audit events', async () => {
    const createRes = await request(app)
      .post('/api/reports')
      .send({
        clientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d499',
        title: 'Activity Test Report',
        category: 'Water Infrastructure',
        description: 'Test report description for activity history.',
        location: { name: 'Test Site' },
        priority: 'Medium',
        status: 'Submitted',
      });

    const res = await request(app).get(`/api/reports/${createRes.body.clientId}/activities`);
    expect(res.status).toBe(200);
    expect(res.body.items).toBeDefined();
    expect(res.body.items.length).toBeGreaterThanOrEqual(1);
    expect(res.body.items[0].action).toBe('REPORT_CREATED');
  });
});
