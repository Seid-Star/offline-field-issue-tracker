# Offline Field Issue Tracker

An offline-first field operations Progressive Web App (PWA) for NilePixel Technologies Cohort 1. Designed for field workers operating in intermittent connectivity zones and operations coordinators managing infrastructure triage and resolution.

> **Current Stage**: Frontend-only application with full IndexedDB persistence (`Dexie.js`), strict client-side workflow transition enforcement, PWA app-shell caching (`vite-plugin-pwa`), and a clearly labeled **Simulated Synchronization Adapter** in `src/services/api.js`.

---

## Tech Stack

- **UI & Routing**: React 19, Vite, JavaScript (JSX), React Router DOM, Tailwind CSS v4, Lucide React
- **Local Persistence**: Dexie.js over browser IndexedDB (`reports`, `syncQueue`, `activities`, `meta` tables)
- **PWA**: `vite-plugin-pwa` (Workbox app-shell precaching, offline SPA navigation fallback, manifest, install prompt)

---

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
   `.env.example` includes:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```
3. Start development server on port 3000:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## Offline-First Architecture (Three Distinct Layers)

1. **Service Worker App-Shell Caching (`vite-plugin-pwa`)**: Caches compiled JS, CSS, HTML, fonts, and icons so the application launches and routes reliably offline.
2. **IndexedDB Persistence (`src/services/db.js`)**: Stores field reports (keyed by stable UUID v4 `clientId`), local `syncQueue`, and chronological `activities` across page reloads and browser restarts.
3. **Synchronization Queue & Adapter (`src/services/syncService.js` + `src/services/api.js`)**:
   - **Drafts** remain strictly local (`Draft` status) and are never queued for sync until explicitly submitted.
   - **Submitted reports** are written to IndexedDB first and queued in `syncQueue`.
   - **Simulated Sync Adapter**: Assigns deterministic `serverId` values (`SRV-2026-XXXX`) and `syncVersion` acknowledgments, and supports simulated offline mode and simulated server failures (`503`) to verify idempotent retries without data loss or duplication.

---

## Connecting to the Future Express.js + MongoDB Backend

All backend communication is isolated inside `src/services/api.js`. When the Express.js + MongoDB backend is ready in Antigravity:

1. Set `VITE_API_URL` in `.env` to your Express API base URL (e.g., `http://localhost:4000/api`).
2. Update `probeServerReachability` in `src/services/networkService.js` to call `GET ${VITE_API_URL}/health` instead of the simulated check.
3. Replace the Dexie/simulated adapter bodies in `src/services/api.js` (`getReports`, `syncReports`, etc.) with `fetch()` calls matching `docs/API_CONTRACT.md`, keeping local IndexedDB as the optimistic source of truth and `syncQueue` for deferred retries.
4. Enforce the exact workflow state machine (`Draft -> Submitted -> Assigned -> In Progress -> Resolved` / `Rejected`) on the Express backend as documented in `docs/API_CONTRACT.md`.
