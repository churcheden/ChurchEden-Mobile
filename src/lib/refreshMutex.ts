// src/lib/refreshMutex.ts

let refreshPromise: Promise<void> | null = null;

export function withRefreshMutex(fn: () => Promise<void>): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = fn().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}
