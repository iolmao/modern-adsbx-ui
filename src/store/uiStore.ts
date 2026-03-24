import { create } from 'zustand';

type ViewMode = 'standard' | 'realistic';

export interface MapBounds { north: number; south: number; east: number; west: number }

interface UIStore {
  viewMode: ViewMode;
  selectedAircraftHex: string | null;
  detailLevel: 1 | 2;
  settingsPanelOpen: boolean;
  aircraftListOpen: boolean;
  discoveredUrl: string | null;
  visibleCount: number;
  mapBounds: MapBounds | null;
  setViewMode: (mode: ViewMode) => void;
  selectAircraft: (hex: string | null) => void;
  setDetailLevel: (level: 1 | 2) => void;
  toggleSettingsPanel: () => void;
  setSettingsPanelOpen: (open: boolean) => void;
  setAircraftListOpen: (open: boolean) => void;
  setDiscoveredUrl: (url: string | null) => void;
  setVisibleCount: (count: number) => void;
  setMapBounds: (bounds: MapBounds) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  viewMode: 'standard',
  selectedAircraftHex: null,
  detailLevel: 1,
  settingsPanelOpen: false,
  aircraftListOpen: false,
  discoveredUrl: null,
  visibleCount: 0,
  mapBounds: null,
  setViewMode: (mode) => set({ viewMode: mode }),
  selectAircraft: (hex) => set({ selectedAircraftHex: hex, detailLevel: 1 }),
  setDetailLevel: (level) => set({ detailLevel: level }),
  toggleSettingsPanel: () => set((state) => ({ settingsPanelOpen: !state.settingsPanelOpen })),
  setSettingsPanelOpen: (open) => set({ settingsPanelOpen: open }),
  setAircraftListOpen: (open) => set({ aircraftListOpen: open }),
  setDiscoveredUrl: (url) => set({ discoveredUrl: url }),
  setVisibleCount: (count) => set({ visibleCount: count }),
  setMapBounds: (bounds) => set({ mapBounds: bounds }),
}));
