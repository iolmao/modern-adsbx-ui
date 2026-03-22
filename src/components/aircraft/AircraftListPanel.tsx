import { X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useConfigStore } from '@/store/configStore';
import { useEnhancedAircraft } from '@/hooks/useDistanceCalculation';
import { Button } from '@/components/ui/button';
import {
  formatAltitudeBrief,
  formatSpeedBrief,
  formatDistanceBrief,
  formatVertRateBrief,
  formatTime,
} from '@/lib/formatters';
import type { EnhancedAircraft } from '@/types/aircraft';

export function AircraftListPanel() {
  const aircraft = useEnhancedAircraft();
  const { aircraftListOpen, setAircraftListOpen } = useUIStore();
  const { displayUnits } = useConfigStore();

  // Prendi i primi 10 aerei dal JSON
  const top10Aircraft = aircraft.slice(0, 10);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ${
          aircraftListOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setAircraftListOpen(false)}
      />

      {/* Panel */}
      <div className={`fixed top-20 left-4 z-50 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl p-4 max-w-5xl shadow-xl text-foreground transition-transform duration-300 ease-out ${
        aircraftListOpen ? 'translate-y-0' : 'translate-y-[calc(-100%-5rem)]'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold font-mono">Aircraft List</h3>
            <div className="text-xs text-muted-foreground">First 10 aircraft</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAircraftListOpen(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Table */}
        {top10Aircraft.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 text-muted-foreground font-semibold">HEX</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-semibold">FLIGHT</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-semibold">SQUAWK</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-semibold">V_RATE</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-semibold">ALT</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-semibold">SPD</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-semibold">LAT</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-semibold">LONG</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-semibold">DISTANCE</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-semibold">LAST SEEN</th>
                </tr>
              </thead>
              <tbody>
                {top10Aircraft.map((ac) => (
                  <tr key={ac.hex} className="border-b border-border/30 hover:bg-muted/50">
                    <td className="py-2 px-2">{ac.hex.toUpperCase()}</td>
                    <td className="py-2 px-2">{ac.flight?.trim() || '—'}</td>
                    <td className="py-2 px-2">{ac.squawk || '—'}</td>
                    <td className="py-2 px-2">
                      {ac.baro_rate !== undefined ? formatVertRateBrief(ac.baro_rate) : '0'}
                    </td>
                    <td className="py-2 px-2">
                      {formatAltitudeBrief(ac.alt_baro, displayUnits)}
                    </td>
                    <td className="py-2 px-2">
                      {formatSpeedBrief(ac.gs, displayUnits)}
                    </td>
                    <td className="py-2 px-2">
                      {ac.lat !== undefined ? ac.lat.toFixed(4) : '—'}
                    </td>
                    <td className="py-2 px-2">
                      {ac.lon !== undefined ? ac.lon.toFixed(4) : '—'}
                    </td>
                    <td className="py-2 px-2">
                      {ac.distance !== undefined
                        ? formatDistanceBrief(ac.distance, displayUnits)
                        : '—'}
                    </td>
                    <td className="py-2 px-2">
                      {ac.seen !== undefined ? formatTime(ac.seen) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-8 text-sm">
            No aircraft with position data
          </div>
        )}
      </div>
    </>
  );
}
