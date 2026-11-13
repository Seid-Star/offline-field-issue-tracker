# Architectural Assumptions & System Boundaries

## 1. Environment & Runtime Assumptions

1. **Node.js Environment**: The backend runs on Node.js v18+ (tested on v24.x) using standard ECMAScript Modules (`"type": "module"` in `package.json`).
2. **MongoDB Database**: The production backend expects MongoDB 6.0+ or MongoDB Atlas with replica sets enabled to support multi-document transactions. For local development or standalone instances, a safe fallback is implemented.
3. **Frontend Independence**: The frontend Progressive Web App lives at the project root (`src/`, `public/`, `vite.config.ts`), and the backend lives strictly inside `server/`. The frontend is not modified or moved during backend development.

---

## 2. Authentication & Authorization Boundaries

1. **Stateless JWT**:
   - Authentication is token-based using `Authorization: Bearer <token>` headers.
   - Default token validity is 7 days (`JWT_EXPIRES_IN=7d`), chosen specifically for field workers operating in remote regions who may be disconnected from the internet for multiple consecutive days.
2. **Public Registration**:
   - The public registration endpoint (`POST /api/auth/register`) only ever provisions accounts with the `FIELD_WORKER` role.
   - Any client payload requesting `COORDINATOR` during public registration is strictly rejected by Zod validation.
3. **Coordinator Provisioning**:
   - Coordinators are provisioned administratively via the CLI seed script (`npm run seed:coordinator`) or during initial environment bootstrap via `COORDINATOR_SEED_*` environment variables.

---

## 3. Workflow & Data Integrity Rules

1. **Draft Exclusivity**:
   - Draft reports (`status: 'Draft'`) are strictly local to the device's IndexedDB. They are neither sent to nor accepted by `POST /api/reports/sync`.
   - The synchronization endpoint rejects any item with `status: 'Draft'` with a validation error.
2. **State Machine Invariants**:
   - A report can only be assigned when in `Submitted` status (or reassigned when already in `Assigned`).
   - A report cannot be assigned or rejected if it has reached terminal states (`Resolved` or `Rejected`).
   - Only a user with role `COORDINATOR` can assign or reject reports.
3. **Optimistic Locking**:
   - Versioning is strictly monotonic: each successful update increments `syncVersion` by 1.
   - Stale updates will fail with `VERSION_CONFLICT` rather than overwriting newer changes.

---

## 4. Timestamps & Clocks

1. **Report Observation vs Persistence Time**:
   - `reportedAt` represents the actual wall-clock time the field worker observed the infrastructure defect on site (even if offline for days).
   - `createdAt` and `updatedAt` represent when the record was persisted or modified on the server.
2. **Clock Skew Tolerance**:
   - The server does not reject reports simply because `reportedAt` is in the past, acknowledging that offline field work may precede synchronization by days or weeks.

