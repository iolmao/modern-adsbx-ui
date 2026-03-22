import type { TileLayer } from '@/types/config';

export const TILE_LAYERS: TileLayer[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  {
    id: 'stamen-dark',
    name: 'Stamen Toner Dark',
    url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}.png',
    attribution: '&copy; Stamen Design &copy; Stadia Maps',
  },
  {
    id: 'esri-satellite',
    name: 'ESRI Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
];

export const DEFAULT_MAP_VIEW = {
  longitude: 0,
  latitude: 45,
  zoom: 6,
};
