import { useEffect, useRef } from 'react';
import { useAircraftStore } from '@/store/aircraftStore';
import { useUIStore, type MapBounds } from '@/store/uiStore';
import { useConfigStore } from '@/store/configStore';
import type { AircraftHistoryMap, PositionHistory } from '@/types/aircraft';
import { POSITION_HISTORY_SIZE, STALE_TIMEOUT } from '@/constants/aircraft';

// Larger padding than render bounds — keep history for aircraft about to enter view
const HISTORY_BOUNDS_PADDING = 2.0; // degrees

function inHistoryBounds(lat: number, lon: number, bounds: MapBounds): boolean {
  return (
    lat >= bounds.south - HISTORY_BOUNDS_PADDING &&
    lat <= bounds.north + HISTORY_BOUNDS_PADDING &&
    lon >= bounds.west - HISTORY_BOUNDS_PADDING &&
    lon <= bounds.east + HISTORY_BOUNDS_PADDING
  );
}

export function useAircraftHistory() {
  const { aircraft, timestamp } = useAircraftStore();
  const { mapBounds } = useUIStore();
  const { tar1090Url } = useConfigStore();
  const historyRef = useRef<AircraftHistoryMap>({});
  const lastSeenRef = useRef<Record<string, number>>({});

  // Clear all history immediately when the feed URL changes
  useEffect(() => {
    historyRef.current = {};
    lastSeenRef.current = {};
  }, [tar1090Url]);

  useEffect(() => {
    const history = historyRef.current;
    const lastSeen = lastSeenRef.current;
    const currentTime = timestamp / 1000;

    aircraft.forEach((ac) => {
      if (ac.lat === undefined || ac.lon === undefined) return;

      // Only accumulate history for aircraft in or near the viewport
      if (mapBounds && !inHistoryBounds(ac.lat, ac.lon, mapBounds)) return;

      lastSeen[ac.hex] = currentTime;

      if (!history[ac.hex]) history[ac.hex] = [];

      const aircraftHistory = history[ac.hex];
      const lastPos = aircraftHistory[aircraftHistory.length - 1];

      const posChanged =
        !lastPos ||
        lastPos.lat !== ac.lat ||
        lastPos.lon !== ac.lon ||
        lastPos.alt !== ac.alt_baro;

      if (posChanged) {
        const newPos: PositionHistory = {
          lat: ac.lat,
          lon: ac.lon,
          alt: ac.alt_baro,
          timestamp: currentTime,
          track: ac.track,
        };

        aircraftHistory.push(newPos);

        // Cap history length — drop oldest entries
        if (aircraftHistory.length > POSITION_HISTORY_SIZE) {
          aircraftHistory.splice(0, aircraftHistory.length - POSITION_HISTORY_SIZE);
        }
      }
    });

    // Prune aircraft no longer in feed or not seen for STALE_TIMEOUT seconds
    const activeHexes = new Set(aircraft.map((ac) => ac.hex));
    Object.keys(history).forEach((hex) => {
      const gone = !activeHexes.has(hex);
      const stale = currentTime - (lastSeen[hex] ?? 0) > STALE_TIMEOUT;
      if (gone || stale) {
        delete history[hex];
        delete lastSeen[hex];
      }
    });
  }, [aircraft, timestamp, mapBounds]);

  return historyRef.current;
}
