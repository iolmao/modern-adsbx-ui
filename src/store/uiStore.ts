import { create } from 'zustand';

type ViewMode = 'standard' | 'realistic';

interface UIStore {
  viewMode: ViewMode;
  selectedAircraftHex: string | null;
  detailLevel: 1 | 2;
  settingsPanelOpen: boolean;
  aircraftListOpen: boolean;
  setViewMode: (mode: ViewMode) => void;
  selectAircraft: (hex: string | null) => void;
  setDetailLevel: (level: 1 | 2) => void;
  toggleSettingsPanel: () => void;
  setSettingsPanelOpen: (open: boolean) => void;
  setAircraftListOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  viewMode: 'standard',
  selectedAircraftHex: null,
  detailLevel: 1,
  settingsPanelOpen: false,
  aircraftListOpen: false,
  setViewMode: (mode) => set({ viewMode: mode }),
  selectAircraft: (hex) => set({ selectedAircraftHex: hex, detailLevel: 1 }),
  setDetailLevel: (level) => set({ detailLevel: level }),
  toggleSettingsPanel: () => set((state) => ({ settingsPanelOpen: !state.settingsPanelOpen })),
  setSettingsPanelOpen: (open) => set({ settingsPanelOpen: open }),
  setAircraftListOpen: (open) => set({ aircraftListOpen: open }),
}));
