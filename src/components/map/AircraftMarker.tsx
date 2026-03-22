import { memo } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import type { EnhancedAircraft } from '@/types/aircraft';
import { useConfigStore } from '@/store/configStore';
import { EMERGENCY_COLOR } from '@/lib/colors/emergency';
import { getAircraftIcon } from '@/lib/icons/aircraftIcon';
import { AirplaneIcon } from '@/components/icons/AirplaneIcon';
import { HeliIcon } from '@/components/icons/HeliIcon';
import { FjetIcon } from '@/components/icons/FjetIcon';
import { PlaneIcon } from '@/components/icons/PlaneIcon';
import { DroneIcon } from '@/components/icons/DroneIcon';

interface AircraftMarkerProps {
  aircraft: EnhancedAircraft;
  onClick: (hex: string) => void;
}

export const AircraftMarker = memo(({ aircraft, onClick }: AircraftMarkerProps) => {
  const { aircraftIconColor } = useConfigStore();

  if (aircraft.lat === undefined || aircraft.lon === undefined) return null;

  const rotation = aircraft.track ?? 0;
  const iconPath = getAircraftIcon(aircraft.category);
  const color = aircraft.isEmergency ? EMERGENCY_COLOR : aircraftIconColor;

  return (
    <Marker
      longitude={aircraft.lon}
      latitude={aircraft.lat}
      anchor="center"
      onClick={(e: any) => {
        e.originalEvent.stopPropagation();
        onClick(aircraft.hex);
      }}
    >
      <div
        className="cursor-pointer transition-transform hover:scale-110 relative"
        style={{
          width: aircraft.iconSize,
          height: aircraft.iconSize,
          zIndex: 10,
          filter: 'drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.4))',
        }}
      >
        {aircraft.isEmergency && (
          <div
            className="absolute inset-0 rounded-full border-2 animate-pulse"
            style={{
              borderColor: EMERGENCY_COLOR,
              transform: 'scale(1.3)',
            }}
          />
        )}

        {/* SVG inline components per tutti i tipi */}
        {iconPath === '/airplane.svg' ? (
          <AirplaneIcon
            color={color}
            rotation={rotation}
            size={aircraft.iconSize}
          />
        ) : iconPath === '/heli.svg' ? (
          <HeliIcon
            color={color}
            rotation={rotation}
            size={aircraft.iconSize}
          />
        ) : iconPath === '/fjet.svg' ? (
          <FjetIcon
            color={color}
            rotation={rotation}
            size={aircraft.iconSize}
          />
        ) : iconPath === '/plane.svg' ? (
          <PlaneIcon
            color={color}
            rotation={rotation}
            size={aircraft.iconSize}
          />
        ) : iconPath === '/drone.svg' ? (
          <DroneIcon
            color={color}
            rotation={rotation}
            size={aircraft.iconSize}
          />
        ) : null}
      </div>
    </Marker>
  );
});

AircraftMarker.displayName = 'AircraftMarker';
