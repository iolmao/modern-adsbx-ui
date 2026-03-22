import { useEffect, useCallback } from 'react';
import { useAircraftStore } from '@/store/aircraftStore';
import { useConfigStore } from '@/store/configStore';
import { parseAircraftData } from '@/lib/parser/wqi';

export function useAircraftData() {
  const { tar1090Url, refreshInterval, userLat, userLon } = useConfigStore();
  const { setAircraft, setLoading, setError } = useAircraftStore();

  const fetchData = useCallback(async () => {
    if (!tar1090Url) {
      setError('No tar1090 URL configured');
      return;
    }

    try {
      setLoading(true);
      // Se l'URL contiene già aircraft.json, usalo direttamente
      // Altrimenti aggiungi il path standard tar1090
      let url = tar1090Url;
      if (!url.includes('aircraft.json')) {
        // Rimuovi trailing slash se presente
        url = url.replace(/\/$/, '');
        url = `${url}/tar1090/data/aircraft.json`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const data = parseAircraftData(buffer, {
        siteLat: userLat ?? undefined,
        siteLon: userLon ?? undefined,
      });

      setAircraft(data.aircraft, data.now);
      setLoading(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to fetch aircraft data: ${message}`);
      console.error('Aircraft data fetch error:', error);
    }
  }, [tar1090Url, userLat, userLon, setAircraft, setLoading, setError]);

  useEffect(() => {
    if (!tar1090Url) return;

    // Initial fetch
    fetchData();

    // Set up polling
    const intervalId = setInterval(fetchData, refreshInterval);

    return () => clearInterval(intervalId);
  }, [tar1090Url, refreshInterval, fetchData]);
}
