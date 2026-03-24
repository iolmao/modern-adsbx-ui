# Themes Configuration

Themes are defined in `src/config/presets.json`. Each theme sets the map tile layer, aircraft icon color, and trail color simultaneously.

## Structure

```json
[
  {
    "id": "my-theme",
    "name": "Display Name",
    "tileLayer": "osm",
    "aircraftIconColor": "#FFEA00",
    "trailColor": "#000000",
    "thumbnail": "/map-thumbnails/my-theme.png"
  }
]
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier (no spaces) |
| `name` | string | Label shown in the settings panel |
| `tileLayer` | string | Map tile layer — see valid values below |
| `aircraftIconColor` | string | Hex color for aircraft icons |
| `trailColor` | string | Hex color for flight trails |
| `thumbnail` | string | Path to the preview image, relative to `public/` |

### Available `tileLayer` values

| Value | Map |
|---|---|
| `osm` | OpenStreetMap |
| `esri-satellite` | ESRI World Imagery (satellite) |
| `stamen-dark` | Stamen Toner Dark |

## Adding a new theme

1. Add an entry to `presets.json` following the structure above.
2. Place the corresponding thumbnail image in `public/map-thumbnails/` (recommended size: **384×216px**, 16:9).
3. The new theme will appear automatically in the **Themes** section of the settings panel.

## Thumbnails

Thumbnails are stored in `public/map-thumbnails/`. If an image is missing, the card still renders — only the image area will be blank.
