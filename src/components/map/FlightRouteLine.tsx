import { Source, Layer } from 'react-map-gl/maplibre';
import { useSelectedAircraft } from '@/hooks/useSelectedAircraft';
import { useFlightRoute } from '@/hooks/useFlightRoute';
import { useConfigStore } from '@/store/configStore';
import type { AirportInfo } from '@/hooks/useFlightRoute';

// Intermediate points along the great circle between two [lng, lat] coordinates
function geodesicPoints(
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number],
  numPoints = 80,
): [number, number][] {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const φ1 = toRad(lat1), λ1 = toRad(lng1);
  const φ2 = toRad(lat2), λ2 = toRad(lng2);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((φ2 - φ1) / 2) ** 2 +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
      ),
    );

  // Points too close — no interpolation needed
  if (d < 0.0001) return [[lng1, lat1], [lng2, lat2]];

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    points.push([toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)))]);
  }
  return points;
}

function hasCoords(apt: AirportInfo): boolean {
  return apt.lat !== 0 || apt.lng !== 0;
}

function lineGeoJSON(coords: [number, number][]) {
  return {
    type: 'Feature' as const,
    geometry: { type: 'LineString' as const, coordinates: coords },
    properties: {},
  };
}

export function FlightRouteLine() {
  const aircraft = useSelectedAircraft();
  const route = useFlightRoute(aircraft?.flight);
  const { trailColor } = useConfigStore();

  if (!route || route.airports.length < 2) return null;
  if (aircraft?.lat == null || aircraft?.lon == null) return null;

  const destination = route.airports[route.airports.length - 1];
  if (!hasCoords(destination)) return null;

  const acPos: [number, number] = [aircraft.lon, aircraft.lat];
  const destPos: [number, number] = [destination.lng, destination.lat];

  const remaining = lineGeoJSON(geodesicPoints(acPos, destPos));

  return (
    <Source id="flight-route-remaining" type="geojson" data={remaining}>
      <Layer
        id="flight-route-remaining-line"
        type="line"
        source="flight-route-remaining"
        paint={{
          'line-color': trailColor,
          'line-width': 2,
          'line-opacity': 0.5,
          'line-dasharray': [3, 3],
        }}
        layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
      />
    </Source>
  );
}
