import { memo } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import type { EnhancedAircraft } from '@/types/aircraft';
import { useConfigStore } from '@/store/configStore';
import { EMERGENCY_COLOR } from '@/lib/colors/emergency';
import { getAircraftIcon } from '@/lib/icons/aircraftIcon';
import { getCachedDbEntry, prefetchDbEntry } from '@/hooks/useAircraftDb';
import { AirplaneIcon } from '@/components/icons/AirplaneIcon';
import { HeliIcon } from '@/components/icons/HeliIcon';
import { FjetIcon } from '@/components/icons/FjetIcon';
import { PlaneIcon } from '@/components/icons/PlaneIcon';
import { DroneIcon } from '@/components/icons/DroneIcon';
import { BizjetIcon } from '@/components/icons/BizjetIcon';

interface AircraftMarkerProps {
  aircraft: EnhancedAircraft;
  onClick: (hex: string) => void;
}

function getShadow(alt: number | 'ground' | undefined): string {
  if (alt === 'ground' || alt === undefined) return 'drop-shadow(0px 1px 0px rgba(0,0,0,0.35))';
  const factor = Math.min(alt / 45000, 1);
  const offset = Math.round(1 + factor * 9);   // 1px → 10px
  const blur   = Math.round(factor * 4);        // 0px → 4px
  const alpha  = (0.35 - factor * 0.1).toFixed(2); // 0.35 → 0.25
  return `drop-shadow(0px ${offset}px ${blur}px rgba(0,0,0,${alpha}))`;
}

export const AircraftMarker = memo(({ aircraft, onClick }: AircraftMarkerProps) => {
  const { aircraftIconColor, useProportionalSize } = useConfigStore();

  if (aircraft.lat === undefined || aircraft.lon === undefined) return null;

  const rotation = aircraft.track ?? 0;
  // Use type from live feed, or fall back to db cache (populated lazily)
  const typeCode = aircraft.t ?? getCachedDbEntry(aircraft.hex)?.type;
  if (!aircraft.t) prefetchDbEntry(aircraft.hex);
  const iconPath = getAircraftIcon(aircraft.category, typeCode, aircraft.r, aircraft.dbFlags);
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
          filter: useProportionalSize ? getShadow(aircraft.alt_baro) : 'drop-shadow(0px 4px 0px rgba(0,0,0,0.4))',
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
        ) : iconPath === '/bizjet.svg' ? (
          <BizjetIcon
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
