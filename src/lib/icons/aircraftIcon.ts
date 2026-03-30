import { getIconFromType } from './typeToIcon';

// Known military registration prefixes by country
// dbFlags bit 0 is the primary signal; these are fallbacks when dbFlags is absent
const MILITARY_REG_PREFIXES = [
  'MM',   // Italy (Aeronautica Militare / Marina Militare / Esercito)
  'ZZ', 'ZH', 'ZK', 'ZJ', 'ZA', 'ZB', 'ZD', 'ZE', 'ZF', 'ZG', 'ZM', // UK RAF / RN
  'FAF',  // French Air Force
  'GAF',  // German Air Force
  'NAF',  // Netherlands Air Force
  'SVF',  // Swedish Air Force
];

function isMilitary(registration?: string, dbFlags?: number): boolean {
  if (dbFlags !== undefined && (dbFlags & 1) !== 0) return true;
  if (registration) {
    const reg = registration.toUpperCase();
    return MILITARY_REG_PREFIXES.some(prefix => reg.startsWith(prefix));
  }
  return false;
}

/**
 * Returns the appropriate SVG icon path based on aircraft category and/or type code.
 * Category (from ADS-B) takes priority; type code (from db) is used as fallback.
 * ICAO categories: A0-A7 (aircraft), B0-B7 (special), C0-C3 (ground)
 */
export function getAircraftIcon(
  category?: string,
  typeCode?: string,
  registration?: string,
  dbFlags?: number,
): string {
  // A7/A6/B6 from category are always reliable — check first
  if (category === 'A7') return '/heli.svg';
  if (category === 'A6') return '/fjet.svg';
  if (category === 'B6') return '/drone.svg';

  // Military flag (dbFlags bit 0) or known military registration prefix
  if (isMilitary(registration, dbFlags)) return '/fjet.svg';

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
