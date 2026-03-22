import { memo } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import type { EnhancedAircraft } from '@/types/aircraft';
import { EMERGENCY_COLOR } from '@/lib/colors/emergency';
import { useConfigStore } from '@/store/configStore';

interface AircraftDotProps {
  aircraft: EnhancedAircraft;
}

export const AircraftDot = memo(({ aircraft }: AircraftDotProps) => {
  const { trailColor } = useConfigStore();

  if (aircraft.lat === undefined || aircraft.lon === undefined) return null;

  const color = aircraft.isEmergency ? EMERGENCY_COLOR : trailColor;

  return (
    <Marker longitude={aircraft.lon} latitude={aircraft.lat} anchor="center">
      <div
        style={{
          width: 2,
          height: 2,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    </Marker>
  );
});

AircraftDot.displayName = 'AircraftDot';
