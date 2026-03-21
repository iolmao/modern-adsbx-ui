import type { UserConfig } from '@/types/config';

export const DEFAULT_CONFIG: UserConfig = {
  tar1090Url: '',
  userLat: null,
  userLon: null,
  tileLayer: 'carto-dark',
  aircraftIconColor: '#ffffff',
  useProportionalSize: true,
  fixedAircraftSize: 14,
  showLabels: true,
  showTrails: true,
  trailGradient: {
    start: '#00ff00',
    end: '#ffffff',
  },
  displayUnits: 'nautical',
  nightMode: 'auto',
  refreshInterval: 1000,
};

export const STORAGE_KEY = 'adsb-tracker-config';

export const DISCOVERY_URLS = [
  'http://localhost',
  'http://raspberrypi.local',
  'http://192.168.1.1',
];
