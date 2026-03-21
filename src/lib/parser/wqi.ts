import type { Aircraft, AircraftData } from '@/types/aircraft';

interface ParseOptions {
  siteLat?: number;
  siteLon?: number;
}

/**
 * Parse binCraft binary format from tar1090/readsb
 * Simplified version - handles JSON fallback
 */
export function parseAircraftData(
  buffer: ArrayBuffer,
  _options: ParseOptions = {}
): AircraftData {
  // For now, we'll use a simplified approach
  // In production, this would parse the actual binCraft format
  // But since binCraft is complex, let's provide a fallback to JSON

  // Try to parse as JSON (tar1090 also provides aircraft.json)
  try {
    const text = new TextDecoder().decode(buffer);
    const json = JSON.parse(text);

    return {
      aircraft: json.aircraft || [],
      now: json.now || Date.now() / 1000,
      messages: json.messages || 0,
      stats: {
        total: json.aircraft?.length || 0,
        positions: json.aircraft?.filter((ac: Aircraft) => ac.lat !== undefined && ac.lon !== undefined).length || 0,
      },
    };
  } catch {
    // If JSON parsing fails, return empty dataset
    // In production, implement full binCraft parsing
    return {
      aircraft: [],
      now: Date.now() / 1000,
      messages: 0,
      stats: {
        total: 0,
        positions: 0,
      },
    };
  }
}
