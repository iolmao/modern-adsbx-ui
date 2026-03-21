// ICAO aircraft category labels
export const CATEGORY_LABELS: { [key: string]: string } = {
  'A0': 'No info',
  'A1': 'Light',
  'A2': 'Small',
  'A3': 'Large',
  'A4': 'High vortex',
  'A5': 'Heavy',
  'A6': 'High performance',
  'A7': 'Rotorcraft',
  'B0': 'No info',
  'B1': 'Glider',
  'B2': 'Lighter than air',
  'B3': 'Parachutist',
  'B4': 'Ultralight',
  'B5': 'Reserved',
  'B6': 'UAV',
  'B7': 'Space vehicle',
  'C0': 'No info',
  'C1': 'Surface emergency',
  'C2': 'Surface service',
  'C3': 'Obstruction',
};

// Size scaling for aircraft icons
export const MIN_ICON_SIZE = 14;
export const MAX_ICON_SIZE = 32;
export const MAX_ALTITUDE_FOR_SCALING = 45000; // feet

// Trail settings
export const MIN_TRAIL_LENGTH = 10;
export const MAX_TRAIL_LENGTH = 60;
export const MAX_SPEED_FOR_TRAIL = 500; // knots

// Stale aircraft timeout (seconds)
export const STALE_TIMEOUT = 300; // 5 minutes

// Circular buffer size for position history
export const POSITION_HISTORY_SIZE = 60;
