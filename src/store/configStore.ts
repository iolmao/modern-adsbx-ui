import { create } from 'zustand';
import type { UserConfig } from '@/types/config';
import { loadConfig, saveConfig } from '@/lib/storage/config';

interface ConfigStore extends UserConfig {
  updateConfig: (partial: Partial<UserConfig>) => void;
  resetConfig: () => void;
}

const initialConfig = loadConfig();

export const useConfigStore = create<ConfigStore>((set) => ({
  ...initialConfig,
  updateConfig: (partial) =>
    set((state) => {
      const newConfig = { ...state, ...partial };
      // Remove the updateConfig and resetConfig methods before saving
      const { updateConfig, resetConfig, ...configToSave } = newConfig;
      saveConfig(configToSave as UserConfig);
      return newConfig;
    }),
  resetConfig: () => {
    const config = loadConfig();
    set(config);
  },
}));
