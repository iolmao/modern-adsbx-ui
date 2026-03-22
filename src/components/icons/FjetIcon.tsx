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
      viewBox="0 0 560 800"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        fill={color}
        stroke={borderColor}
        strokeWidth="26"
        strokeLinejoin="round"
        d="M308.722 711L307.735 718.884L298.721 791L261.276 791L252.263 718.884L251.277 711L231 711L231 771L211 771L211 781L137.062 781L129 772.939L129 737.55L225.762 656.914L229 654.216L229 581L8.99999 581L8.99999 532.256L20.5771 523.116L205.577 377.063L209 374.361L209 341.46L228.538 282.846L228.82 282.001L228.931 281.116L248.877 121.544C262.172 61.7502 270.326 32.4952 275.852 18.2559C277.764 13.3263 279.161 10.7611 280 9.48635C280.839 10.7611 282.236 13.3263 284.148 18.2559C289.674 32.4951 297.827 61.7504 311.122 121.544L331.069 281.116L331.18 282.001L331.462 282.846L351 341.46L351 374.361L354.423 377.063L539.423 523.116L551 532.256L551 581L331 581L331 654.216L334.238 656.914L431 737.548L431 772.938L422.938 781L349 781L349 771L329 771L329 711L308.722 711Z"
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
