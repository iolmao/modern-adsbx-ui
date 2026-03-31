# ADSBX but with modern UI

A fast, modern web UI for ADS-B flight tracking. Designed to run alongside [tar1090](https://github.com/wiedehopf/tar1090) or any adsbx-compatible feed on your own hardware.

Built with React 19, TypeScript, MapLibre GL, and Tailwind CSS.

---

## Screenshots
<img src="https://github.com/user-attachments/assets/21dc16bb-11a8-415e-8a63-422c17e456d2" width="800" />
<img src="https://github.com/user-attachments/assets/6277f4f7-7ed7-4bda-ba9f-7a8a453b2cbe" width="300" />
<img src="https://github.com/user-attachments/assets/2c475642-c3b4-4700-b316-716067f1f419" width="800" />
<img src="https://github.com/user-attachments/assets/a42d977f-c277-4140-9eeb-506f4e88752d" width="800" />

## Features

**Feed management**
- Paste any tar1090 or adsbx feed URL — the app connects instantly
- Automatic CORS proxy fallback: works in the browser without touching your server config
- Recent feed history saved in the browser, switchable with one click
- "Use local feed" shortcut to return to auto-discovery mode
- Feed type indicator (local network / external / auto-discovered)

**Map and aircraft**
- Smooth 60fps aircraft position interpolation between data refreshes
- Flight trails rendered behind aircraft icons (correct z-order)
- Map scale bar (metric) bottom-right
- Home position dot on the map when coordinates are set
- Proportional icon sizing by altitude, or fixed size with slider
- Distinct icons for airliners, business jets, small GA, helicopters, fighter jets, drones
- Icon type resolved from ICAO type code (e.g. C25A → bizjet, EC35 → helicopter)
- Standard view (icons + labels) and minimal dot view
- Click any aircraft to open a detail panel with flight data, navigation, and signal info
- Aircraft registration and model (e.g. "BOEING 737-800") resolved from a local database, independent of the feed

**Labels**
- Configurable label fields: display name, distance from your location
- Per-aircraft labels toggle independently of the detail panel

**Themes and appearance**
- Built-in themes: OpenStreetMap, Dark (CartoDB), Satellite
- Each theme sets map tile layer, aircraft icon color, and trail color in one click
- Fine-grained color pickers for aircraft icons and trails (independent of themes)
- Light / dark / system theme support

**Settings**
- All settings persist locally in the browser
- Export configuration as JSON and import it on any other browser or device
- "Use my location" button to populate coordinates from the browser's geolocation API

---

## Installation

### Requirements

- Node.js 18 or later
- A running tar1090 or adsbx instance on the same network (or any public feed URL)

```bash
# Check node version
node -v
```
If version is <18, you should update by following [this guide](https://gist.github.com/stonehippo/f4ef8446226101e8bed3e07a58ea512a)

### Raspberry Pi / Linux

```bash
# Clone the repo
git clone https://github.com/iolmao/modern-adsbx-ui.git
cd modern-adsbx-ui

# Install dependencies and download aircraft database (~8 MB, done automatically)
npm install

# Build
npm run build

# Start the production server (default port 3000)
npm start

# Or on a custom port
node server.cjs 8080
```

The server serves the built UI and acts as a proxy for CORS requests. You can run it as a background service with `systemd` or `pm2`.

**systemd example** (`/etc/systemd/system/modern-adsbx.service`):

```ini
[Unit]
Description=modern-adsbx-ui
After=network.target

[Service]
WorkingDirectory=/home/pi/modern-adsbx-ui
ExecStart=/usr/bin/node server.cjs 3000
Restart=on-failure
User=pi

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable modern-adsbx
sudo systemctl start modern-adsbx
```

### Development

```bash
npm run dev
```

Vite dev server starts on `http://localhost:5173` with hot reload and the built-in proxy middleware enabled.

---

## Aircraft Database

Registration and aircraft model (e.g. "BOEING 737-800", "AIRBUS A320") are resolved from a local copy of the [tar1090-db](https://github.com/wiedehopf/tar1090-db) database, downloaded automatically during `npm install`.

The database is stored at `data/aircraft.csv.gz` (~8 MB) and loaded into memory when the server starts. It works with any feed — public or local — and requires no internet access at runtime.

```
Aircraft database loaded: 462,000 entries   ← printed on server start
```

**To update the database** (e.g. after several months):

```bash
rm data/aircraft.csv.gz
npm run download-db
```

If the file is absent (e.g. no internet during install), the server starts normally and simply omits registration and model info — no errors, no broken UI.

---

## Flight Routes

Origin and destination airports for flights are resolved from a local copy of the [standing-data](https://github.com/vradarserver/standing-data) database (CC0 licensed), downloaded automatically during `npm install`.

The database is stored at `data/routes.csv.gz` and `data/airports-routes.csv.gz`, and loaded into memory when the server starts.

> **Note:** This database is community-maintained and updated infrequently. Routes for **flag carriers and major airlines** are generally accurate. Routes for **low-cost carriers** (Ryanair, easyJet, Wizz Air, etc.) change often and may be outdated or missing — this is a known limitation of the data source, not a bug.

**To update the database:**

```bash
rm data/routes.csv.gz data/airports-routes.csv.gz
npm run download-routes
```

If the files are absent, the server starts normally and simply omits route information — no errors, no broken UI.

---

## Custom Themes

Themes are defined in `src/config/presets.json`. Each entry sets the map style, aircraft color, and trail color, and shows up as a card in the Settings panel.

### 1. Add a theme entry

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
| `stamen-dark` | Dark (CartoDB Dark Matter) |

### 2. Add a thumbnail

Place a preview image in `public/map-thumbnails/`. The filename must match the `thumbnail` field.

Recommended size: **384×216px** (16:9).

```
public/
└── map-thumbnails/
    ├── fr42.png
    ├── real-view.png
    └── my-theme.png
```

If the image is missing, the theme card still appears — only the preview area will be blank.

### 3. Rebuild

After editing `presets.json` or adding thumbnails, rebuild:

```bash
npm run build
```

---

## License

MIT
