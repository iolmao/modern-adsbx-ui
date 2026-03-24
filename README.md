# ADSB Tracker

A real-time ADS-B flight tracker built with React, TypeScript, and Leaflet. Connects to a local [tar1090](https://github.com/wiedehopf/tar1090) instance to display live aircraft positions on an interactive map.

## Customizing Themes

Themes are visual presets that set the map tile layer, aircraft icon color, and trail color in one click. They appear in the **Themes** section of the settings panel.

### 1. Edit the theme definitions

Open `src/config/presets.json` and add, remove, or modify entries:

```json
[
  {
    "id": "my-theme",
    "name": "My Theme",
    "tileLayer": "osm",
    "aircraftIconColor": "#FFEA00",
    "trailColor": "#000000",
    "thumbnail": "/map-thumbnails/my-theme.png"
  }
]
```

| Field | Description |
|---|---|
| `id` | Unique identifier (no spaces) |
| `name` | Label shown in the settings panel |
| `tileLayer` | Map style — see options below |
| `aircraftIconColor` | Hex color for aircraft icons |
| `trailColor` | Hex color for flight trails |
| `thumbnail` | Preview image path, relative to `public/` |

**Available `tileLayer` values:**

| Value | Map |
|---|---|
| `osm` | OpenStreetMap |
| `esri-satellite` | ESRI World Imagery (satellite) |
| `stamen-dark` | Stamen Toner Dark |

### 2. Add the thumbnail image

Place the preview image in `public/map-thumbnails/`. The filename must match the `thumbnail` field in `presets.json`.

Recommended size: **384×216px** (16:9).

```
public/
└── map-thumbnails/
    ├── fr42.png
    ├── real-view.png
    └── vintage-radar.png
```

If an image is missing, the theme card still appears — only the preview area will be blank.
