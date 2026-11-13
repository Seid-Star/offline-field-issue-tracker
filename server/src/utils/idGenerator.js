import crypto from 'crypto';

export function generateUUID() {
  return crypto.randomUUID();
}

/**
 * Generates a human-friendly serverId matching frontend expectations (e.g. SRV-2026-D401).
 * If clientId is provided, derives a deterministic 4-character suffix from the clientId.
 */
export function generateServerId(clientId = null) {
  const year = new Date().getFullYear();
  if (clientId && typeof clientId === 'string' && clientId.length >= 4) {
    const clean = clientId.replace(/[^a-zA-Z0-9]/g, '');
    const suffix = clean.slice(-4).toUpperCase();
    return `SRV-${year}-${suffix}`;
  }
  const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `SRV-${year}-${randomSuffix}`;
}

export function generateEventId() {
  return `act-${crypto.randomUUID()}`;
}

