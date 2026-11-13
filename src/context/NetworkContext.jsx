import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  getBrowserOnlineStatus,
  getSimulatedFailSync,
  getSimulatedOffline,
  probeServerReachability,
  setSimulatedFailSync,
  setSimulatedOffline,
} from '../services/networkService.js';

const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  const [isBrowserOnline, setIsBrowserOnline] = useState(getBrowserOnlineStatus);
  const [simulatedOffline, setSimOfflineState] = useState(getSimulatedOffline);
  const [simulatedFailSync, setSimFailSyncState] = useState(getSimulatedFailSync);
  const [isServerReachable, setIsServerReachable] = useState(
    () => getBrowserOnlineStatus() && !getSimulatedOffline()
  );
  const [reachabilityReason, setReachabilityReason] = useState(
    () =>
      getBrowserOnlineStatus() && !getSimulatedOffline()
        ? 'Simulated API adapter reachable'
        : 'Offline mode active'
  );
  const [lastCheckedAt, setLastCheckedAt] = useState(() => new Date().toISOString());
  const [isChecking, setIsChecking] = useState(false);

  const checkConnectivity = useCallback(
    async (overrideSimulatedOffline = simulatedOffline) => {
      setIsChecking(true);
      try {
        const res = await probeServerReachability({
          simulatedOffline: overrideSimulatedOffline,
        });
        setIsBrowserOnline(res.browserOnline);
        setIsServerReachable(res.serverReachable);
        setReachabilityReason(res.reason);
        setLastCheckedAt(res.checkedAt);
        return res;
      } finally {
        setIsChecking(false);
      }
    },
    [simulatedOffline]
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      checkConnectivity(simulatedOffline);
    };
    const handleOffline = () => {
      setIsBrowserOnline(false);
      setIsServerReachable(false);
      setReachabilityReason('Browser reports offline');
      setLastCheckedAt(new Date().toISOString());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    checkConnectivity(simulatedOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnectivity, simulatedOffline]);

  const toggleSimulatedOffline = useCallback(
    async (nextValue) => {
      const target = typeof nextValue === 'boolean' ? nextValue : !simulatedOffline;
      setSimOfflineState(target);
      setSimulatedOffline(target);
      await checkConnectivity(target);
      return target;
    },
    [simulatedOffline, checkConnectivity]
  );

  const toggleSimulatedFailSync = useCallback(
    (nextValue) => {
      const target = typeof nextValue === 'boolean' ? nextValue : !simulatedFailSync;
      setSimFailSyncState(target);
      setSimulatedFailSync(target);
      return target;
    },
    [simulatedFailSync]
  );

  const effectiveOnline = isBrowserOnline && isServerReachable && !simulatedOffline;

  return (
    <NetworkContext.Provider
      value={{
        isBrowserOnline,
        isServerReachable,
        effectiveOnline,
        simulatedOffline,
        simulatedFailSync,
        reachabilityReason,
        lastCheckedAt,
        isChecking,
        checkConnectivity,
        toggleSimulatedOffline,
        toggleSimulatedFailSync,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error('useNetwork must be used inside a NetworkProvider');
  }
  return ctx;
}
