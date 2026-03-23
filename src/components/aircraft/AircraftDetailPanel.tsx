import { X, ChevronDown, ChevronUp } from 'lucide-react';
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

export function AircraftDetailPanel() {
  const { selectedAircraftHex, selectAircraft, detailLevel, setDetailLevel } = useUIStore();
  const { displayUnits } = useConfigStore();
  const aircraft = useSelectedAircraft();
  const { photo } = useAircraftPhoto(selectedAircraftHex);

  if (!selectedAircraftHex || !aircraft) return null;
  if (aircraft.lat === undefined || aircraft.lon === undefined) return null;

  const emergencyDesc = getEmergencyDescription(aircraft.squawk);

  return (
    <Popup
      longitude={aircraft.lon}
      latitude={aircraft.lat}
      anchor="bottom"
      offset={20}
      onClose={() => selectAircraft(null)}
      closeButton={false}
      className="aircraft-detail-popup"
    >
      {photo ? (
        /* New card with photo */
        <div className="max-w-md overflow-hidden rounded-2xl shadow-xl border border-border/50">
          {/* Image section with gradient overlay */}
          <div className="relative">
            <img
              src={photo.thumbnail_large.src}
              alt={aircraft.displayName}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Overlay text */}
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-end">
              <span className="font-medium text-2xl text-white">{aircraft.displayName}</span>
              <span className="text-sm text-white font-mono">{aircraft.hex.toUpperCase()}</span>
            </div>

            {/* Emergency badge */}
            {aircraft.isEmergency && emergencyDesc && (
              <div className="absolute top-2 left-2">
                <Badge variant="destructive" className="border-2 border-red-500">
                  {emergencyDesc}
                </Badge>
              </div>
            )}
          </div>

          {/* Data section */}
          <div className="bg-background/95 backdrop-blur-md p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
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
                <div className="text-xs text-muted-foreground">Ground Speed</div>
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

            {/* Expand/Collapse button */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => setDetailLevel(detailLevel === 1 ? 2 : 1)}
              >
                <span>
                  {detailLevel === 1 ? 'Show more details' : 'Show less'}
                </span>
                {detailLevel === 1 ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Level 2 - Full details */}
            {detailLevel === 2 && (
              <div className="mt-3 pt-3 border-t border-border/50 space-y-3 text-sm">
                {aircraft.squawk && (
                  <div>
                    <div className="text-xs text-muted-foreground">Squawk</div>
                    <div className="font-mono">{formatSquawk(aircraft.squawk)}</div>
                  </div>
                )}
                {aircraft.category && (
                  <div>
                    <div className="text-xs text-muted-foreground">Category</div>
                    <div>{getCategoryLabel(aircraft.category)}</div>
                  </div>
                )}
                {(aircraft.desc || aircraft.t) && (
                  <div>
                    <div className="text-xs text-muted-foreground">Aircraft</div>
                    <div>{aircraft.desc ?? aircraft.t}</div>
                  </div>
                )}
                {aircraft.r && (
                  <div>
                    <div className="text-xs text-muted-foreground">Registration</div>
                    <div className="font-mono">{aircraft.r}</div>
                  </div>
                )}
                {aircraft.t && (
                  <div>
                    <div className="text-xs text-muted-foreground">Type code</div>
                    <div className="font-mono">{aircraft.t}</div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {aircraft.ias !== undefined && (
                    <div>
                      <div className="text-xs text-muted-foreground">IAS</div>
                      <div className="font-mono">{aircraft.ias} kt</div>
                    </div>
                  )}
                  {aircraft.tas !== undefined && (
                    <div>
                      <div className="text-xs text-muted-foreground">TAS</div>
                      <div className="font-mono">{aircraft.tas} kt</div>
                    </div>
                  )}
                  {aircraft.mach !== undefined && (
                    <div>
                      <div className="text-xs text-muted-foreground">Mach</div>
                      <div className="font-mono">{formatMach(aircraft.mach)}</div>
                    </div>
                  )}
                  {aircraft.roll !== undefined && (
                    <div>
                      <div className="text-xs text-muted-foreground">Roll</div>
                      <div className="font-mono">{aircraft.roll.toFixed(1)}°</div>
                    </div>
                  )}
                  {aircraft.nav_altitude_mcp !== undefined && (
                    <div>
                      <div className="text-xs text-muted-foreground">Selected Alt</div>
                      <div className="font-mono">{aircraft.nav_altitude_mcp} ft</div>
                    </div>
                  )}
                  {aircraft.nav_qnh !== undefined && (
                    <div>
                      <div className="text-xs text-muted-foreground">QNH</div>
                      <div className="font-mono">{aircraft.nav_qnh.toFixed(1)} mb</div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  {aircraft.seen !== undefined && (
                    <div>Last seen: {formatTime(aircraft.seen)}</div>
                  )}
                  {aircraft.seen_pos !== undefined && (
                    <div>Last pos: {formatTime(aircraft.seen_pos)}</div>
                  )}
                </div>

                {/* Photo credit */}
                <div className="text-xs text-muted-foreground text-center pt-2">
                  Photo by {photo.photographer}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Fallback card without photo */
        <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl p-4 max-w-md text-foreground shadow-xl">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold font-mono text-foreground">{aircraft.displayName}</h3>
                {aircraft.isEmergency && emergencyDesc && (
                  <Badge variant="destructive" className="border-2 border-red-500">
                    {emergencyDesc}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">ICAO: {aircraft.hex.toUpperCase()}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => selectAircraft(null)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Level 1 - Compact info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
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
              <div className="text-xs text-muted-foreground">Ground Speed</div>
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

          {/* Expand/Collapse button */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => setDetailLevel(detailLevel === 1 ? 2 : 1)}
            >
              <span>
                {detailLevel === 1 ? 'Show more details' : 'Show less'}
              </span>
              {detailLevel === 1 ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Level 2 - Full details */}
          {detailLevel === 2 && (
            <div className="mt-3 pt-3 border-t border-border/50 space-y-3 text-sm">
              {aircraft.squawk && (
                <div>
                  <div className="text-xs text-muted-foreground">Squawk</div>
                  <div className="font-mono">{formatSquawk(aircraft.squawk)}</div>
                </div>
              )}
              {aircraft.category && (
                <div>
                  <div className="text-xs text-muted-foreground">Category</div>
                  <div>{getCategoryLabel(aircraft.category)}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {aircraft.ias !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">IAS</div>
                    <div className="font-mono">{aircraft.ias} kt</div>
                  </div>
                )}
                {aircraft.tas !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">TAS</div>
                    <div className="font-mono">{aircraft.tas} kt</div>
                  </div>
                )}
                {aircraft.mach !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">Mach</div>
                    <div className="font-mono">{formatMach(aircraft.mach)}</div>
                  </div>
                )}
                {aircraft.roll !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">Roll</div>
                    <div className="font-mono">{aircraft.roll.toFixed(1)}°</div>
                  </div>
                )}
                {aircraft.nav_altitude_mcp !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">Selected Alt</div>
                    <div className="font-mono">{aircraft.nav_altitude_mcp} ft</div>
                  </div>
                )}
                {aircraft.nav_qnh !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">QNH</div>
                    <div className="font-mono">{aircraft.nav_qnh.toFixed(1)} mb</div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                {aircraft.seen !== undefined && (
                  <div>Last seen: {formatTime(aircraft.seen)}</div>
                )}
                {aircraft.seen_pos !== undefined && (
                  <div>Last pos: {formatTime(aircraft.seen_pos)}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Popup>
  );
}
