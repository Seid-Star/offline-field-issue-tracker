import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { clearTestDB, setupTestDB, teardownTestDB } from './testHelper.js';
import { disconnectDB, connectDB } from '../config/db.js';

describe('Health & Reachability API', () => {
  let app;

  beforeAll(async () => {
    await setupTestDB();
    app = createApp();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it('GET /api/health returns 200 OK when database is connected', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('Offline Field Issue Tracker API');
    expect(res.body.database.status).toBe('connected');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /health alias also returns 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/health returns 503 when database is disconnected', async () => {
    await disconnectDB();

    const res = await request(app).get('/api/health');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('degraded');
    expect(res.body.database.status).toBe('disconnected');

    // Reconnect for remaining tests
    await setupTestDB();
  });
});

