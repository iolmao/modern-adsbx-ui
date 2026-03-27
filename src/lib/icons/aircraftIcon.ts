import { getIconFromType } from './typeToIcon';

/**
 * Returns the appropriate SVG icon path based on aircraft category and/or type code.
 * Category (from ADS-B) takes priority; type code (from db) is used as fallback.
 * ICAO categories: A0-A7 (aircraft), B0-B7 (special), C0-C3 (ground)
 */
export function getAircraftIcon(category?: string, typeCode?: string): string {
  // A7/A6/B6 from category are always reliable — check first
  if (category === 'A7') return '/heli.svg';
  if (category === 'A6') return '/fjet.svg';
  if (category === 'B6') return '/drone.svg';

  // Type code takes priority for everything else (avoids A1 misclassifying jets as small planes)
  if (typeCode) {
    const fromType = getIconFromType(typeCode);
    if (fromType) return fromType;
  }

  // Fall back to category
  if (category === 'A1') return '/plane.svg';
  if (category) return '/airplane.svg';

  return '/airplane.svg';
}
