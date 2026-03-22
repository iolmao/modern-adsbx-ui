interface DroneIconProps {
  color: string;
  rotation: number;
  size: number;
}

export function DroneIcon({ color, rotation, size }: DroneIconProps) {
  // Scurisci parecchio il colore per il bordo
  const borderColor = adjustBrightness(color, -170);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        fill={color}
        stroke={borderColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M7,12a5,5,0,1,1,5-5H10a3,3,0,1,0-3,3Z"
      />
      <path
        fill={color}
        stroke={borderColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M25,12V10a3,3,0,1,0-3-3H20a5,5,0,1,1,5,5Z"
      />
      <path
        fill={color}
        stroke={borderColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M7,30A5,5,0,0,1,7,20v2a3,3,0,1,0,3,3h2A5.0055,5.0055,0,0,1,7,30Z"
      />
      <path
        fill={color}
        stroke={borderColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M25,30a5.0055,5.0055,0,0,1-5-5h2a3,3,0,1,0,3-3V20a5,5,0,0,1,0,10Z"
      />
      <path
        fill={color}
        stroke={borderColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M20,18.5859V13.4141L25.707,7.707a1,1,0,1,0-1.414-1.414l-4.4995,4.5a3.9729,3.9729,0,0,0-7.587,0L7.707,6.293a.9994.9994,0,0,0-1.414,0h0a.9994.9994,0,0,0,0,1.414L12,13.4141v5.1718L6.293,24.293a.9994.9994,0,0,0,0,1.414h0a.9994.9994,0,0,0,1.414,0l4.5-4.5a3.9729,3.9729,0,0,0,7.587,0l4.4995,4.5a1,1,0,0,0,1.414-1.414ZM18,20a2,2,0,0,1-4,0V12a2,2,0,0,1,4,0Z"
      />
    </svg>
  );
}

// Helper: scurisce o schiarisce un colore hex
function adjustBrightness(hex: string, percent: number): string {
  // Rimuovi # se presente
  hex = hex.replace('#', '');

  // Converti in RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Aggiusta brightness
  const adjust = (val: number) => Math.max(0, Math.min(255, val + percent));

  const newR = adjust(r).toString(16).padStart(2, '0');
  const newG = adjust(g).toString(16).padStart(2, '0');
  const newB = adjust(b).toString(16).padStart(2, '0');

  return `#${newR}${newG}${newB}`;
}
