import { memo } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import type { EnhancedAircraft } from '@/types/aircraft';
import { useConfigStore } from '@/store/configStore';
import { EMERGENCY_COLOR } from '@/lib/colors/emergency';
import { getAircraftIcon } from '@/lib/icons/aircraftIcon';

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
        {/* Bordo scuro (layer sotto) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: `rotate(${rotation}deg) scale(1.4)`,
            maskImage: `url(${iconPath})`,
            WebkitMaskImage: `url(${iconPath})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            filter: 'blur(1px)',
          }}
        />
        {/* Icona principale con ombra */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transform: `rotate(${rotation}deg)`,
            maskImage: `url(${iconPath})`,
            WebkitMaskImage: `url(${iconPath})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            backgroundColor: color,
            filter: 'drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.9))',
          }}
        />
      </div>
    </Marker>
  );
});

AircraftMarker.displayName = 'AircraftMarker';
