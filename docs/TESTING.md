# Backend Automated Testing Strategy & Execution Report

## 1. Test Harness Architecture

The backend test suite is constructed using modern, native ES Modules tools:
- **Test Runner & Assertion Framework**: Vitest v3 (`server/vitest.config.js`)
- **API Integration Testing**: Supertest v7
- **Database Simulation**: `mongodb-memory-server` v10 (utilizing `MongoMemoryReplSet` for real transaction & replica set testing in-memory)

```text
Vitest Runner ──► Supertest Client ──► Express Application (createApp)
                                                │
                                                ▼
                                         Mongoose Models
                                                │
                                                ▼
                                    MongoMemoryReplSet (WiredTiger)
                                    [Isolated In-Memory Replica Set]
```

---

## 2. Test Suites & Coverage Breakdown

### 2.1 Health & Reachability Suite (`server/src/tests/health.test.js`)
- `GET /api/health` returns HTTP `200 OK` when the database is connected.
- `GET /health` alias also returns HTTP `200 OK`.
- `GET /api/health` returns HTTP `503 Service Unavailable` when the database connection is interrupted.

### 2.2 Authentication & Authorization Suite (`server/src/tests/auth.test.js`)
- **Registration**: Successfully provisions a `FIELD_WORKER` account and generates a valid JWT.
- **Duplicate Prevention**: Rejects duplicate registration attempts with identical or case-insensitive emails with HTTP `409 Conflict`.
- **Password Protection**: Verifies in database that bcrypt hash signatures (`$2b$12$...`) are stored and plaintext passwords are never saved.
- **Login**: Authenticates valid credentials and issues JWT; rejects invalid passwords with HTTP `401 Unauthorized`.
- **Role Guard**: Rejects attempts to publicly claim the `COORDINATOR` role during registration with HTTP `400 Bad Request`.
- **Token Verification**: Protects `GET /api/auth/me`, rejecting requests without tokens or with corrupted tokens, and returning the user profile for valid tokens.

### 2.3 Reports CRUD & Locking Suite (`server/src/tests/reports.test.js`)
- **Creation**: Inserts reports into MongoDB, assigns deterministic `serverId` (`SRV-YYYY-XXXX`), and records an initial `REPORT_CREATED` activity.
- **Querying & Pagination**: Tests category filtering, full-text search across titles/descriptions/locations, and pagination metadata.
- **Dual Identifier Lookup**: Validates retrieval by both client UUID (`clientId`) and server ID (`serverId`).
- **Optimistic Locking**: Accepts updates matching current `syncVersion` and increments version; rejects stale updates with HTTP `409 Conflict` (`VERSION_CONFLICT`).
- **Validation Rules**: Validates title length, description length, coordinate boundaries, and infrastructure categories.
- **Dashboard Metrics**: Computes exact counts for total, submitted, assigned, resolved, critical, and unassigned reports from actual database records.
- **Audit History**: Validates chronological event retrieval via `GET /api/reports/:id/activities`.

### 2.4 Workflow Engine & Permissions Suite (`server/src/tests/workflow.test.js`)
- **Full Lifecycle**: Verifies the valid workflow progression: `Draft` $\rightarrow$ `Submitted` $\rightarrow$ `Assigned` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`.
- **Rejection Branches**: Verifies allowed rejection outcomes from `Submitted` or `Assigned` by Coordinators.
- **Forbidden Transitions**: Verifies rejection with HTTP `422 Unprocessable Entity` (`INVALID_TRANSITION`) for illegal transitions (`Draft` $\rightarrow$ `Resolved`, `Submitted` $\rightarrow$ `Resolved`, and terminal locks).
- **Role Enforcement**: Rejects assignment attempts by non-coordinators with HTTP `403 Forbidden` (`FORBIDDEN`); allows assignment by authenticated coordinators.
- **Rejection Permissions**: Rejects rejection attempts by non-coordinators with HTTP `403 Forbidden` (`UNAUTHORIZED_ROLE`).

### 2.5 Offline Synchronization Suite (`server/src/tests/sync.test.js`)
- **First-Time Batch Sync**: Synchronizes offline reports, commits them to MongoDB, and returns acknowledgments with server IDs.
- **Idempotent Retry**: Replaying the exact same batch (simulating network dropped right before receiving response) returns existing server IDs with HTTP `200 OK` and creates **zero duplicate reports** and **zero duplicate activities**.
- **Partial Batch Success**: When one item has validation flaws while other items are valid, the valid items commit successfully to MongoDB while the invalid item reports individual failure.
- **Draft Rejection**: Rejects any batch containing unsubmitted Draft reports with HTTP `400 Bad Request`.
- **Stale Version Conflict**: Detects when a client submits an update based on a stale version and flags `VERSION_CONFLICT` without overwriting newer server data.
- **Concurrent Submissions**: Handles simultaneous identical sync submissions without database corruption or duplicate records.

---

## 3. Test Execution Command

Run the complete test suite:
```bash
cd server
npm test
```

Watch mode for development:
```bash
cd server
npm run test:watch
```

