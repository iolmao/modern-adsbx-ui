import { useEffect, useRef, useState } from 'react';
import type { EnhancedAircraft } from '@/types/aircraft';

interface InterpolationEntry {
  fromLat: number;
  fromLon: number;
  fromTrack: number;
  toLat: number;
  toLon: number;
  toTrack: number;
  startTime: number; // ms when this transition started
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Shortest-path angle interpolation (handles 350° → 10° wrap-around) */
function lerpAngle(a: number, b: number, t: number): number {
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (a + diff * t + 360) % 360;
}

/**
 * Smoothly interpolates aircraft positions between data ticks using
 * requestAnimationFrame. Returns the same EnhancedAircraft[] but with
 * lat, lon, and track linearly interpolated toward the latest received values.
 */
export function useInterpolatedPositions(
  aircraft: EnhancedAircraft[],
  refreshInterval: number
): EnhancedAircraft[] {
  const entriesRef = useRef<Map<string, InterpolationEntry>>(new Map());
  const rafRef = useRef<number>(0);
  const [, forceUpdate] = useState(0);

  // When new aircraft data arrives, snapshot current interpolated positions
  // as the new "from" and set new targets.
  useEffect(() => {
    const now = Date.now();
    const prev = entriesRef.current;
    const next = new Map<string, InterpolationEntry>();

    for (const ac of aircraft) {
      if (ac.lat === undefined || ac.lon === undefined) continue;

      const existing = prev.get(ac.hex);

      if (existing) {
        const elapsed = now - existing.startTime;
        const t = Math.min(elapsed / refreshInterval, 1);

        // Snapshot where we currently are
        const curLat = lerp(existing.fromLat, existing.toLat, t);
        const curLon = lerp(existing.fromLon, existing.toLon, t);
        const curTrack = lerpAngle(existing.fromTrack, existing.toTrack, t);

        const moved =
          Math.abs(existing.toLat - ac.lat) > 1e-8 ||
          Math.abs(existing.toLon - ac.lon) > 1e-8;

        next.set(ac.hex, {
          fromLat: moved ? curLat : ac.lat,
          fromLon: moved ? curLon : ac.lon,
          fromTrack: moved ? curTrack : (ac.track ?? curTrack),
          toLat: ac.lat,
          toLon: ac.lon,
          toTrack: ac.track ?? curTrack,
          startTime: moved ? now : existing.startTime,
        });
      } else {
        // First time we see this aircraft — start already at target
        next.set(ac.hex, {
          fromLat: ac.lat,
          fromLon: ac.lon,
          fromTrack: ac.track ?? 0,
          toLat: ac.lat,
          toLon: ac.lon,
          toTrack: ac.track ?? 0,
          startTime: now - refreshInterval, // t = 1 immediately
        });
      }
    }

    entriesRef.current = next;
  }, [aircraft, refreshInterval]);

  // Animation loop — restarts on each new data batch, stops once all
  // transitions reach t = 1.
  useEffect(() => {
    function animate() {
      const now = Date.now();
      const hasActive = [...entriesRef.current.values()].some(
        (e) => now - e.startTime < refreshInterval
      );

      if (hasActive) {
        forceUpdate((n) => n + 1);
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [aircraft, refreshInterval]);

  // Compute and return interpolated positions
  const now = Date.now();
  return aircraft.map((ac) => {
    if (ac.lat === undefined || ac.lon === undefined) return ac;

    const entry = entriesRef.current.get(ac.hex);
    if (!entry) return ac;

    const t = Math.min((now - entry.startTime) / refreshInterval, 1);

    return {
      ...ac,
      lat: lerp(entry.fromLat, entry.toLat, t),
      lon: lerp(entry.fromLon, entry.toLon, t),
      track: ac.track !== undefined
        ? lerpAngle(entry.fromTrack, entry.toTrack, t)
        : ac.track,
    };
  });
}
