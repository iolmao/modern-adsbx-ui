import { CATEGORY_LABELS } from '@/constants/aircraft';

export function getCategoryLabel(category: string | undefined): string {
  if (!category) return 'Unknown';
  return CATEGORY_LABELS[category] || category;
}

export function formatSquawk(squawk: string | undefined): string {
  if (!squawk) return '—';
  return squawk;
}

export function formatCallsign(callsign: string | undefined): string {
  if (!callsign) return '';
  return callsign.trim();
}

export function formatTime(seconds: number | undefined): string {
  if (seconds === undefined) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
}
