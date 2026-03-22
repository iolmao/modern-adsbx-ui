interface PlaneIconProps {
  color: string;
  rotation: number;
  size: number;
}

export function PlaneIcon({ color, rotation, size }: PlaneIconProps) {
  // Scurisci parecchio il colore per il bordo
  const borderColor = adjustBrightness(color, -170);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 833 570"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        fill={color}
        stroke={borderColor}
        strokeWidth="26"
        strokeLinejoin="round"
        d="M393.984 19.404C395.471 14.2125 398.253 9.484 402.069 5.6626C405.694 2.0369 410.612 0 415.739 0C420.867 0 425.784 2.0369 429.41 5.6626C433.253 9.4892 436.053 14.2361 437.542 19.4511L462.503 106.355L369 106.331L393.984 19.404Z"
      />
      <path
        fill={color}
        stroke={borderColor}
        strokeWidth="26"
        strokeLinejoin="round"
        d="M832.383 172.255C832.38 178.675 830.254 184.914 826.336 190C822.418 195.086 816.929 198.733 810.722 200.374C721.372 222.481 629.394 232.126 537.402 229.036H467.445L442.06 453.353L534.314 483.241L536.388 485.409L536.907 485.55L536.034 526.869L433 552L429.5 553C426 554 425 557 422.5 562.5C419.5 568 420.301 569.997 416 570C411.7 570.003 412.5 568 409 562.5C406 557.5 405 554 401.5 553L398 552L295.43 525.738L295.453 485.55L390.323 453.33L364.938 229.012L294.628 229.036C202.745 232.116 110.878 222.47 21.6375 200.374C15.4419 198.725 9.9636 195.077 6.0516 189.998C2.1396 184.918 0.0125 178.69 0 172.279L0.5186 120L416.5 104L832.359 120.566L832.383 172.255Z"
      />
      <path
        fill={color}
        stroke={borderColor}
        strokeWidth="26"
        strokeLinejoin="round"
        d="M321 23H511V38H321V23Z"
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
