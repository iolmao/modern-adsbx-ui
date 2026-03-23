// Aircraft data structure from binCraft format
export interface Aircraft {
  hex: string;                    // ICAO code
  flight?: string;                // Callsign
  lat?: number;                   // Latitude
  lon?: number;                   // Longitude
  alt_baro?: number | "ground";   // Barometric altitude (ft)
  alt_geom?: number | "ground";   // Geometric altitude (ft)
  gs?: number;                    // Ground speed (kt)
  ias?: number;                   // Indicated airspeed (kt)
  tas?: number;                   // True airspeed (kt)
  mach?: number;                  // Mach number
  track?: number;                 // Track angle (0-360°)
  track_rate?: number;            // Track rate of change (°/s)
  roll?: number;                  // Roll angle (°)
  mag_heading?: number;           // Magnetic heading (°)
  true_heading?: number;          // True heading (°)
  baro_rate?: number;             // Vertical rate from barometer (ft/min)
  geom_rate?: number;             // Vertical rate from GPS (ft/min)
  squawk?: string;                // Squawk code
  emergency?: string;             // Emergency status
  category?: string;              // ICAO category (A0-A7, B0-B7, C0-C3)
  nav_qnh?: number;               // Altimeter setting (mb)
  nav_altitude_mcp?: number;      // Selected altitude (MCP/FCU)
  nav_altitude_fms?: number;      // FMS selected altitude
  nav_heading?: number;           // Selected heading
  nav_modes?: string[];           // Autopilot modes
  seen?: number;                  // Seconds since last message
  seen_pos?: number;              // Seconds since last position
  rssi?: number;                  // Signal strength
  messages?: number;              // Total messages received
  nic?: number;                   // Navigation Integrity Category
  rc?: number;                    // Radius of Containment
  nac_p?: number;                 // Navigation Accuracy Category - Position
  nac_v?: number;                 // Navigation Accuracy Category - Velocity
  sil?: number;                   // Source Integrity Level
  sil_type?: string;              // SIL supplement
  gva?: number;                   // Geometric Vertical Accuracy
  sda?: number;                   // System Design Assurance
  alert?: number;                 // Flight status alert bit
  spi?: number;                   // Flight status SPI bit
  mlat?: string[];                // List of fields derived from MLAT
  tisb?: string[];                // List of fields derived from TIS-B
  wd?: number;                    // Wind direction
  ws?: number;                    // Wind speed
  oat?: number;                   // Outside air temperature
  tat?: number;                   // Total air temperature
  version?: number;               // ADS-B version
  nic_baro?: number;              // NIC supplement - barometer cross-check
  nac_p_v2?: number;              // NACp from ADS-B version 2
  sil_v2?: number;                // SIL from ADS-B version 2
  nic_a?: number;                 // NIC supplement A
  nic_c?: number;                 // NIC supplement C
  track_adsb?: number;            // Track from ADS-B
  gs_adsb?: number;               // Ground speed from ADS-B
  mach_adsb?: number;             // Mach from ADS-B
  roll_adsb?: number;             // Roll from ADS-B
  nav_altitude_src?: string;      // Source of nav altitude
  t?: string;                     // Aircraft type (ICAO type code)
  r?: string;                     // Registration
  desc?: string;                  // Aircraft model description (e.g. "BOEING 737-800")
  dbFlags?: number;               // Database flags
  year?: string;                  // Year of manufacture
}

// Enhanced aircraft with calculated fields
export interface EnhancedAircraft extends Aircraft {
  distance?: number;              // Distance from user (meters)
  bearing?: number;               // Bearing from user (degrees)
  isEmergency: boolean;           // true if squawk 7700/7600/7500
  displayName: string;            // flight || hex
  iconSize: number;               // 6-22px calculated
  trailLength: number;            // Trail length (10-60 positions)
}

// Aircraft data response from binCraft parser
export interface AircraftData {
  aircraft: Aircraft[];
  now: number;                    // Current timestamp
  messages: number;               // Total messages
  stats?: {
    total?: number;
    positions?: number;
  };
}

// Position history for trails
export interface PositionHistory {
  lat: number;
  lon: number;
  alt?: number | "ground";
  timestamp: number;
  track?: number;
}

// Aircraft history map
export interface AircraftHistoryMap {
  [hex: string]: PositionHistory[];
}
