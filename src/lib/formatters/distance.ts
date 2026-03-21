import type { DisplayUnits } from '@/types/config';

const METERS_TO_FEET = 3.28084;
const METERS_TO_NM = 0.000539957;
const METERS_TO_MI = 0.000621371;
const METERS_TO_KM = 0.001;

export function formatDistanceBrief(
  meters: number | undefined,
  units: DisplayUnits
): string {
  if (meters === undefined) return '—';

  switch (units) {
    case 'metric':
      if (meters < 1000) {
        return `${Math.round(meters)}m`;
      }
      return `${(meters * METERS_TO_KM).toFixed(1)}km`;

    case 'imperial':
      if (meters < 1609.34) { // 1 mile
        return `${Math.round(meters * METERS_TO_FEET)}ft`;
      }
      return `${(meters * METERS_TO_MI).toFixed(1)}mi`;

    case 'nautical':
    default:
      if (meters < 1852) { // 1 nautical mile
        return `${Math.round(meters * METERS_TO_FEET)}ft`;
      }
      return `${(meters * METERS_TO_NM).toFixed(1)}nm`;
  }
}

export function formatDistanceLong(
  meters: number | undefined,
  units: DisplayUnits
): string {
  if (meters === undefined) return 'Unknown';

  switch (units) {
    case 'metric':
      if (meters < 1000) {
        return `${Math.round(meters)} meters`;
      }
      return `${(meters * METERS_TO_KM).toFixed(2)} kilometers`;

    case 'imperial':
      if (meters < 1609.34) {
        return `${Math.round(meters * METERS_TO_FEET)} feet`;
      }
      return `${(meters * METERS_TO_MI).toFixed(2)} miles`;

    case 'nautical':
    default:
      if (meters < 1852) {
        return `${Math.round(meters * METERS_TO_FEET)} feet`;
      }
      return `${(meters * METERS_TO_NM).toFixed(2)} nautical miles`;
  }
}
