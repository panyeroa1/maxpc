export interface BrowserSessionSnapshot {
  sessionId: string;
  liveViewUrl: string;
  cdpWsUrl: string;
  spinUpTime: number;
}

interface BrowserSessionRegistry {
  inFlight: boolean;
  latest: (BrowserSessionSnapshot & { createdAt: number }) | null;
}

const RECENT_SESSION_WINDOW_MS = 15000;

const registry: BrowserSessionRegistry = {
  inFlight: false,
  latest: null,
};

export function isCreateBrowserInFlight() {
  return registry.inFlight;
}

export function setCreateBrowserInFlight(inFlight: boolean) {
  registry.inFlight = inFlight;
}

export function setLatestBrowserSession(session: BrowserSessionSnapshot) {
  registry.latest = {
    ...session,
    createdAt: Date.now(),
  };
}

export function getRecentBrowserSession() {
  if (!registry.latest) return null;

  if (Date.now() - registry.latest.createdAt > RECENT_SESSION_WINDOW_MS) {
    return null;
  }

  const { createdAt: _createdAt, ...session } = registry.latest;
  return session;
}

export function getLatestBrowserSession() {
  if (!registry.latest) return null;
  const { createdAt: _createdAt, ...session } = registry.latest;
  return session;
}

export function clearLatestBrowserSession(sessionId?: string) {
  if (!registry.latest) return;
  if (!sessionId || registry.latest.sessionId === sessionId) {
    registry.latest = null;
  }
}
