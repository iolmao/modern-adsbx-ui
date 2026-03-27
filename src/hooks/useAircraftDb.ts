import { useEffect, useState } from 'react';

export interface AircraftDbEntry {
  reg: string;
  type: string;
  desc: string;
}

// Module-level cache: hex → entry (or null if not found)
const cache = new Map<string, AircraftDbEntry | null>();
// In-flight requests to avoid duplicate fetches
const pending = new Map<string, Promise<AircraftDbEntry | null>>();

/** Sync read from cache — returns undefined if not yet fetched */
export function getCachedDbEntry(hex: string): AircraftDbEntry | null | undefined {
  return cache.has(hex) ? cache.get(hex) : undefined;
}

/** Fire-and-forget prefetch — populates cache without React */
export function prefetchDbEntry(hex: string): void {
  if (cache.has(hex) || pending.has(hex)) return;
  fetchEntry(hex).then((result) => cache.set(hex, result));
}

async function fetchEntry(hex: string): Promise<AircraftDbEntry | null> {
  if (pending.has(hex)) return pending.get(hex)!;
  const p = fetch(`/api/aircraft-db/${hex.toLowerCase()}`)
    .then((r) => (r.ok ? r.json() as Promise<AircraftDbEntry> : null))
    .catch(() => null)
    .finally(() => pending.delete(hex));
  pending.set(hex, p);
  return p;
}

export function useAircraftDb(hex: string | null | undefined): AircraftDbEntry | null {
  const [entry, setEntry] = useState<AircraftDbEntry | null>(() =>
    hex ? (cache.has(hex) ? cache.get(hex)! : null) : null
  );

  useEffect(() => {
    if (!hex) return;
    if (cache.has(hex)) {
      setEntry(cache.get(hex)!);
      return;
    }
    fetchEntry(hex).then((result) => {
      cache.set(hex, result);
      setEntry(result);
    });
  }, [hex]);

  return entry;
}
