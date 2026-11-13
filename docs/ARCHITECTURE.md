# Offline Field Issue Tracker — Backend Architecture

## 1. System Overview

The **Offline Field Issue Tracker** is a mission-critical field operations platform designed for municipal engineers, technicians, and operations coordinators managing infrastructure triage in zones with intermittent or non-existent cellular coverage.

The architecture strictly decouples the client Progressive Web App (PWA) from the server. The client utilizes local IndexedDB (via Dexie.js) as the optimistic source of truth, queuing operations locally. The backend provides an idempotent, concurrency-safe REST and batch synchronization API built with Node.js, Express.js, and MongoDB/Mongoose.

```text
┌─────────────────────────────────────────────────────────────────┐
│                       Client PWA (Port 3000)                    │
│                                                                 │
│   React 19 Components  ◄───►  reportService / AppContext       │
│                                           │                     │
│                                           ▼                     │
│                               Dexie.js (IndexedDB)              │
│                               [reports, syncQueue, activities]  │
│                                           │                     │
│                                           ▼ (when online)       │
│                               src/services/api.js (HTTP Client) │
└───────────────────────────────────────────┬─────────────────────┘
                                            │
                                 JSON / HTTPS / Bearer JWT
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express.js Backend (Port 4000)               │
│                                                                 │
│  Middleware:                                                    │
│  ├── CORS (Restricted to frontend origins)                      │
│  ├── Express JSON Parser (2MB limit)                           │
│  ├── express-rate-limit (Auth & Sync rate protection)           │
│  ├── authMiddleware (JWT Verification)                          │
│  ├── roleMiddleware (FIELD_WORKER vs COORDINATOR)               │
│  └── validateMiddleware (Zod Schema Validation)                 │
│                                                                 │
│  Controllers & Services:                                        │
│  ├── authController      <-> authService                        │
│  ├── reportController    <-> reportService                      │
│  ├── workflowController  <-> workflowEngine                     │
│  ├── syncController      <-> syncService                        │
│  └── dashboardController <-> activityService                    │
│                                                                 │
│  Data Layer:                                                    │
│  └── Mongoose Models (User, Report, Activity)                   │
│                                                                 │
│  Storage:                                                       │
│  └── MongoDB (Replica Set with Document Transactions)           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Pillars

### 2.1 Client-First Idempotency
- Every report is stamped with a crypto-random UUID v4 (`clientId`) on the client when first created offline.
- The backend enforces a unique index on `clientId`.
- Network dropouts during transmission or retry storms never create duplicate database records.

### 2.2 Optimistic Concurrency Control (`syncVersion`)
- Every report document maintains a monotonically increasing integer `syncVersion` (initial value: 1).
- Any mutating operation (`PATCH /api/reports/:id`, `PATCH /status`, `PATCH /assign`, or sync update) must supply the expected `syncVersion`.
- If the document in MongoDB has advanced to a higher version, the server rejects the write with `409 Conflict` (`VERSION_CONFLICT`), preventing silent overwrites.

### 2.3 Strict Server-Side State Machine
- Workflow transitions (`Draft` -> `Submitted` -> `Assigned` -> `In Progress` -> `Resolved` / `Rejected`) are enforced by `server/src/utils/workflowEngine.js`.
- Illegal jumps (e.g. `Draft` -> `Resolved`) are rejected with `422 Unprocessable Entity` and error code `INVALID_TRANSITION`.
- Coordinator-restricted transitions (Assignment, Rejection) reject unprivileged calls with `403 Forbidden`.

### 2.4 Immutable Audit Logging
- Every report creation, detail modification, assignment, and status transition automatically creates an `Activity` record.
- Creation activities use deterministic event IDs (`act-${clientId}`) to prevent duplicate logs on submission retries.

---

## 3. Database Schema Design

### 3.1 User Model (`users`)
- `name`: String (2–100 chars)
- `email`: String (Unique, Lowercase, Indexed)
- `passwordHash`: String (Bcrypt cost factor 12, stripped from JSON output)
- `role`: Enum `['FIELD_WORKER', 'COORDINATOR']` (Default: `FIELD_WORKER`)
- `unit`: String (Field team / unit name)
- `timestamps`: `createdAt`, `updatedAt`

### 3.2 Report Model (`reports`)
- `clientId`: String (UUID v4, Unique Index)
- `serverId`: String (`SRV-YYYY-XXXX`, Unique Sparse Index)
- `title`: String (3–200 chars)
- `category`: Enum (7 categories: Water, Electrical, Road, Facilities, Safety, Maintenance, Other)
- `description`: String (Min 10 chars)
- `location`: `{ name: String, latitude: Number (-90 to 90), longitude: Number (-180 to 180) }`
- `priority`: Enum `['Low', 'Medium', 'High', 'Critical']`
- `status`: Enum `['Draft', 'Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected']`
- `syncVersion`: Number (Min 1, Default 1)
- `createdBy`: ObjectId (Ref `User`, optional)
- `reportedBy`: String (Default: 'Field Worker')
- `assignedTo`: ObjectId (Ref `User`, optional)
- `assignee`: String (Crew or specialist name, default null)
- `reportedAt`: Date (When worker observed defect)
- `timestamps`: `createdAt`, `updatedAt`

### 3.3 Activity Model (`activities`)
- `eventId`: String (Unique Index, client or server-derived UUID)
- `reportClientId`: String (Index)
- `reportId`: ObjectId (Ref `Report`, optional)
- `action`: String (`REPORT_CREATED`, `STATUS_CHANGED`, `REPORT_ASSIGNED`, `SYNC_SUCCESS`, `REPORT_UPDATED`)
- `previousValue`: Mixed
- `newValue`: Mixed
- `description`: String (Human readable summary)
- `performedBy`: String (Actor name or system)
- `timestamp`: Date (Indexed)
- `metadata`: Mixed

