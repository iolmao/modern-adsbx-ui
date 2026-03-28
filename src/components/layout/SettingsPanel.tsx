import { X, Download, Upload } from 'lucide-react';
import { useConfigStore } from '@/store/configStore';
import { useUIStore } from '@/store/uiStore';
import { useAircraftStore } from '@/store/aircraftStore';
import { Button } from '@/components/ui/button';
import { exportConfig, importConfig } from '@/lib/storage/config';
import { TILE_LAYERS } from '@/constants/map';
import { useRef, useState } from 'react';
import PRESETS from '@/config/presets.json';
import type { TileLayerType } from '@/types/config';
import { useFeedHistory } from '@/hooks/useFeedHistory';
import { Toggle } from '@/components/ui/toggle';

const PUBLIC_FEED_URL = 'https://map.1090mhz.uk/tar1090/data/aircraft.json';

export function SettingsPanel() {
  const { settingsPanelOpen, setSettingsPanelOpen } = useUIStore();
  const { error: feedError } = useAircraftStore();
  const config = useConfigStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { history: feedHistory, addUrl: addFeedUrl, removeUrl: removeFeedUrl } = useFeedHistory();
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported by this browser.');
      return;
    }
    setGeoLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        config.updateConfig({
          userLat: parseFloat(pos.coords.latitude.toFixed(6)),
          userLon: parseFloat(pos.coords.longitude.toFixed(6)),
        });
        setGeoLocating(false);
      },
      () => {
        setGeoError('Unable to retrieve location. Check browser permissions.');
        setGeoLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleExport = () => {
    const { updateConfig, resetConfig, ...configToExport } = config;
    exportConfig(configToExport);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importConfig(file);
        config.updateConfig(imported);
      } catch (error) {
        alert('Failed to import config');
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ${
          settingsPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSettingsPanelOpen(false)}
      />

      {/* Settings Panel */}
      <div
        className={`fixed right-4 top-20 bottom-4 w-96 bg-background/95 backdrop-blur-md border border-border/50 rounded-xl z-50 overflow-y-auto text-foreground shadow-2xl transition-transform duration-300 ease-out ${
          settingsPanelOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1rem)]'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsPanelOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Feed URL</label>
                <div className="flex gap-3">
                  {config.tar1090Url !== PUBLIC_FEED_URL && (
                    <button
                      onClick={() => config.updateConfig({ tar1090Url: PUBLIC_FEED_URL })}
                      className="text-xs text-muted-foreground underline decoration-dotted hover:text-foreground transition-colors"
                    >
                      use public feed
                    </button>
                  )}
                  {config.tar1090Url && (
                    <button
                      onClick={() => config.updateConfig({ tar1090Url: '' })}
                      className="text-xs text-muted-foreground underline decoration-dotted hover:text-foreground transition-colors"
                    >
                      use local feed
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={config.tar1090Url}
                onChange={(e) => config.updateConfig({ tar1090Url: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                placeholder="http://raspberrypi.local"
              />
              {feedError ? (
                <div className="mt-2 text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
                  {feedError}
                </div>
              ) : (
                <div className="mt-2">
                  {config.tar1090Url && !feedHistory.includes(config.tar1090Url) && (
                    <button
                      onClick={() => addFeedUrl(config.tar1090Url)}
                      className="text-xs text-muted-foreground underline decoration-dotted hover:text-foreground transition-colors"
                    >
                      Add to My Feeds
                    </button>
                  )}
                </div>
              )}

              {/* My Feeds */}
              {feedHistory.length > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="text-xs text-muted-foreground/60 mb-1">My Feeds</div>
                  {feedHistory.map((url) => {
                    const isCurrent = url === config.tar1090Url;
                    return (
                      <div key={url} className="flex items-center gap-1 group">
                        <button
                          onClick={() => !isCurrent && config.updateConfig({ tar1090Url: url })}
                          className={`flex-1 text-left text-xs truncate font-mono py-0.5 transition-colors ${
                            isCurrent
                              ? 'text-foreground cursor-default'
                              : 'text-muted-foreground hover:text-foreground cursor-pointer'
                          }`}
                          title={url}
                        >
                          {url}
                        </button>
                        <button
                          onClick={() => removeFeedUrl(url)}
                          className="shrink-0 text-muted-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-0.5"
                          aria-label="Remove"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Latitude</label>
                  <input
                    type="number"
                    value={config.userLat ?? ''}
                    onChange={(e) => config.updateConfig({ userLat: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    placeholder="45.0"
                    step="0.000001"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Longitude</label>
                  <input
                    type="number"
                    value={config.userLon ?? ''}
                    onChange={(e) => config.updateConfig({ userLon: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    placeholder="0.0"
                    step="0.000001"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-1">
                {geoError
                  ? <span className="text-xs text-destructive">{geoError}</span>
                  : <button
                      onClick={handleUseMyLocation}
                      disabled={geoLocating}
                      className="text-xs text-muted-foreground underline decoration-dotted hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      {geoLocating ? 'Locating…' : 'Use my location'}
                    </button>
                }
              </div>
            </div>

            {/* Themes */}
            <div>
              <label className="text-sm font-medium mb-3 block text-foreground">Themes</label>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((preset) => {
                  const isActive =
                    config.tileLayer === preset.tileLayer &&
                    config.aircraftIconColor.toLowerCase() === preset.aircraftIconColor.toLowerCase() &&
                    config.trailColor.toLowerCase() === preset.trailColor.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      onClick={() =>
                        config.updateConfig({
                          tileLayer: preset.tileLayer as TileLayerType,
                          aircraftIconColor: preset.aircraftIconColor,
                          trailColor: preset.trailColor,
                        })
                      }
                      className={`rounded-lg overflow-hidden border transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                        isActive
                          ? 'border-foreground ring-1 ring-foreground'
                          : 'border-border hover:border-foreground/50'
                      }`}
                    >
                      <div className="aspect-video bg-muted">
                        <img
                          src={preset.thumbnail}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="px-2 py-1.5 text-xs text-center font-medium text-muted-foreground">
                        {preset.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Tile Layer</label>
              <select
                value={config.tileLayer}
                onChange={(e) => config.updateConfig({ tileLayer: e.target.value as typeof config.tileLayer })}
                className="w-full pl-3 pr-10 py-2 bg-background border border-border rounded-md text-foreground appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpolyline%20points%3D%222%2C4%206%2C8%2010%2C4%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%221.25%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat"
              >
                {TILE_LAYERS.map((layer) => (
                  <option key={layer.id} value={layer.id}>
                    {layer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block text-foreground">Colors</label>
              <div className="space-y-3">
                {/* Aircraft Icon Color */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <label
                      htmlFor="aircraft-color-picker"
                      className="cursor-pointer inline-block hover:opacity-80 transition-opacity"
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 512 512"
                        style={{ transform: 'rotate(45deg)', filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.45))' }}
                      >
                        <path
                          fill={config.aircraftIconColor}
                          d="M511.06,286.261c-0.387-10.849-7.42-20.615-18.226-25.356l-193.947-74.094C298.658,78.15,285.367,3.228,256.001,3.228c-29.366,0-42.657,74.922-42.885,183.583L19.167,260.904C8.345,265.646,1.33,275.412,0.941,286.261L0.008,311.97c-0.142,3.886,1.657,7.623,4.917,10.188c3.261,2.564,7.597,3.684,11.845,3.049c0,0,151.678-22.359,198.037-29.559c1.85,82.016,4.019,127.626,4.019,127.626l-51.312,24.166c-6.046,2.38-10.012,8.206-10.012,14.701v9.465c0,4.346,1.781,8.505,4.954,11.493c3.155,2.987,7.403,4.539,11.74,4.292l64.83-3.667c2.08,14.436,8.884,25.048,16.975,25.048c8.091,0,14.877-10.612,16.975-25.048l64.832,3.667c4.336,0.246,8.584-1.305,11.738-4.292c3.174-2.988,4.954-7.148,4.954-11.493v-9.465c0-6.495-3.966-12.321-10.012-14.701l-51.329-24.166c0,0,2.186-45.61,4.037-127.626c46.358,7.2,198.036,29.559,198.036,29.559c4.248,0.635,8.602-0.485,11.845-3.049c3.261-2.565,5.041-6.302,4.918-10.188L511.06,286.261z"
                        />
                      </svg>
                    </label>
                    <input
                      id="aircraft-color-picker"
                      type="color"
                      value={config.aircraftIconColor}
                      onChange={(e) => config.updateConfig({ aircraftIconColor: e.target.value })}
                      className="absolute top-0 left-0 w-7 h-7 opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">Aircraft icon color</span>
                </div>

                {/* Trail Color */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <label
                      htmlFor="trail-color-picker"
                      className="cursor-pointer inline-block w-5 h-5 rounded border border-border hover:border-foreground transition-colors"
                      style={{ backgroundColor: config.trailColor }}
                    />
                    <input
                      id="trail-color-picker"
                      type="color"
                      value={config.trailColor}
                      onChange={(e) => config.updateConfig({ trailColor: e.target.value })}
                      className="absolute top-0 left-0 w-5 h-5 opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">Trail color</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Show Labels</label>
                <Toggle checked={config.showLabels} onChange={(v) => config.updateConfig({ showLabels: v })} />
              </div>

              <div className={`flex items-center justify-between pl-6 ${!config.showLabels ? 'opacity-50' : ''}`}>
                <label className={`text-sm text-muted-foreground ${!config.showLabels ? 'cursor-not-allowed' : ''}`}>
                  Display name
                </label>
                <input
                  type="checkbox"
                  checked={config.showNameInLabel}
                  onChange={(e) => config.updateConfig({ showNameInLabel: e.target.checked })}
                  disabled={!config.showLabels}
                  className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>

              <div className={`flex items-center justify-between pl-6 ${!config.showLabels ? 'opacity-50' : ''}`}>
                <label className={`text-sm text-muted-foreground ${!config.showLabels ? 'cursor-not-allowed' : ''}`}>
                  Display distance
                </label>
                <input
                  type="checkbox"
                  checked={config.showDistanceInLabel}
                  onChange={(e) => config.updateConfig({ showDistanceInLabel: e.target.checked })}
                  disabled={!config.showLabels}
                  className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Show Trails</label>
              <Toggle checked={config.showTrails} onChange={(v) => config.updateConfig({ showTrails: v })} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Icon size by altitude</label>
                <Toggle checked={config.useProportionalSize} onChange={(v) => config.updateConfig({ useProportionalSize: v })} />
              </div>
              {!config.useProportionalSize && (
                <div className="flex items-center gap-3 pl-1">
                  <label className="text-sm text-muted-foreground shrink-0">Icon size</label>
                  <input
                    type="range"
                    min={12}
                    max={48}
                    step={1}
                    value={config.fixedAircraftSize}
                    onChange={(e) => config.updateConfig({ fixedAircraftSize: Number(e.target.value) })}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Display Units</label>
              <select
                value={config.displayUnits}
                onChange={(e) => config.updateConfig({ displayUnits: e.target.value as typeof config.displayUnits })}
                className="w-full pl-3 pr-10 py-2 bg-background border border-border rounded-md text-foreground appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpolyline%20points%3D%222%2C4%206%2C8%2010%2C4%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%221.25%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat"
              >
                <option value="nautical">Nautical</option>
                <option value="metric">Metric</option>
                <option value="imperial">Imperial</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Theme</label>
              <select
                value={config.nightMode}
                onChange={(e) => config.updateConfig({ nightMode: e.target.value as typeof config.nightMode })}
                className="w-full pl-3 pr-10 py-2 bg-background border border-border rounded-md text-foreground appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpolyline%20points%3D%222%2C4%206%2C8%2010%2C4%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%221.25%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat"
              >
                <option value="auto">Auto (System)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="pt-4 border-t border-border/50 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Configuration
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
