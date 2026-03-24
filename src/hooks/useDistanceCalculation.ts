import { useMemo } from 'react';
import { useAircraftStore } from '@/store/aircraftStore';
import { useConfigStore } from '@/store/configStore';
import { useUIStore, type MapBounds } from '@/store/uiStore';
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

const BOUNDS_PADDING = 0.5; // degrees — same as Map.tsx

function inBounds(lat: number, lon: number, bounds: MapBounds): boolean {
  return (
    lat >= bounds.south - BOUNDS_PADDING &&
    lat <= bounds.north + BOUNDS_PADDING &&
    lon >= bounds.west - BOUNDS_PADDING &&
    lon <= bounds.east + BOUNDS_PADDING
  );
}

function calculateIconSize(altitude: number | 'ground' | undefined, useProportional: boolean, fixedSize: number): number {
  if (!useProportional) return fixedSize;
  if (altitude === 'ground' || altitude === undefined) return MIN_ICON_SIZE;
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
  const { mapBounds } = useUIStore();

  return useMemo(() => {
    // Filter to viewport before doing any computation — always keep emergency aircraft
    const candidates = mapBounds
      ? aircraft.filter((ac) =>
          isEmergencySquawk(ac.squawk) ||
          (ac.lat !== undefined && ac.lon !== undefined && inBounds(ac.lat, ac.lon, mapBounds))
        )
      : aircraft;

    return candidates.map((ac): EnhancedAircraft => {
      let distance: number | undefined;
      let bearing: number | undefined;

      if (userLat !== null && userLon !== null && ac.lat !== undefined && ac.lon !== undefined) {
        distance = haversineDistance(userLat, userLon, ac.lat, ac.lon);
        bearing = calculateBearing(userLat, userLon, ac.lat, ac.lon);
      }

      return {
        ...ac,
        distance,
        bearing,
        isEmergency: isEmergencySquawk(ac.squawk),
        displayName: ac.flight?.trim() || ac.hex,
        iconSize: calculateIconSize(ac.alt_baro, useProportionalSize, fixedAircraftSize),
        trailLength: calculateTrailLength(ac.gs),
      };
    });
  }, [aircraft, mapBounds, userLat, userLon, useProportionalSize, fixedAircraftSize]);
}
