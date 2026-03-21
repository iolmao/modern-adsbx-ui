import { useState, useEffect } from 'react';
import { DISCOVERY_URLS } from '@/lib/storage/defaults';

export function useHostDiscovery(skipDiscovery: boolean = false) {
  const [discoveredUrl, setDiscoveredUrl] = useState<string | null>(null);
  const [discovering, setDiscovering] = useState(false);

  useEffect(() => {
    if (skipDiscovery) return;

    const discover = async () => {
      setDiscovering(true);

      for (const baseUrl of DISCOVERY_URLS) {
        try {
          const testUrl = `${baseUrl}/tar1090/data/aircraft.json`;
          const response = await fetch(testUrl, {
            method: 'HEAD',
            timeout: 2000,
          } as RequestInit);

          if (response.ok) {
            setDiscoveredUrl(baseUrl);
            setDiscovering(false);
            return;
          }
        } catch (error) {
          // Continue to next URL
        }
      }

      setDiscovering(false);
    };

    discover();
  }, [skipDiscovery]);

  return { discoveredUrl, discovering };
}
