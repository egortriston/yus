import { useState, useMemo, useId, useCallback } from 'react';
import { clsx } from 'clsx';
import { TimeframeControl } from './TimeframeControl.jsx';

/**
 * Pure SVG line chart with gradient fill and timeframe selector.
 * Dots are rendered as HTML overlays to avoid oval distortion from preserveAspectRatio="none".
 */
export function LineChart({
  data = {},
  timeframes = ['1d', '1w', '1m', '3m'],
  title,
  color = 'var(--color-accent)',
  showArea = true,
  height = 200,
  className,
}) {
  const gradId = useId();
  const [tf, setTf] = useState(timeframes[0]);
  const [hover, setHover] = useState(null);

  const series = data[tf] || { labels: [], values: [] };
  const { labels, values } = series;

  const padX = 2;
  const padY = 4;
  const W = 100;
  const H = 100;

  const { path, areaPath, points, yLabels } = useMemo(() => {
    if (!values.length) return { path: '', areaPath: '', points: [], yLabels: [] };
    const mn = Math.min(...values);
    const mx = Math.max(...values);
    const pad = (mx - mn) * 0.1 || 1;
    const lo = mn - pad;
    const hi = mx + pad;

    const pts = values.map((v, i) => ({
      x: padX + (values.length > 1 ? (i / (values.length - 1)) * (W - padX * 2) : (W - padX * 2) / 2),
      y: padY + (H - padY * 2) - ((v - lo) / (hi - lo)) * (H - padY * 2),
      value: v,
      label: labels[i],
    }));

    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
    }

    const area = `${d} L${pts[pts.length - 1].x},${H - padY} L${pts[0].x},${H - padY} Z`;

    const steps = 4;
    const yLbls = Array.from({ length: steps + 1 }, (_, i) => {
      const v = lo + (hi - lo) * (i / steps);
      return { y: padY + (H - padY * 2) - (i / steps) * (H - padY * 2), label: formatValue(v) };
    });

    return { path: d, areaPath: area, points: pts, yLabels: yLbls };
  }, [values, labels]);

  const lastPt = points.length > 0 ? points[points.length - 1] : null;
  const displayPt = hover !== null && points[hover] ? points[hover] : lastPt;

  const handleMouseMove = useCallback((e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const xCoord = xPct * W;
    let closest = 0;
    let closestDist = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - xCoord);
      if (d < closestDist) { closestDist = d; closest = i; }
    });
    setHover(closest);
  }, [points]);

  // Convert SVG coords to percentage for HTML overlay dots
  const dotPct = (pt) => ({
    left: `${(pt.x / W) * 100}%`,
    top: `${(pt.y / H) * 100}%`,
  });

  const activePt = hover !== null && points[hover] ? points[hover] : null;
  const showLastDot = lastPt && hover === null;

  return (
    <div className={clsx('rounded-2xl bg-surface-overlay p-4', className)}>
      <div className="flex items-center justify-between mb-1">
        {title && <h3 className="text-sm font-semibold text-text-primary">{title}</h3>}
        <TimeframeControl options={timeframes} value={tf} onChange={setTf} />
      </div>

      {displayPt && (
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-text-primary tabular-nums">{formatValue(displayPt.value)}</span>
          <span className="text-[10px] text-text-muted">{displayPt.label}</span>
        </div>
      )}

      <div
        className="relative cursor-crosshair"
        style={{ height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(null)}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yLabels.map(l => (
            <line key={l.y} x1={padX} y1={l.y} x2={W - padX} y2={l.y} stroke="var(--color-border-subtle)" strokeWidth="0.3" />
          ))}

          {/* Area */}
          {showArea && areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}

          {/* Line */}
          {path && <path d={path} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}

          {/* Hover crosshair line (vertical dashes) */}
          {activePt && (
            <line
              x1={activePt.x} y1={padY} x2={activePt.x} y2={H - padY}
              stroke={color} strokeWidth="0.3" strokeDasharray="2,2"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* HTML overlay dots -- always perfectly circular */}
        {activePt && (
          <div
            className="absolute w-[9px] h-[9px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none ring-2 ring-surface-overlay"
            style={{ ...dotPct(activePt), backgroundColor: color }}
          />
        )}
        {showLastDot && (
          <div
            className="absolute w-[9px] h-[9px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none ring-2 ring-surface-overlay"
            style={{ ...dotPct(lastPt), backgroundColor: color }}
          />
        )}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1.5">
        {labels.filter((_, i) => i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1).map(l => (
          <span key={l} className="text-[9px] text-text-muted">{l}</span>
        ))}
      </div>
    </div>
  );
}

function formatValue(v) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toFixed(v < 10 ? 2 : 0);
}
