/**
 * Maps ICAO aircraft type codes to icon categories.
 * Used as fallback when the ADS-B category field is absent.
 */

// ── Helicopters ──────────────────────────────────────────────────────────────
const HELI_TYPES = new Set([
  // Robinson
  'R22','R44','R66',
  // Airbus H-series (old EC naming)
  'EC20','EC25','EC30','EC35','EC45','EC55','EC65','EC75',
  'EC120','EC130','EC135','EC145','EC155','EC175','EC225','EC635','EC725',
  // Airbus H-series (new H naming)
  'H120','H125','H130','H135','H145','H155','H160','H175','H215','H225',
  // Sikorsky
  'S300','S333','S61','S61N','S61R','S62','S64','S65','S70','S76','S92',
  // Bell
  'B06','B07','B12','B22','B30','B47','B47G','B47J',
  'B206','B212','B214','B222','B230','B407','B412','B427','B429','B430','B505','B525',
  // Leonardo / AgustaWestland
  'A109','A119','A129','A139','A149','A169','A189',
  'AW09','AW119','AW139','AW149','AW159','AW169','AW189',
  // MD Helicopters
  'MD52','MD60','MD60N','MD902',
  // NH Industries
  'NH90',
  // Mil (Russian)
  'MI8','MI17','MI24','MI26','MI28','MI35',
  // Kamov
  'K226','K226T',
  // US Military rotorcraft
  'UH60','UH1','UH72','CH47','CH53','CH46',
  'AH64','AH1','MH60','SH60','HH60','HH65',
  // Enstrom
  'F28F','280C','480B',
]);

// ── Fighter / military jets ───────────────────────────────────────────────────
const FJET_TYPES = new Set([
  // US fighters & trainers
  'F15','F15E','F16','F18','F22','F35','F104',
  'A10','AV8','AV8B',
  'T38','T45',
  // European
  'EUFI',   // Eurofighter Typhoon
  'RFAL',   // Rafale
  'JAS39',  // Gripen
  'TADO',   // Tornado
  'MRCA',   // Tornado (alternative code)
  'HA4T',   // Hawk
  'HAWK',
  // Russian / Soviet
  'SU27','SU30','SU35','SU57',
  'MIG29','MIG31',
]);

// ── Business jets ─────────────────────────────────────────────────────────────
const BIZJET_TYPES = new Set([
  // Cessna Citation series
  'C25A','C25B','C25C','C500','C501','C510','C525','C526',
  'C550','C551','C552','C56X','C560','C650','C680','C68A','C700','C750',
  // Embraer Phenom / Legacy
  'E50P','E55P','E135','E145','E35L','E55P',
  // Bombardier Learjet
  'LJ23','LJ24','LJ25','LJ28','LJ31','LJ35','LJ40','LJ45','LJ55','LJ60','LJ75',
  // Bombardier Challenger / Global
  'CL30','CL35','CL60','GL5T','GL7T','GLEX',
  // Dassault Falcon
  'F2TH','F900','F9EX','F7X','FA20','FA50','FA7X',
  // Gulfstream
  'G150','G200','G280','G300','G350','G400','G450','G500','G550','G600','G650','GALX',
  // HondaJet
  'HDJT',
  // Pilatus PC-24
  'PC24',
  // Beechcraft Premier / King Air jets
  'BE40','PRM1',
  // IAI
  'ASTR','G100','G200',
  // Mitsubishi
  'MU30',
  // Piaggio
  'P180',
]);

// ── Small GA / light aircraft ─────────────────────────────────────────────────
const SMALL_TYPES = new Set([
  // Cessna piston singles & light twins
  'C150','C152','C162','C172','C177','C180','C182','C185','C188',
  'C190','C195','C205','C206','C207','C208',
  // Piper
  'P28A','P28B','P28R','P28T','P32R','P32T','P46T',
  'PA18','PA22','PA24','PA25','PA30','PA31','PA34','PA38','PA44','PA46',
  // Diamond
  'DA20','DA40','DA42','DA50','DA62',
  // Cirrus
  'SR20','SR22','SR2T',
  // Beechcraft piston
  'BE18','BE19','BE23','BE24','BE33','BE35','BE36',
  'BE55','BE58','BE60','BE65','BE76','BE77','BE80','BE88','BE95','BE99',
  // Mooney
  'M20C','M20J','M20P','M20T',
  // Robin / SOCATA
  'DR40','DR42','DR48','TB20','TB21',
  // Van's Aircraft (homebuilt)
  'RV4','RV6','RV7','RV8','RV9','RV10','RV12','RV14',
  // Grumman American
  'AA1','AA5',
  // Tecnam
  'P92','P2002','P2006','P2010','P2012',
]);

/**
 * Returns the icon path for a given ICAO type code.
 * Returns null if the type is unknown (caller should fall back to default).
 */
export function getIconFromType(type: string): string | null {
  const t = type.toUpperCase();

  if (HELI_TYPES.has(t))   return '/heli.svg';
  if (FJET_TYPES.has(t))   return '/fjet.svg';
  if (BIZJET_TYPES.has(t)) return '/bizjet.svg';
  if (SMALL_TYPES.has(t))  return '/plane.svg';

  return null;
}
