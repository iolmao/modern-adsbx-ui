import { useMemo } from 'react';
import { useAircraftStore } from '@/store/aircraftStore';
import { useConfigStore } from '@/store/configStore';
import type { EnhancedAircraft } from '@/types/aircraft';
import { haversineDistance, calculateBearing } from '@/lib/geo/haversine';
import { isEmergencySquawk } from '@/constants/emergencyCodes';
import {
  MIN_ICON_SIZE,
  MAX_ICON_SIZE,
  MAX_ALTITUDE_FOR_SCALING,
  MIN_TRAIL_LENGTH,
  MAX_TRAIL_LENGTH,
  MAX_SPEED_FOR_TRAIL,
} from '@/constants/aircraft';

function calculateIconSize(altitude: number | "ground" | undefined, useProportional: boolean, fixedSize: number): number {
  if (!useProportional) return fixedSize;
  if (altitude === "ground" || altitude === undefined) return MIN_ICON_SIZE;

  const factor = Math.min(altitude / MAX_ALTITUDE_FOR_SCALING, 1);
  return MIN_ICON_SIZE + (MAX_ICON_SIZE - MIN_ICON_SIZE) * factor;
}

function calculateTrailLength(groundSpeed: number | undefined): number {
  if (groundSpeed === undefined) return MIN_TRAIL_LENGTH;

  const factor = Math.min(groundSpeed / MAX_SPEED_FOR_TRAIL, 1);
  return Math.round(MIN_TRAIL_LENGTH + (MAX_TRAIL_LENGTH - MIN_TRAIL_LENGTH) * factor);
}

export function useEnhancedAircraft(): EnhancedAircraft[] {
  const { aircraft } = useAircraftStore();
  const { userLat, userLon, useProportionalSize, fixedAircraftSize } = useConfigStore();

  return useMemo(() => {
    return aircraft.map((ac): EnhancedAircraft => {
      let distance: number | undefined;
      let bearing: number | undefined;

      if (userLat !== null && userLon !== null && ac.lat !== undefined && ac.lon !== undefined) {
        distance = haversineDistance(userLat, userLon, ac.lat, ac.lon);
        bearing = calculateBearing(userLat, userLon, ac.lat, ac.lon);
      }

      const isEmergency = isEmergencySquawk(ac.squawk);
      const displayName = ac.flight?.trim() || ac.hex;
      const iconSize = calculateIconSize(ac.alt_baro, useProportionalSize, fixedAircraftSize);
      const trailLength = calculateTrailLength(ac.gs);

      return {
        ...ac,
        distance,
        bearing,
        isEmergency,
        displayName,
        iconSize,
        trailLength,
      };
    });
  }, [aircraft, userLat, userLon, useProportionalSize, fixedAircraftSize]);
}
