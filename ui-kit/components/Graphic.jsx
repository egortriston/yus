import { useMemo } from 'react';
import { clsx } from 'clsx';

/**
 * Sparkline / area chart. Minimal, theme-aware.
 * Bottom of the area fades out to transparent.
 *
 * @param {number[]} data        - Array of numeric values
 * @param {number}   height      - Chart height in px (default 80)
 * @param {boolean}  showArea    - Fill area under line (default true)
 * @param {boolean}  showDots    - Show dots on data points (default false)
 * @param {boolean}  showGrid    - Show horizontal grid lines (default false)
 * @param {'accent'|'success'|'danger'|'info'} color - Theme color (default accent)
 * @param {string}   label       - Optional label below chart
 * @param {string}   value       - Optional large value display
 * @param {string}   trend       - Optional trend text (e.g. "+12%")
 * @param {boolean}  trendUp     - Trend direction for coloring
 * @param {string}   className   - Additional classes
 */
export function Graphic({
  data = [],
  height = 80,
  showArea = true,
  showDots = false,
  showGrid = false,
  color = 'accent',
  label,
  value,
  trend,
  trendUp,
  className,
}) {
  const colorMap = {
    accent: { stroke: 'var(--color-accent)', fill: 'var(--color-accent)' },
    success: { stroke: 'var(--color-success)', fill: 'var(--color-success)' },
    danger: { stroke: 'var(--color-danger)', fill: 'var(--color-danger)' },
    info: { stroke: 'var(--color-info)', fill: 'var(--color-info)' },
  };

  const c = colorMap[color] || colorMap.accent;

  const { linePath, areaPath, points, yLines } = useMemo(() => {
    if (data.length < 2) return { linePath: '', areaPath: '', points: [], yLines: [] };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 4;
    const w = 300;
    const h = height;
    const step = (w - padding * 2) / (data.length - 1);

    const pts = data.map((val, i) => ({
      x: padding + i * step,
      y: padding + (1 - (val - min) / range) * (h - padding * 2),
      value: val,
    }));

    // Smooth line using cubic bezier
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const area = `${d} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;

    // Grid lines (3 horizontal)
    const gridLines = [0.25, 0.5, 0.75].map(pct => padding + pct * (h - padding * 2));

    return { linePath: d, areaPath: area, points: pts, yLines: gridLines };
  }, [data, height]);

  if (data.length < 2) return null;

  // Unique ID for gradient defs per instance
  const gradId = useMemo(() => `gfade-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <div className={clsx('flex flex-col', className)}>
      {/* Header row */}
      {(value || label) && (
        <div className="flex items-end justify-between mb-2">
          <div>
            {value && <p className="text-xl font-bold text-text-primary tabular-nums leading-none">{value}</p>}
            {label && <p className="text-[10px] text-text-muted mt-1">{label}</p>}
          </div>
          {trend && (
            <span className={clsx(
              'text-[11px] font-semibold tabular-nums',
              trendUp === true && 'text-success',
              trendUp === false && 'text-danger',
              trendUp === undefined && 'text-text-muted',
            )}>
              {trend}
            </span>
          )}
        </div>
      )}

      {/* Chart */}
      <svg
        viewBox={`0 0 300 ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
      >
        <defs>
          {/* Vertical fade: opaque at top, transparent at bottom */}
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.fill} stopOpacity="0.18" />
            <stop offset="70%" stopColor={c.fill} stopOpacity="0.06" />
            <stop offset="100%" stopColor={c.fill} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {showGrid && yLines.map((y, i) => (
          <line
            key={i}
            x1="4" y1={y} x2="296" y2={y}
            stroke="var(--color-border-subtle)"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}

        {/* Area with bottom fade */}
        {showArea && (
          <path
            d={areaPath}
            fill={`url(#${gradId})`}
          />
        )}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={c.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots && points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="3"
            fill={c.stroke}
          />
        ))}
      </svg>
    </div>
  );
}
