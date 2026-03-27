import type { UserConfig } from '@/types/config';

export const DEFAULT_CONFIG: UserConfig = {
  tar1090Url: '',
  userLat: null,
  userLon: null,
  tileLayer: 'osm',
  aircraftIconColor: '#ffffff',
  trailColor: '#00ff00',
  useProportionalSize: true,
  fixedAircraftSize: 24,
  showLabels: true,
  showNameInLabel: true,
  showDistanceInLabel: true,
  showTrails: true,
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
