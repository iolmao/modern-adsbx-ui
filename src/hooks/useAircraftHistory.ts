import { useEffect, useRef } from 'react';
import { useAircraftStore } from '@/store/aircraftStore';
import type { AircraftHistoryMap, PositionHistory } from '@/types/aircraft';
import { POSITION_HISTORY_SIZE, STALE_TIMEOUT } from '@/constants/aircraft';

export function useAircraftHistory() {
  const { aircraft, timestamp } = useAircraftStore();
  const historyRef = useRef<AircraftHistoryMap>({});

  useEffect(() => {
    const history = historyRef.current;
    const currentTime = timestamp / 1000; // Convert to seconds

    // Update history for each aircraft with position
    aircraft.forEach((ac) => {
      if (ac.lat === undefined || ac.lon === undefined) return;

      if (!history[ac.hex]) {
        history[ac.hex] = [];
      }

      const aircraftHistory = history[ac.hex];
      const lastPos = aircraftHistory[aircraftHistory.length - 1];

      // Only add if position changed
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
        // No limit - trail lives until aircraft disappears
      }
    });

    // Cleanup aircraft that are no longer active (immediate deletion)
    const activeHexes = new Set(aircraft.map((ac) => ac.hex));
    Object.keys(history).forEach((hex) => {
      if (!activeHexes.has(hex)) {
        delete history[hex];
      }
    });
  }, [aircraft, timestamp]);

  return historyRef.current;
}
