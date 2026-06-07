/** โลโก้ FX + ลูกศรพุ่งขึ้น (inline SVG → ใช้ currentColor ปรับสีตามพื้นหลังได้) */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 132 96"
      className={className}
      role="img"
      aria-label="Forex Thailand"
      fill="none"
    >
      <g
        transform="skewX(-9)"
        stroke="currentColor"
        strokeWidth={15}
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M24 20 V78" />
        <path d="M24 21 H58" />
        <path d="M24 46 H50" />
        <path d="M66 20 L96 78" />
        <path d="M64 78 L108 22" />
      </g>
      <path
        transform="skewX(-9)"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinejoin="miter"
        d="M114 14 L90 16 L106 34 Z"
      />
    </svg>
  );
}
