# ADS-B Tracker

A modern React/TypeScript web application for visualizing ADS-B aircraft data in real-time from tar1090/readsb.

## Features

- **Real-time aircraft tracking** with automatic data refresh
- **Dual viewing modes:**
  - **Standard**: Aircraft icons with rotation, size scaling, and labels
  - **Realistic**: Minimalist dots with altitude-colored trails
- **Interactive map** powered by MapLibre GL
- **Multiple tile layers** (CartoDB, OpenStreetMap, ESRI Satellite, etc.)
- **Distance calculation** from user position
- **Emergency detection** with visual alerts (squawk 7700/7600/7500)
- **Detailed aircraft information** panel with expandable details
- **Configurable settings:**
  - Custom tar1090 host URL
  - User position (lat/lon)
  - Icon and trail colors
  - Display units (nautical/metric/imperial)
  - Auto-discovery of tar1090 hosts
- **Configuration export/import** (JSON format)
- **Persistent settings** using localStorage

## Tech Stack

- **Frontend**: React 18 + TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (black & white theme)
- **Map**: MapLibre GL JS + react-map-gl
- **State Management**: Zustand
- **Font**: Roboto

## Getting Started

### Prerequisites

- Node.js 18+
- A running tar1090/readsb instance

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

\`\`\`bash
npm run build
\`\`\`

The built files will be in the \`dist\` directory.

## Configuration

On first launch, the app will attempt to auto-discover tar1090 on:
- \`http://localhost\`
- \`http://raspberrypi.local\`
- \`http://192.168.1.1\`

If auto-discovery fails, click the Settings icon (gear) in the header to manually configure your tar1090 URL and preferences.

## Usage

### Standard Mode

- Aircraft displayed as rotated icons sized by altitude
- Click any aircraft to view detailed information
- Labels show callsign and distance

### Realistic Mode

- Aircraft shown as small dots
- Trails visualize flight paths with altitude-based coloring
- Trail length proportional to ground speed

## License

MIT
