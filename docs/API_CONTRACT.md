# API Contract — Offline Field Issue Tracker

This contract defines the REST and batch synchronization interface for the Express.js + MongoDB backend powering the Offline Field Issue Tracker.

- **Base URL**: Configured via `VITE_API_URL` (default: `http://localhost:4000/api`)
- **Content-Type**: `application/json`
- **Authentication**: `Authorization: Bearer <jwt_token>` for protected endpoints
- **Idempotency Key**: Every report carries a client-generated UUID v4 (`clientId`). The backend enforces a unique index on `clientId` to guarantee idempotent retries.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Public registration. Automatically assigns role `FIELD_WORKER`. Attempts to publicly register as `COORDINATOR` are rejected.

- **Request Payload**:
```json
{
  "name": "Amira Hassan",
  "email": "amira.hassan@fieldops.org",
  "password": "SecurePassword123!",
  "unit": "Sector North Infrastructure Team"
}
```
- **Response `201 Created`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6733a8c1f4e1c20012345678",
    "name": "Amira Hassan",
    "email": "amira.hassan@fieldops.org",
    "role": "FIELD_WORKER",
    "unit": "Sector North Infrastructure Team",
    "createdAt": "2026-11-12T10:00:00.000Z",
    "updatedAt": "2026-11-12T10:00:00.000Z"
  }
}
```
- **Response `409 Conflict`**: Email already registered.

---

### `POST /api/auth/login`
Authenticates a user with email and password.

- **Request Payload**:
```json
{
  "email": "amira.hassan@fieldops.org",
  "password": "SecurePassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6733a8c1f4e1c20012345678",
    "name": "Amira Hassan",
    "email": "amira.hassan@fieldops.org",
    "role": "FIELD_WORKER",
    "unit": "Sector North Infrastructure Team"
  }
}
```
- **Response `401 Unauthorized`**: `{ "error": { "code": "INVALID_CREDENTIALS", "message": "Invalid email or password." } }`

---

### `GET /api/auth/me`
Fetches the currently authenticated user's profile.

- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: `{ "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }`
- **Response `401 Unauthorized`**: Token missing, expired, or invalid.

---

## 2. Health & Reachability

### `GET /api/health` (alias: `GET /health`)
Lightweight connectivity and database probe for `networkService.js`.

- **Response `200 OK`** (Healthy):
```json
{
  "status": "ok",
  "service": "Offline Field Issue Tracker API",
  "timestamp": "2026-11-12T20:30:00.000Z",
  "database": {
    "status": "connected",
    "state": "connected",
    "host": "127.0.0.1",
    "name": "offline_field_tracker"
  }
}
```
- **Response `503 Service Unavailable`** (Degraded / DB Disconnected):
```json
{
  "status": "degraded",
  "service": "Offline Field Issue Tracker API",
  "timestamp": "2026-11-12T20:30:00.000Z",
  "database": {
    "status": "disconnected",
    "state": "disconnected"
  }
}
```

---

## 3. Reports Endpoints

### `GET /api/reports`
Lists reports with optional filtering, search, and pagination.

- **Query Parameters**:
  - `category`: String (optional)
  - `priority`: `Low | Medium | High | Critical` (optional)
  - `status`: `Draft | Submitted | Assigned | In Progress | Resolved | Rejected` (optional)
  - `search`: String (searches title, description, category, location, clientId, serverId)
  - `page`: Integer (default: 1)
  - `limit`: Integer (default: 20, max: 100)
  - `since`: ISO Date string (delta query)
- **Response `200 OK`**:
```json
{
  "items": [
    {
      "id": "6733a8c1f4e1c20012345678",
      "clientId": "f47ac10b-58cc-4372-a567-0e02b2c3d401",
      "serverId": "SRV-2026-D401",
      "title": "Main borehole valve casing fracture",
      "category": "Water Infrastructure",
      "description": "Pressurized leak detected at Borehole Station 4 distribution manifold.",
      "location": {
        "name": "Kibera Sector 4 Pump House",
        "latitude": -1.3127,
        "longitude": 36.7885
      },
      "priority": "Critical",
      "status": "Submitted",
      "assignee": null,
      "reportedBy": "Amira Hassan",
      "reportedAt": "2026-11-12T10:15:00.000Z",
      "syncVersion": 1,
      "createdAt": "2026-11-12T10:15:00.000Z",
      "updatedAt": "2026-11-12T10:15:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

---

### `POST /api/reports`
Creates a single report idempotently.

- **Request Payload**:
```json
{
  "clientId": "f47ac10b-58cc-4372-a567-0e02b2c3d401",
  "title": "Main borehole valve casing fracture",
  "category": "Water Infrastructure",
  "description": "Pressurized leak detected at Borehole Station 4.",
  "location": {
    "name": "Kibera Sector 4 Pump House",
    "latitude": -1.3127,
    "longitude": 36.7885
  },
  "priority": "Critical",
  "status": "Submitted",
  "reportedBy": "Amira Hassan",
  "reportedAt": "2026-11-12T10:15:00.000Z",
  "syncVersion": 1
}
```
- **Response `201 Created`**: New report saved.
- **Response `200 OK`**: Idempotent duplicate retry accepted.

---

### `GET /api/reports/:id`
Retrieves a report by `clientId` OR `serverId` OR MongoDB `_id`.

- **Response `200 OK`**: Report object.
- **Response `404 Not Found`**: `{ "error": { "code": "NOT_FOUND", "message": "Report not found" } }`

---

### `PATCH /api/reports/:id`
Updates editable fields with optimistic concurrency verification.

- **Request Payload**:
```json
{
  "title": "Updated Borehole Station 4 Valve Assembly",
  "description": "Emergency isolation clamp applied; replacement valve casing needed.",
  "syncVersion": 1
}
```
- **Response `200 OK`**: Updated Report (with `syncVersion: 2`).
- **Response `409 Conflict`**: Stale `syncVersion` provided (`VERSION_CONFLICT`).

---

### `PATCH /api/reports/:id/status`
Transitions report status. Strictly validates workflow rules.

- **Request Payload**:
```json
{
  "status": "In Progress",
  "note": "Crew dispatched with replacement valve spool.",
  "actor": "Amira Hassan",
  "syncVersion": 2
}
```
- **Response `200 OK`**: Updated Report with new status and incremented `syncVersion`.
- **Response `422 Unprocessable Entity`**:
```json
{
  "error": {
    "code": "INVALID_TRANSITION",
    "message": "Workflow cannot transition directly from \"Draft\" to \"Resolved\". Allowed transitions: Submitted.",
    "details": {
      "currentStatus": "Draft",
      "requestedStatus": "Resolved",
      "allowedTransitions": ["Submitted"]
    }
  }
}
```

---

### `PATCH /api/reports/:id/assign`
Assigns a responsible crew. Restricted strictly to `COORDINATOR` role. Automatically advances `Submitted` $\rightarrow$ `Assigned`.

- **Headers**: `Authorization: Bearer <coordinator_token>`
- **Request Payload**:
```json
{
  "assignee": "Hydraulics Response Unit A",
  "actor": "Elena Vance",
  "syncVersion": 2
}
```
- **Response `200 OK`**: Updated Report.
- **Response `403 Forbidden`**: Non-coordinator attempted assignment.

---

### `GET /api/reports/:id/activities`
Chronological audit history of actions on a report.

- **Response `200 OK`**:
```json
{
  "items": [
    {
      "id": "act-101",
      "eventId": "act-f47ac10b-58cc-4372-a567-0e02b2c3d401",
      "reportClientId": "f47ac10b-58cc-4372-a567-0e02b2c3d401",
      "action": "REPORT_CREATED",
      "previousValue": null,
      "newValue": "Submitted",
      "description": "Report created (Critical priority, status: Submitted).",
      "performedBy": "Amira Hassan",
      "timestamp": "2026-11-12T10:15:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 4. Batch Synchronization Endpoint

### `POST /api/reports/sync` (alias: `POST /api/sync`)
Batch synchronization endpoint processing up to 50 queued operations with per-item partial success.

- **Request Payload**:
```json
{
  "items": [
    {
      "queueId": "sq-101",
      "operation": "CREATE_REPORT",
      "payloadVersion": 1,
      "report": {
        "clientId": "f47ac10b-58cc-4372-a567-0e02b2c3d401",
        "title": "Main borehole valve casing fracture",
        "category": "Water Infrastructure",
        "description": "Pressurized leak detected at Borehole Station 4 manifold.",
        "location": { "name": "Kibera Sector 4", "latitude": -1.3127, "longitude": 36.7885 },
        "priority": "Critical",
        "status": "Submitted",
        "reportedBy": "Amira Hassan",
        "reportedAt": "2026-11-12T10:15:00.000Z",
        "syncVersion": 1
      }
    }
  ]
}
```
- **Response `200 OK`**:
```json
{
  "syncedAt": "2026-11-12T20:30:00.000Z",
  "processedCount": 1,
  "successCount": 1,
  "failedCount": 0,
  "results": [
    {
      "clientId": "f47ac10b-58cc-4372-a567-0e02b2c3d401",
      "serverId": "SRV-2026-D401",
      "acceptedVersion": 1,
      "status": "Synchronized",
      "syncedAt": "2026-11-12T20:30:00.000Z"
    }
  ]
}
```

---

## 5. Dashboard Aggregation Endpoint

### `GET /api/dashboard/stats`
Computes real-time statistics from MongoDB collections.

- **Response `200 OK`**:
```json
{
  "total": 42,
  "drafts": 2,
  "submitted": 14,
  "assigned": 10,
  "inProgress": 8,
  "resolved": 6,
  "rejected": 2,
  "critical": 5,
  "high": 12,
  "unassigned": 6,
  "activeOperations": 32
}
```
