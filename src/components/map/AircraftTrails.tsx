import { memo, useMemo, useRef } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { EnhancedAircraft, PositionHistory, AircraftHistoryMap } from '@/types/aircraft';
import { EMERGENCY_COLOR } from '@/lib/colors/emergency';

interface AircraftTrailsProps {
  aircraft: EnhancedAircraft[];
  history: AircraftHistoryMap;
}

function createTrailsGeoJSON(aircraft: EnhancedAircraft[], history: AircraftHistoryMap) {
  const features = aircraft
    .map((ac) => {
      const trail = history[ac.hex];
      if (!trail || trail.length < 2) return null;

      const limitedTrail = trail.slice(-ac.trailLength);
      if (limitedTrail.length < 2) return null;

      const coordinates = limitedTrail.map((pos: PositionHistory) => [pos.lon, pos.lat]);
      const color = ac.isEmergency ? EMERGENCY_COLOR : ac.trailColor;

      return {
        type: 'Feature' as const,
        geometry: {
          type: 'LineString' as const,
          coordinates,
        },
        properties: {
          color,
          hex: ac.hex,
        },
      };
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);

  return {
    type: 'FeatureCollection' as const,
    features,
  };
}

// Componente interno che NON viene mai ricreato grazie alla key stabile
const TrailsLayer = memo(() => {
  return (
    <Layer
      id="aircraft-trails-layer"
      type="line"
      source="aircraft-trails"
      paint={{
        'line-color': ['get', 'color'],
        'line-width': 2,
        'line-opacity': 0.8,
      }}
      layout={{
        'line-cap': 'round',
        'line-join': 'round',
      }}
    />
  );
});

TrailsLayer.displayName = 'TrailsLayer';

export const AircraftTrails = memo(({ aircraft, history }: AircraftTrailsProps) => {
  const geojsonRef = useRef<any>(null);

  const geojson = useMemo(() => {
    const newGeojson = createTrailsGeoJSON(aircraft, history);

    // Salva il riferimento per debug
    geojsonRef.current = newGeojson;

    return newGeojson;
  }, [aircraft, history]);

  if (geojson.features.length === 0) {
    return null;
  }

  // Key stabile per il Source così React non lo ricrea mai
  return (
    <Source
      key="aircraft-trails-stable"
      id="aircraft-trails"
      type="geojson"
      data={geojson}
    >
      <TrailsLayer />
    </Source>
  );
});

AircraftTrails.displayName = 'AircraftTrails';
