/**
 * Network & backend reachability monitor.
 * Does not rely solely on navigator.onLine: tracks browser network state AND
 * simulated backend reachability so field workers can test offline queueing
 * and failed sync recovery reliably in the frontend stage.
 */

const SIM_OFFLINE_KEY = 'fieldtrack_sim_offline';
const SIM_FAIL_SYNC_KEY = 'fieldtrack_sim_fail_sync';

export function getBrowserOnlineStatus() {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

export function getSimulatedOffline() {
  try {
    return localStorage.getItem(SIM_OFFLINE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSimulatedOffline(enabled) {
  try {
    localStorage.setItem(SIM_OFFLINE_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore storage errors
  }
}

export function getSimulatedFailSync() {
  try {
    return localStorage.getItem(SIM_FAIL_SYNC_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSimulatedFailSync(enabled) {
  try {
    localStorage.setItem(SIM_FAIL_SYNC_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore storage errors
  }
}

/**
 * Probes server reachability.
 * During this frontend stage, returns simulated reachability based on
 * browser online state + simulated offline toggle.
 * In the Antigravity backend stage, replace with a lightweight HEAD/GET /health check.
 */
export async function probeServerReachability({ simulatedOffline = false } = {}) {
  const browserOnline = getBrowserOnlineStatus();
  if (!browserOnline || simulatedOffline) {
    return {
      browserOnline,
      serverReachable: false,
      reason: !browserOnline ? 'Browser reports offline' : 'Offline simulation active',
      checkedAt: new Date().toISOString(),
    };
  }

  // Simulate quick reachability ping to simulated API adapter
  await new Promise((resolve) => setTimeout(resolve, 120));
  return {
    browserOnline: true,
    serverReachable: true,
    reason: 'Simulated API adapter reachable',
    checkedAt: new Date().toISOString(),
  };
}
