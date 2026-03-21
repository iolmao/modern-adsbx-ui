import type { UserConfig } from '@/types/config';
import { DEFAULT_CONFIG, STORAGE_KEY } from './defaults';

export function loadConfig(): UserConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config: UserConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}

export function exportConfig(config: UserConfig): void {
  const dataStr = JSON.stringify(config, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `adsb-tracker-config-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function importConfig(file: File): Promise<UserConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content);
        const config = { ...DEFAULT_CONFIG, ...imported };
        resolve(config);
      } catch (error) {
        reject(new Error('Invalid config file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
