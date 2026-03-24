import { useState, useCallback, useRef } from 'react';
import MapGL, { NavigationControl, type ViewState, type MapRef } from 'react-map-gl/maplibre';
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

interface Bounds { north: number; south: number; east: number; west: number }

// Small padding so aircraft don't pop in/out exactly at the viewport edge
const BOUNDS_PADDING = 0.5 // degrees

function inBounds(lat: number, lon: number, bounds: Bounds): boolean {
  return (
    lat >= bounds.south - BOUNDS_PADDING &&
    lat <= bounds.north + BOUNDS_PADDING &&
    lon >= bounds.west - BOUNDS_PADDING &&
    lon <= bounds.east + BOUNDS_PADDING
  );
}

export function Map() {
  const { tileLayer, showLabels, showTrails, userLat, userLon, refreshInterval } = useConfigStore();
  const { viewMode, selectAircraft } = useUIStore();
  const rawAircraft = useEnhancedAircraft();
  const aircraft = useInterpolatedPositions(rawAircraft, refreshInterval);
  const history = useAircraftHistory();

  const mapRef = useRef<MapRef>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);

  const [viewState, setViewState] = useState<ViewState>({
    ...DEFAULT_MAP_VIEW,
    longitude: userLon ?? DEFAULT_MAP_VIEW.longitude,
    latitude: userLat ?? DEFAULT_MAP_VIEW.latitude,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const selectedLayer = TILE_LAYERS.find((l) => l.id === tileLayer) ?? TILE_LAYERS[0];

  const handleMove = useCallback((evt: { viewState: ViewState }) => {
    setViewState(evt.viewState);
    if (mapRef.current) {
      const b = mapRef.current.getBounds();
      if (b) setBounds({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() });
    }
  }, []);

  const handleAircraftClick = useCallback(
    (hex: string) => {
      if (viewMode === 'standard') selectAircraft(hex);
    },
    [viewMode, selectAircraft]
  );

  const visibleAircraft = bounds
    ? aircraft.filter((ac) => ac.lat !== undefined && ac.lon !== undefined && inBounds(ac.lat!, ac.lon!, bounds))
    : aircraft.filter((ac) => ac.lat !== undefined && ac.lon !== undefined);

  return (
    <div className="w-screen h-screen">
      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onLoad={() => {
          if (mapRef.current) {
            const b = mapRef.current.getBounds();
            if (b) setBounds({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() });
          }
        }}
        mapStyle={{
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [selectedLayer.url],
              tileSize: 256,
              attribution: selectedLayer.attribution,
            },
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-left" />

        <AircraftTrailsCanvas aircraft={visibleAircraft} history={history} />

        {visibleAircraft.map((ac) => (
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
