interface FjetIconProps {
  color: string;
  rotation: number;
  size: number;
}

export function FjetIcon({ color, rotation, size }: FjetIconProps) {
  // Scurisci parecchio il colore per il bordo
  const borderColor = adjustBrightness(color, -170);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 423 604"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        fill={color}
        stroke={borderColor}
        strokeWidth="16"
        strokeLinejoin="round"
        d="M181.286 90.6L166.179 211.4L151.071 256.7V279.35L11.3304 389.62V352.333C11.3304 341.323 8.85184 332.2 5.66518 332.2C2.47852 332.2 0 341.323 0 352.333V460.55H11.3304V445.45H166.179V490.75L90.6429 553.667V586.383L100.715 596.45H166.179V588.9H181.286V543.6H183.803L191.357 604H231.643L239.196 543.6H241.714V588.9H256.821V596.45H322.285L332.357 586.383V553.666L256.821 490.75V445.45H411.67V460.55H423V352.333C423 341.322 420.521 332.2 417.335 332.2C414.148 332.2 411.67 341.323 411.67 352.333V389.62L271.929 279.35V256.7L256.821 211.4L241.714 90.6C221.572 0 216.615 0 211.5 0C206.385 0 201.428 0 181.286 90.6Z"
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
