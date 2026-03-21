import { X, Download, Upload } from 'lucide-react';
import { useConfigStore } from '@/store/configStore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { exportConfig, importConfig } from '@/lib/storage/config';
import { TILE_LAYERS } from '@/constants/map';
import { useRef } from 'react';

export function SettingsPanel() {
  const { settingsPanelOpen, setSettingsPanelOpen } = useUIStore();
  const config = useConfigStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!settingsPanelOpen) return null;

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
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setSettingsPanelOpen(false)}
      />
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-background/95 backdrop-blur-md border-l border-border/50 z-50 overflow-y-auto text-foreground">
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
              <label className="text-sm font-medium mb-2 block text-foreground">tar1090 URL</label>
              <input
                type="text"
                value={config.tar1090Url}
                onChange={(e) => config.updateConfig({ tar1090Url: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                placeholder="http://localhost"
              />
            </div>

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

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Tile Layer</label>
              <select
                value={config.tileLayer}
                onChange={(e) => config.updateConfig({ tileLayer: e.target.value as typeof config.tileLayer })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
              >
                {TILE_LAYERS.map((layer) => (
                  <option key={layer.id} value={layer.id}>
                    {layer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Aircraft Icon Color</label>
              <input
                type="color"
                value={config.aircraftIconColor}
                onChange={(e) => config.updateConfig({ aircraftIconColor: e.target.value })}
                className="w-full h-10 bg-background border border-border rounded-md cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Trail Gradient</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Start</label>
                  <input
                    type="color"
                    value={config.trailGradient.start}
                    onChange={(e) => config.updateConfig({
                      trailGradient: { ...config.trailGradient, start: e.target.value }
                    })}
                    className="w-full h-10 bg-background border border-border rounded-md cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">End</label>
                  <input
                    type="color"
                    value={config.trailGradient.end}
                    onChange={(e) => config.updateConfig({
                      trailGradient: { ...config.trailGradient, end: e.target.value }
                    })}
                    className="w-full h-10 bg-background border border-border rounded-md cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Show Labels</label>
              <input
                type="checkbox"
                checked={config.showLabels}
                onChange={(e) => config.updateConfig({ showLabels: e.target.checked })}
                className="w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Show Trails</label>
              <input
                type="checkbox"
                checked={config.showTrails}
                onChange={(e) => config.updateConfig({ showTrails: e.target.checked })}
                className="w-4 h-4 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Display Units</label>
              <select
                value={config.displayUnits}
                onChange={(e) => config.updateConfig({ displayUnits: e.target.value as typeof config.displayUnits })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
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
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
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
