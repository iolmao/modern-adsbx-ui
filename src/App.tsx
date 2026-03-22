import { useEffect } from 'react';
import { useAircraftData } from '@/hooks/useAircraftData';
import { useHostDiscovery } from '@/hooks/useHostDiscovery';
import { useTheme } from '@/hooks/useTheme';
import { useConfigStore } from '@/store/configStore';
import { Map } from '@/components/map/Map';
import { Header } from '@/components/layout/Header';
import { SettingsPanel } from '@/components/layout/SettingsPanel';
import { AircraftListPanel } from '@/components/aircraft/AircraftListPanel';

function App() {
  const { tar1090Url, updateConfig } = useConfigStore();
  const { discoveredUrl, discovering } = useHostDiscovery(!tar1090Url);

  // Auto-set discovered URL
  useEffect(() => {
    if (discoveredUrl && !tar1090Url) {
      updateConfig({ tar1090Url: discoveredUrl });
    }
  }, [discoveredUrl, tar1090Url, updateConfig]);

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
          <div className="text-sm">Discovering tar1090 host...</div>
        </div>
      )}

      {!tar1090Url && !discovering && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-md border border-border/50 rounded-lg px-4 py-3 z-40 max-w-md text-center text-foreground">
          <div className="text-sm mb-2">No tar1090 host configured</div>
          <div className="text-xs text-muted-foreground">
            Please open Settings and enter your tar1090 URL
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
