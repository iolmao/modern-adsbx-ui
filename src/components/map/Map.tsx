import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import MapGL, { NavigationControl, ScaleControl, type ViewState, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useConfigStore } from '@/store/configStore';
import { useUIStore } from '@/store/uiStore';
import { TILE_LAYERS, DEFAULT_MAP_VIEW } from '@/constants/map';
import { useEnhancedAircraft } from '@/hooks/useDistanceCalculation';
import { useAircraftHistory } from '@/hooks/useAircraftHistory';
import { useInterpolatedPositions } from '@/hooks/useInterpolatedPositions';
import { AircraftMarker } from './AircraftMarker';
import { AircraftDot } from './AircraftDot';
import { AircraftLabel } from './AircraftLabel';
import { AircraftTrailsCanvas } from './AircraftTrailsCanvas';
import { AircraftDetailPanel } from '@/components/aircraft/AircraftDetailPanel';
import { FlightRouteLine } from './FlightRouteLine';

export function Map() {
  const { tileLayer, showLabels, userLat, userLon, refreshInterval } = useConfigStore();
  const { viewMode, selectAircraft, setVisibleCount, setMapBounds } = useUIStore();

  // aircraft is already filtered to viewport by useEnhancedAircraft (via mapBounds in store)
  const rawAircraft = useEnhancedAircraft();
  const aircraft = useInterpolatedPositions(rawAircraft, refreshInterval);
  const history = useAircraftHistory();

  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState<ViewState>({
    ...DEFAULT_MAP_VIEW,
    longitude: userLon ?? DEFAULT_MAP_VIEW.longitude,
    latitude: userLat ?? DEFAULT_MAP_VIEW.latitude,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const selectedLayer = TILE_LAYERS.find((l) => l.id === tileLayer) ?? TILE_LAYERS[0];

  const mapStyle = useMemo(() => ({
    version: 8 as const,
    sources: {
      'raster-tiles': {
        type: 'raster' as const,
        tiles: [selectedLayer.url],
        tileSize: 256,
        attribution: selectedLayer.attribution,
      },
    },
    layers: [
      {
        id: 'simple-tiles',
        type: 'raster' as const,
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  }), [selectedLayer]);

  const updateBounds = useCallback(() => {
    if (mapRef.current) {
      const b = mapRef.current.getBounds();
      if (b) setMapBounds({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() });
    }
  }, [setMapBounds]);

  const handleMove = useCallback((evt: { viewState: ViewState }) => {
    setViewState(evt.viewState);
    updateBounds();
  }, [updateBounds]);

  const handleAircraftClick = useCallback(
    (hex: string) => {
      if (viewMode === 'standard') selectAircraft(hex);
    },
    [viewMode, selectAircraft]
  );

  useEffect(() => {
    setVisibleCount(aircraft.length);
  }, [aircraft.length, setVisibleCount]);

  return (
    <div className="w-screen h-screen">
      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onLoad={updateBounds}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        maxTileCacheSize={50}
      >
        <NavigationControl position="bottom-left" />
        <ScaleControl position="bottom-right" unit="metric" />

        <AircraftTrailsCanvas aircraft={aircraft} history={history} />
        <FlightRouteLine />

        {aircraft.map((ac) => (
          <div key={ac.hex}>
            {viewMode === 'standard' ? (
              <>
                <AircraftMarker aircraft={ac} onClick={handleAircraftClick} />
                {showLabels && <AircraftLabel aircraft={ac} />}
              </>
            ) : (
              <AircraftDot aircraft={ac} />
            )}
          </div>
        ))}

        <AircraftDetailPanel />
      </MapGL>
    </div>
  );
}
