import type { DisplayUnits } from '@/types/config';

const FEET_TO_METERS = 0.3048;

export function formatAltitudeBrief(
  altitude: number | "ground" | undefined,
  units: DisplayUnits
): string {
  if (altitude === undefined) return '—';
  if (altitude === "ground") return 'GND';

  if (units === 'metric') {
    const meters = Math.round(altitude * FEET_TO_METERS);
    return `${meters}m`;
  }

  // nautical and imperial use feet
  return `${Math.round(altitude)}ft`;
}

export function formatAltitudeLong(
  altitude: number | "ground" | undefined,
  units: DisplayUnits
): string {
  if (altitude === undefined) return 'Unknown';
  if (altitude === "ground") return 'Ground';

  if (units === 'metric') {
    const meters = Math.round(altitude * FEET_TO_METERS);
    return `${meters} meters`;
  }

  return `${Math.round(altitude)} feet`;
}
