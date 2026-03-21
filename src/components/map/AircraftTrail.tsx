import { memo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { EnhancedAircraft, PositionHistory } from '@/types/aircraft';
import { EMERGENCY_COLOR } from '@/lib/colors/emergency';

interface AircraftTrailProps {
  aircraft: EnhancedAircraft;
  trail: PositionHistory[];
}

export const AircraftTrail = memo(({ aircraft, trail }: AircraftTrailProps) => {
  const limitedTrail = trail.slice(-aircraft.trailLength);

  if (limitedTrail.length < 2) return null;

  const coordinates = limitedTrail.map((pos) => [pos.lon, pos.lat]);

  const geojson = {
    type: 'Feature' as const,
    geometry: {
      type: 'LineString' as const,
      coordinates,
    },
    properties: {},
  };

  const color = aircraft.isEmergency ? EMERGENCY_COLOR : aircraft.trailColor;

  return (
    <Source id={`trail-${aircraft.hex}`} type="geojson" data={geojson}>
      <Layer
        id={`trail-layer-${aircraft.hex}`}
        type="line"
        paint={{
          'line-color': color,
          'line-width': 1,
          'line-opacity': 0.7,
        }}
      />
    </Source>
  );
});

AircraftTrail.displayName = 'AircraftTrail';
