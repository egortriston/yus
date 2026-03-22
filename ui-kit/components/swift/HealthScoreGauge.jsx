import { clsx } from 'clsx';

/**
 * 3/4 arc SVG gauge with red/yellow/green segments.
 */
export function HealthScoreGauge({ value = 50, type, size = 80, className }) {
  const autoType = type || (value < 33 ? 'low' : value < 66 ? 'medium' : 'high');
  const colors = { low: '#DD2728', medium: '#FED813', high: '#00B843' };
  const indicatorColor = colors[autoType];

  const cx = 40, cy = 40, r = 32;
  const startAngle = 135;
  const totalAngle = 270;
  const strokeW = 6;

  const polarToXY = (angle) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (start, end) => {
    const s = polarToXY(start);
    const e = polarToXY(end);
    const largeArc = (end - start) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  // Three non-overlapping segments at full opacity
  const seg1 = describeArc(startAngle, startAngle + 90);
  const seg2 = describeArc(startAngle + 90, startAngle + 180);
  const seg3 = describeArc(startAngle + 180, startAngle + totalAngle);

  // Indicator position
  const indicatorAngle = startAngle + (value / 100) * totalAngle;
  const indicatorPos = polarToXY(indicatorAngle);

  return (
    <div className={clsx('inline-flex flex-col items-center', className)}>
      <svg width={size} height={size} viewBox="0 0 80 80">
        {/* Colored segments -- full opacity, no background track overlap */}
        <path d={seg1} fill="none" stroke="#DD2728" strokeWidth={strokeW} strokeLinecap="round" />
        <path d={seg2} fill="none" stroke="#FED813" strokeWidth={strokeW} strokeLinecap="round" />
        <path d={seg3} fill="none" stroke="#00B843" strokeWidth={strokeW} strokeLinecap="round" />

        {/* Indicator dot */}
        <circle cx={indicatorPos.x} cy={indicatorPos.y} r="5" fill={indicatorColor} />
        <circle cx={indicatorPos.x} cy={indicatorPos.y} r="3" fill="var(--color-surface)" />

        {/* Center text */}
        <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
          fill="var(--color-text-primary)" fontSize="16" fontWeight="700" fontFamily="inherit">
          {value}
        </text>
      </svg>
    </div>
  );
}
