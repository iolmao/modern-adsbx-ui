import type { DisplayUnits } from '@/types/config';

const KNOTS_TO_KMH = 1.852;
const KNOTS_TO_MPH = 1.15078;

export function formatSpeedBrief(
  speed: number | undefined,
  units: DisplayUnits
): string {
  if (speed === undefined) return '—';

  switch (units) {
    case 'metric':
      return `${Math.round(speed * KNOTS_TO_KMH)}km/h`;
    case 'imperial':
      return `${Math.round(speed * KNOTS_TO_MPH)}mph`;
    case 'nautical':
    default:
      return `${Math.round(speed)}kt`;
  }
}

export function formatSpeedLong(
  speed: number | undefined,
  units: DisplayUnits
): string {
  if (speed === undefined) return 'Unknown';

  switch (units) {
    case 'metric':
      return `${Math.round(speed * KNOTS_TO_KMH)} km/h`;
    case 'imperial':
      return `${Math.round(speed * KNOTS_TO_MPH)} mph`;
    case 'nautical':
    default:
      return `${Math.round(speed)} knots`;
  }
}

export function formatMach(mach: number | undefined): string {
  if (mach === undefined) return '—';
  return `M${mach.toFixed(3)}`;
}
