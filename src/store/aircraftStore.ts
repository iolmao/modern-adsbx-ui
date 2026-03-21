import { create } from 'zustand';
import type { Aircraft } from '@/types/aircraft';

interface AircraftStore {
  aircraft: Aircraft[];
  timestamp: number;
  loading: boolean;
  error: string | null;
  setAircraft: (aircraft: Aircraft[], timestamp?: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useAircraftStore = create<AircraftStore>((set) => ({
  aircraft: [],
  timestamp: 0,
  loading: false,
  error: null,
  setAircraft: (aircraft, timestamp = Date.now()) =>
    set({ aircraft, timestamp, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  clear: () => set({ aircraft: [], timestamp: 0, error: null }),
}));
