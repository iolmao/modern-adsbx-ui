export const EMERGENCY_SQUAWK_CODES = ['7700', '7600', '7500'] as const;

export const EMERGENCY_DESCRIPTIONS: { [key: string]: string } = {
  '7700': 'General Emergency',
  '7600': 'Radio Failure',
  '7500': 'Hijack',
};

export function isEmergencySquawk(squawk?: string): boolean {
  if (!squawk) return false;
  return EMERGENCY_SQUAWK_CODES.includes(squawk as typeof EMERGENCY_SQUAWK_CODES[number]);
}

export function getEmergencyDescription(squawk?: string): string | undefined {
  if (!squawk) return undefined;
  return EMERGENCY_DESCRIPTIONS[squawk];
}
