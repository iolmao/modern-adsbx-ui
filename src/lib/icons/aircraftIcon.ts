/**
 * Returns the appropriate SVG icon path based on aircraft category
 * ICAO categories: A0-A7 (aircraft), B0-B7 (special), C0-C3 (ground)
 */
export function getAircraftIcon(category?: string): string {
  if (!category) return '/airplane.svg';

  // A7: Rotorcraft (helicopters)
  if (category === 'A7') return '/heli.svg';

  // A6: High performance (fighter jets, military)
  if (category === 'A6') return '/fjet.svg';

  // A1: Light aircraft (Cessna, small planes)
  if (category === 'A1') return '/plane.svg';

  // B6: UAV/Drones
  if (category === 'B6') return '/drone.svg';

  // Default: standard airplane for everything else
  // (A2: Small, A3: Large, A4: High vortex, A5: Heavy)
  return '/airplane.svg';
}
