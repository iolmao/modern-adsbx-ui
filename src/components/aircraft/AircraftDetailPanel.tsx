import { X } from 'lucide-react';
import { Popup } from 'react-map-gl/maplibre';
import { useUIStore } from '@/store/uiStore';
import { useConfigStore } from '@/store/configStore';
import { useSelectedAircraft } from '@/hooks/useSelectedAircraft';
import { useAircraftPhoto } from '@/hooks/useAircraftPhoto';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  formatAltitudeBrief,
  formatSpeedBrief,
  formatDistanceBrief,
  formatVertRateBrief,
  formatTrackBrief,
  getCategoryLabel,
  formatSquawk,
  formatTime,
  formatMach,
} from '@/lib/formatters';
import { getEmergencyDescription } from '@/constants/emergencyCodes';
import type { EnhancedAircraft } from '@/types/aircraft';

export function AircraftDetailPanel() {
  const { selectedAircraftHex, selectAircraft, detailLevel, setDetailLevel } = useUIStore();
  const { displayUnits } = useConfigStore();
  const aircraft = useSelectedAircraft();
  const { photo } = useAircraftPhoto(selectedAircraftHex);

  if (!selectedAircraftHex || !aircraft) return null;
  if (aircraft.lat === undefined || aircraft.lon === undefined) return null;

  const emergencyDesc = getEmergencyDescription(aircraft.squawk);
  const showSidePanel = detailLevel === 2;

  return (
    <>
      {/* Compact popup anchored to aircraft */}
      <Popup
        longitude={aircraft.lon}
        latitude={aircraft.lat}
        anchor="bottom"
        offset={20}
        onClose={() => { selectAircraft(null); setDetailLevel(1); }}
        closeButton={false}
        className="aircraft-detail-popup"
      >
        {photo ? (
          <div className="w-72 overflow-hidden rounded-2xl shadow-xl border border-border/50">
            <div className="relative">
              <img
                src={photo.thumbnail_large.src}
                alt={aircraft.displayName}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-end">
                <span className="font-medium text-2xl text-white">{aircraft.displayName}</span>
                <span className="text-sm text-white font-mono">{aircraft.hex.toUpperCase()}</span>
              </div>
              {aircraft.isEmergency && emergencyDesc && (
                <div className="absolute top-2 left-2">
                  <Badge variant="destructive" className="border-2 border-red-500">{emergencyDesc}</Badge>
                </div>
              )}
            </div>
            <div className="bg-background/95 backdrop-blur-md p-3">
              <CompactStats aircraft={aircraft} displayUnits={displayUnits} />
              <MoreButton open={showSidePanel} onClick={() => setDetailLevel(showSidePanel ? 1 : 2)} />
            </div>
          </div>
        ) : (
          <div className="w-64 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl p-3 text-foreground shadow-xl">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold font-mono">{aircraft.displayName}</h3>
                  {aircraft.isEmergency && emergencyDesc && (
                    <Badge variant="destructive" className="border-2 border-red-500">{emergencyDesc}</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{aircraft.hex.toUpperCase()}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { selectAircraft(null); setDetailLevel(1); }} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CompactStats aircraft={aircraft} displayUnits={displayUnits} />
            <MoreButton open={showSidePanel} onClick={() => setDetailLevel(showSidePanel ? 1 : 2)} />
          </div>
        )}
      </Popup>

      {/* Side panel — slides in from the right */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-md border-r border-border/50 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          showSidePanel ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div>
            <div className="font-semibold font-mono text-lg">{aircraft.displayName}</div>
            {(aircraft.desc || aircraft.t) && (
              <div className="text-xs text-muted-foreground">{aircraft.desc ?? aircraft.t}</div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setDetailLevel(1)} className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Photo */}
        {photo && (
          <div className="relative">
            <img src={photo.thumbnail_large.src} alt={aircraft.displayName} className="w-full h-auto object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 right-2 text-xs text-white/70">Photo by {photo.photographer}</div>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">

          {/* Identity */}
          <Section title="Identity">
            <Row label="ICAO" value={aircraft.hex.toUpperCase()} mono />
            {aircraft.r && <Row label="Registration" value={aircraft.r} mono />}
            {aircraft.t && <Row label="Type code" value={aircraft.t} mono />}
            {aircraft.category && <Row label="Category" value={getCategoryLabel(aircraft.category)} />}
          </Section>

          {/* Flight */}
          <Section title="Flight data">
            <Row label="Altitude" value={formatAltitudeBrief(aircraft.alt_baro, displayUnits) + (aircraft.baro_rate !== undefined ? ' ' + formatVertRateBrief(aircraft.baro_rate) : '')} mono />
            <Row label="Ground Speed" value={formatSpeedBrief(aircraft.gs, displayUnits)} mono />
            <Row label="Track" value={formatTrackBrief(aircraft.track)} mono />
            {aircraft.distance !== undefined && <Row label="Distance" value={formatDistanceBrief(aircraft.distance, displayUnits)} mono />}
            {aircraft.ias !== undefined && <Row label="IAS" value={`${aircraft.ias} kt`} mono />}
            {aircraft.tas !== undefined && <Row label="TAS" value={`${aircraft.tas} kt`} mono />}
            {aircraft.mach !== undefined && <Row label="Mach" value={formatMach(aircraft.mach)} mono />}
            {aircraft.roll !== undefined && <Row label="Roll" value={`${aircraft.roll.toFixed(1)}°`} mono />}
          </Section>

          {/* Navigation */}
          {(aircraft.nav_altitude_mcp !== undefined || aircraft.nav_qnh !== undefined || aircraft.squawk) && (
            <Section title="Navigation">
              {aircraft.squawk && <Row label="Squawk" value={formatSquawk(aircraft.squawk)} mono />}
              {aircraft.nav_altitude_mcp !== undefined && <Row label="Selected Alt" value={`${aircraft.nav_altitude_mcp} ft`} mono />}
              {aircraft.nav_qnh !== undefined && <Row label="QNH" value={`${aircraft.nav_qnh.toFixed(1)} mb`} mono />}
            </Section>
          )}

          {/* Timing */}
          {(aircraft.seen !== undefined || aircraft.seen_pos !== undefined) && (
            <Section title="Signal">
              {aircraft.seen !== undefined && <Row label="Last seen" value={formatTime(aircraft.seen)} />}
              {aircraft.seen_pos !== undefined && <Row label="Last position" value={formatTime(aircraft.seen_pos)} />}
            </Section>
          )}
        </div>
      </div>
    </>
  );
}

function CompactStats({ aircraft, displayUnits }: { aircraft: EnhancedAircraft; displayUnits: string }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>
        <div className="text-xs text-muted-foreground">Altitude</div>
        <div className="font-mono">
          {formatAltitudeBrief(aircraft.alt_baro, displayUnits)}
          {aircraft.baro_rate !== undefined && (
            <span className="ml-1 text-xs">{formatVertRateBrief(aircraft.baro_rate)}</span>
          )}
        </div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Speed</div>
        <div className="font-mono">{formatSpeedBrief(aircraft.gs, displayUnits)}</div>
      </div>
      {aircraft.distance !== undefined && (
        <div>
          <div className="text-xs text-muted-foreground">Distance</div>
          <div className="font-mono">{formatDistanceBrief(aircraft.distance, displayUnits)}</div>
        </div>
      )}
      <div>
        <div className="text-xs text-muted-foreground">Track</div>
        <div className="font-mono">{formatTrackBrief(aircraft.track)}</div>
      </div>
    </div>
  );
}

function MoreButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <div className="mt-2 pt-2 border-t border-border/50">
      <Button variant="ghost" size="sm" className="w-full justify-center" onClick={onClick}>
        {open ? 'Less details' : 'More details'}
      </Button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className={`text-sm text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
