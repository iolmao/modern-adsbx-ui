import { useState, useCallback } from 'react';
import MapGL, { NavigationControl, type ViewState } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useConfigStore } from '@/store/configStore';
import { useUIStore } from '@/store/uiStore';
import { TILE_LAYERS, DEFAULT_MAP_VIEW } from '@/constants/map';
import { useEnhancedAircraft } from '@/hooks/useDistanceCalculation';
import { useAircraftHistory } from '@/hooks/useAircraftHistory';
import { AircraftMarker } from './AircraftMarker';
import { AircraftDot } from './AircraftDot';
import { AircraftLabel } from './AircraftLabel';
import { AircraftTrails } from './AircraftTrails';
import { AircraftDetailPanel } from '@/components/aircraft/AircraftDetailPanel';

export function Map() {
  const { tileLayer, showLabels, showTrails, userLat, userLon } = useConfigStore();
  const { viewMode, selectAircraft } = useUIStore();
  const aircraft = useEnhancedAircraft();
  const history = useAircraftHistory();

  const [viewState, setViewState] = useState<ViewState>({
    ...DEFAULT_MAP_VIEW,
    longitude: userLon ?? DEFAULT_MAP_VIEW.longitude,
    latitude: userLat ?? DEFAULT_MAP_VIEW.latitude,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const selectedLayer = TILE_LAYERS.find((l) => l.id === tileLayer) ?? TILE_LAYERS[0];

  const handleAircraftClick = useCallback(
    (hex: string) => {
      if (viewMode === 'standard') {
        selectAircraft(hex);
      }
    },
    [viewMode, selectAircraft]
  );

  return (
    <div className="w-screen h-screen">
      <MapGL
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
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
        <NavigationControl position="top-right" />

        {/* Aircraft trails - visible in both modes if enabled */}
        {showTrails && <AircraftTrails aircraft={aircraft} history={history} />}

        {/* Aircraft markers/dots */}
        {aircraft.map((ac) => {
          if (ac.lat === undefined || ac.lon === undefined) return null;

          return (
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
          );
        })}

        {/* Aircraft detail popup */}
        <AircraftDetailPanel />
      </MapGL>
    </div>
  );
}
