import { useEffect, useState } from 'react';

export interface AirportInfo {
  code: string;
  iata: string;
  location: string;
  lat: number;
  lng: number;
}

export interface FlightRoute {
  callsign: string;
  airports: AirportInfo[];
}

const cache = new Map<string, FlightRoute | null>();
const pending = new Map<string, Promise<FlightRoute | null>>();

async function fetchRoute(callsign: string): Promise<FlightRoute | null> {
  if (pending.has(callsign)) return pending.get(callsign)!;
  const p = fetch(`/api/route/${encodeURIComponent(callsign)}`)
    .then((r) => (r.ok ? (r.json() as Promise<FlightRoute>) : null))
    .catch(() => null)
    .finally(() => pending.delete(callsign));
  pending.set(callsign, p);
  return p;
}

export function useFlightRoute(flight: string | null | undefined): FlightRoute | null {
  const callsign = flight?.trim().toUpperCase() || null;

  const [route, setRoute] = useState<FlightRoute | null>(() =>
    callsign ? (cache.has(callsign) ? (cache.get(callsign) ?? null) : null) : null,
  );

  useEffect(() => {
    if (!callsign) { setRoute(null); return; }
    if (cache.has(callsign)) { setRoute(cache.get(callsign) ?? null); return; }
    fetchRoute(callsign).then((result) => {
      cache.set(callsign, result);
      setRoute(result);
    });
  }, [callsign]);

  return route;
}
