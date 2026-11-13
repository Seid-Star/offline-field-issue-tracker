import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { User, USER_ROLES } from '../models/User.js';
import { clearTestDB, setupTestDB, teardownTestDB } from './testHelper.js';

describe('Authentication & Authorization API', () => {
  let app;

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

  it('POST /api/auth/register successfully registers a FIELD_WORKER', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Amira Hassan',
        email: 'amira.hassan@fieldops.org',
        password: 'SecurePassword123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.name).toBe('Amira Hassan');
    expect(res.body.user.email).toBe('amira.hassan@fieldops.org');
    expect(res.body.user.role).toBe(USER_ROLES.FIELD_WORKER);
    expect(res.body.user.passwordHash).toBeUndefined(); // Never leak passwordHash
  });

  it('POST /api/auth/register rejects duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Amira Hassan',
        email: 'amira.hassan@fieldops.org',
        password: 'Password123!',
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'AMIRA.HASSAN@FIELDOPS.ORG', // Case-insensitive duplicate
        password: 'Password456!',
      });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('verifies password hashing in database with bcrypt', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Tariq Mansour',
        email: 'tariq@fieldops.org',
        password: 'PlaintextPassword789!',
      });

    const userInDb = await User.findOne({ email: 'tariq@fieldops.org' });
    expect(userInDb).toBeDefined();
    expect(userInDb.passwordHash).not.toBe('PlaintextPassword789!');
    expect(userInDb.passwordHash.startsWith('$2')).toBe(true); // bcrypt signature
    const isMatch = await userInDb.comparePassword('PlaintextPassword789!');
    expect(isMatch).toBe(true);
  });

  it('POST /api/auth/register rejects attempt to publicly claim COORDINATOR role', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Sneaky User',
        email: 'sneaky@fieldops.org',
        password: 'Password123!',
        role: 'COORDINATOR',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details.role).toContain('Public registration cannot assign the COORDINATOR role');
  });

  it('POST /api/auth/login successfully authenticates valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Amira Hassan',
        email: 'amira@fieldops.org',
        password: 'CorrectPassword123!',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'amira@fieldops.org',
        password: 'CorrectPassword123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('amira@fieldops.org');
  });

  it('POST /api/auth/login rejects invalid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Amira Hassan',
        email: 'amira@fieldops.org',
        password: 'CorrectPassword123!',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'amira@fieldops.org',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('GET /api/auth/me protects route and returns authenticated user profile', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Elena Vance',
        email: 'elena@fieldops.org',
        password: 'ValidPassword123!',
      });

    const token = regRes.body.token;

    // Without token -> 401
    const unauthRes = await request(app).get('/api/auth/me');
    expect(unauthRes.status).toBe(401);
    expect(unauthRes.body.error.code).toBe('UNAUTHORIZED');

    // With invalid token -> 401
    const invalidRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid_token_xyz');
    expect(invalidRes.status).toBe(401);

    // With valid token -> 200 OK
    const authRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(authRes.status).toBe(200);
    expect(authRes.body.user.email).toBe('elena@fieldops.org');
    expect(authRes.body.user.passwordHash).toBeUndefined();
  });
});

