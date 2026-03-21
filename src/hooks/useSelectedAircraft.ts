import { useMemo } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useEnhancedAircraft } from './useDistanceCalculation';
import type { EnhancedAircraft } from '@/types/aircraft';

export function useSelectedAircraft(): EnhancedAircraft | null {
  const { selectedAircraftHex } = useUIStore();
  const aircraft = useEnhancedAircraft();

  return useMemo(() => {
    if (!selectedAircraftHex) return null;
    return aircraft.find((ac) => ac.hex === selectedAircraftHex) ?? null;
  }, [selectedAircraftHex, aircraft]);
}
