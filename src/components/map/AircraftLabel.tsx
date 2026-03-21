import { memo } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import type { EnhancedAircraft } from '@/types/aircraft';
import { useConfigStore } from '@/store/configStore';
import { formatDistanceBrief } from '@/lib/formatters';

interface AircraftLabelProps {
  aircraft: EnhancedAircraft;
}

export const AircraftLabel = memo(({ aircraft }: AircraftLabelProps) => {
  const { displayUnits } = useConfigStore();

  if (aircraft.lat === undefined || aircraft.lon === undefined) return null;

  const distanceText = aircraft.distance
    ? formatDistanceBrief(aircraft.distance, displayUnits)
    : '';

  return (
    <Marker
      longitude={aircraft.lon}
      latitude={aircraft.lat}
      anchor="top"
      offset={[0, (aircraft.iconSize / 2) + 4]}
    >
      <div className="text-white text-xs font-mono border border-gray-400 px-2 py-1 rounded bg-black/50 backdrop-blur-sm whitespace-nowrap pointer-events-none">
        {aircraft.displayName}
        {distanceText && ` · ${distanceText}`}
      </div>
    </Marker>
  );
});

AircraftLabel.displayName = 'AircraftLabel';
