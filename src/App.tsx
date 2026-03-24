import { useEffect } from 'react';
import { useAircraftData } from '@/hooks/useAircraftData';
import { useHostDiscovery } from '@/hooks/useHostDiscovery';
import { useTheme } from '@/hooks/useTheme';
import { useConfigStore } from '@/store/configStore';
import { useUIStore } from '@/store/uiStore';
import { Map } from '@/components/map/Map';
import { Header } from '@/components/layout/Header';
import { SettingsPanel } from '@/components/layout/SettingsPanel';
import { AircraftListPanel } from '@/components/aircraft/AircraftListPanel';

function App() {
  const { tar1090Url, updateConfig } = useConfigStore();
  const { setDiscoveredUrl, setSettingsPanelOpen } = useUIStore();
  const { discoveredUrl, discovering } = useHostDiscovery(!tar1090Url);

  // Auto-set discovered URL and store it for the settings panel
  useEffect(() => {
    if (discoveredUrl) {
      setDiscoveredUrl(discoveredUrl);
      if (!tar1090Url) {
        updateConfig({ tar1090Url: discoveredUrl });
      }
    }
  }, [discoveredUrl, tar1090Url, updateConfig, setDiscoveredUrl]);

  // Apply theme
  useTheme();

  // Start fetching aircraft data
  useAircraftData();

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Map />
      <Header />
      <SettingsPanel />
      <AircraftListPanel />

      {discovering && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-md border border-border/50 rounded-lg px-4 py-2 z-40 text-foreground">
          <div className="text-sm">Discovering feed...</div>
        </div>
      )}

      {!tar1090Url && !discovering && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-md border border-border/50 rounded-lg px-4 py-3 z-40 max-w-md text-center text-foreground">
          <div className="text-sm mb-1">No feed configured</div>
          <div className="text-xs text-muted-foreground mb-2">Auto-discovery found nothing on the local network.</div>
          <button
            className="text-xs underline text-muted-foreground hover:text-foreground"
            onClick={() => setSettingsPanelOpen(true)}
          >
            Open Settings to enter the URL manually
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
