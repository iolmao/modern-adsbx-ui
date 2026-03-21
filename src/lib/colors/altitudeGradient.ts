import { MAX_ALTITUDE_FOR_SCALING } from '@/constants/aircraft';

/**
 * Parse a hex color string to RGB components
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB components to hex color string
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Interpolate between two colors based on a factor
 * @param color1 Start color (hex)
 * @param color2 End color (hex)
 * @param factor Interpolation factor (0-1)
 * @returns Interpolated color (hex)
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) return color1;

  const r = c1.r + (c2.r - c1.r) * factor;
  const g = c1.g + (c2.g - c1.g) * factor;
  const b = c1.b + (c2.b - c1.b) * factor;

  return rgbToHex(r, g, b);
}

/**
 * Get color for altitude based on gradient
 * @param altitude Altitude in feet (or "ground")
 * @param gradient Start and end colors
 * @returns Hex color string
 */
export function getAltitudeColor(
  altitude: number | "ground" | undefined,
  gradient: { start: string; end: string }
): string {
  if (altitude === "ground" || altitude === undefined) {
    return gradient.start;
  }

  const factor = Math.min(altitude / MAX_ALTITUDE_FOR_SCALING, 1);
  return interpolateColor(gradient.start, gradient.end, factor);
}
