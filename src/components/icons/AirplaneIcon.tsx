interface AirplaneIconProps {
  color: string;
  rotation: number;
  size: number;
}

export function AirplaneIcon({ color, rotation, size }: AirplaneIconProps) {
  // Scurisci parecchio il colore per il bordo
  const borderColor = adjustBrightness(color, -170);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 619 612"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path fill={color} stroke={borderColor} strokeWidth="16" strokeLinejoin="round" d="M160 202C160 197.582 163.582 194 168 194H221C225.418 194 229 197.582 229 202V272.5C229 284.926 218.926 295 206.5 295H182.5C170.074 295 160 284.926 160 272.5V202Z" />
      <path fill={color} stroke={borderColor} strokeWidth="16" strokeLinejoin="round" d="M390 202C390 197.582 393.582 194 398 194H451C455.418 194 459 197.582 459 202V272.5C459 284.926 448.926 295 436.5 295H412.5C400.074 295 390 284.926 390 272.5V202Z" />
      <path fill={color} stroke={borderColor} strokeWidth="16" strokeLinejoin="round" d="M617.862 342.182C617.394 329.066 608.892 317.259 595.827 311.527L361.349 221.949C361.072 90.5794 345.003 0 309.501 0C273.998 0 257.929 90.5794 257.653 221.949L23.1723 311.526C10.0887 317.259 1.60772 329.066 1.13743 342.182L0.0094482 373.264C-0.162227 377.962 2.01273 382.48 5.95402 385.581C9.89651 388.681 15.1387 390.035 20.2744 389.267C20.2744 389.267 203.65 362.235 259.698 353.531C261.934 452.687 264.557 507.828 264.557 507.828L202.521 537.045C195.212 539.922 190.417 546.965 190.417 554.818V566.261C190.417 571.515 192.57 576.543 196.406 580.156C200.221 583.767 205.356 585.643 210.6 585.345L288.978 580.911C291.493 598.364 299.719 611.194 309.501 611.194C319.282 611.194 327.487 598.364 330.023 580.911L408.404 585.345C413.646 585.642 418.782 583.767 422.595 580.156C426.432 576.543 428.584 571.514 428.584 566.261V554.818C428.584 546.965 423.789 539.922 416.48 537.045L354.424 507.828C354.424 507.828 357.067 452.687 359.305 353.531C415.351 362.235 598.727 389.267 598.727 389.267C603.862 390.035 609.126 388.681 613.047 385.581C616.989 382.48 619.141 377.962 618.993 373.264L617.862 342.182Z" />
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
