export function formatTrackBrief(track: number | undefined): string {
  if (track === undefined) return '—';
  return `${Math.round(track)}°`;
}

export function formatTrackLong(track: number | undefined): string {
  if (track === undefined) return 'Unknown';
  const rounded = Math.round(track);
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((rounded % 360) / 45)) % 8;
  return `${rounded}° (${directions[index]})`;
}

export function formatVertRateBrief(rate: number | undefined): string {
  if (rate === undefined) return '—';
  const rounded = Math.round(rate);
  if (rounded > 64) return `↑${rounded}`;
  if (rounded < -64) return `↓${Math.abs(rounded)}`;
  return '→';
}

export function formatVertRateLong(rate: number | undefined): string {
  if (rate === undefined) return 'Level';
  const rounded = Math.round(rate);
  if (rounded > 64) return `Climbing ${rounded} ft/min`;
  if (rounded < -64) return `Descending ${Math.abs(rounded)} ft/min`;
  return 'Level';
}
