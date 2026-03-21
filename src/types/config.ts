export type TileLayerType = 'carto-dark' | 'carto-light' | 'osm' | 'esri-satellite' | 'stadia-dark';
export type DisplayUnits = 'nautical' | 'metric' | 'imperial';
export type NightMode = 'auto' | 'light' | 'dark';

export interface TileLayer {
  id: TileLayerType;
  name: string;
  url: string;
  attribution?: string;
}

export interface UserConfig {
  tar1090Url: string;
  userLat: number | null;
  userLon: number | null;
  tileLayer: TileLayerType;
  aircraftIconColor: string;
  useProportionalSize: boolean;
  fixedAircraftSize: number;
  showLabels: boolean;
  showTrails: boolean;
  trailGradient: { start: string; end: string };
  displayUnits: DisplayUnits;
  nightMode: NightMode;
  refreshInterval: number;
}
