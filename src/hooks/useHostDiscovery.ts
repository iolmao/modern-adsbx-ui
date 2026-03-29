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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        try {
          const testUrl = `${baseUrl}/tar1090/data/aircraft.json`;
          const response = await fetch(testUrl, {
            method: 'HEAD',
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            setDiscoveredUrl(baseUrl);
            setDiscovering(false);
            return;
          }
        } catch (error) {
          clearTimeout(timeoutId);
          // Continue to next URL
        }
      }

      setDiscovering(false);
    };

    discover();
  }, [skipDiscovery]);

  return { discoveredUrl, discovering };
}
