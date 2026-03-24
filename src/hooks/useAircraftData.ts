import { useEffect, useCallback, useRef } from 'react';
import { useAircraftStore } from '@/store/aircraftStore';
import { useConfigStore } from '@/store/configStore';
import { parseAircraftData } from '@/lib/parser/wqi';

async function fetchWithProxyFallback(url: string): Promise<ArrayBuffer> {
  // Try direct fetch first
  try {
    const response = await fetch(url);
    if (response.ok) return response.arrayBuffer();
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  } catch (directError) {
    // TypeError = likely CORS or network issue — try proxy silently
    if (directError instanceof TypeError) {
      const proxyUrl = `/proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      if (response.ok) return response.arrayBuffer();
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    throw directError;
  }
}

export function useAircraftData() {
  const { tar1090Url, refreshInterval, userLat, userLon } = useConfigStore();
  const { setAircraft, setLoading, setError } = useAircraftStore();
  const fatalErrorRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!tar1090Url || fatalErrorRef.current) return;

    let url = tar1090Url;
    if (!url.includes('aircraft.json')) {
      url = url.replace(/\/$/, '');
      url = `${url}/tar1090/data/aircraft.json`;
    }

    try {
      setLoading(true);
      const buffer = await fetchWithProxyFallback(url);
      const data = parseAircraftData(buffer, {
        siteLat: userLat ?? undefined,
        siteLon: userLon ?? undefined,
      });
      setAircraft(data.aircraft, data.now);
      setLoading(false);
    } catch (error) {
      fatalErrorRef.current = true;
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(`Cannot reach feed: ${message} — check the URL in Settings`);
    }
  }, [tar1090Url, userLat, userLon, setAircraft, setLoading, setError]);

  // Reset fatal error when URL changes
  useEffect(() => {
    fatalErrorRef.current = false;
  }, [tar1090Url]);

  useEffect(() => {
    if (!tar1090Url) return;
    fetchData();
    const intervalId = setInterval(fetchData, refreshInterval);
    return () => clearInterval(intervalId);
  }, [tar1090Url, refreshInterval, fetchData]);
}
