import { useState, useMemo, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { TimeframeControl } from './TimeframeControl.jsx';

/**
 * Whale net flow vertical bar chart. Bars colored with accent, opacity = volume.
 * Legend is below the chart. Hover reveals per-bar values.
 */
export function WhaleFlowChart({
  data = {},
  timeframes = ['1h', '6h', '1d', '3d', '1w'],
  title = 'Whale Net Flow',
  height = 220,
  className,
}) {
  const [tf, setTf] = useState(timeframes[0]);
  const [hover, setHover] = useState(null);
  const scrollRef = useRef(null);
  const series = data[tf] || { bars: [] };
  const { bars } = series;

  const maxCount = useMemo(() => Math.max(1, ...bars.map(b => b.count)), [bars]);
  const maxVolume = useMemo(() => Math.max(1, ...bars.map(b => b.volume)), [bars]);

  const totalTx = useMemo(() => bars.reduce((s, b) => s + b.count, 0), [bars]);
  const totalVol = useMemo(() => bars.reduce((s, b) => s + b.volume, 0), [bars]);

  const lastBar = bars.length > 0 ? bars[bars.length - 1] : null;
  const hoverBar = hover !== null && bars[hover] ? bars[hover] : null;

  const displayTx = hoverBar ? hoverBar.count : totalTx;
  const displayVol = hoverBar ? hoverBar.volume : totalVol;
  const displayLabel = hoverBar ? hoverBar.label : 'total';

  // Scroll to right on mount/tf change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) requestAnimationFrame(() => { el.scrollLeft = el.scrollWidth; });
  }, [tf]);

  return (
    <div className={clsx('rounded-2xl bg-surface-overlay p-4', className)}>
      <div className="flex items-center justify-between mb-1">
        {title && <h3 className="text-sm font-semibold text-text-primary">{title}</h3>}
        <TimeframeControl options={timeframes} value={tf} onChange={setTf} />
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-lg font-bold text-text-primary tabular-nums">{displayTx.toLocaleString()}</span>
        <span className="text-[10px] text-text-muted">tx</span>
        <span className="text-xs font-semibold text-text-secondary tabular-nums">{formatVol(displayVol)}</span>
        <span className="text-[10px] text-text-muted">vol</span>
        {hoverBar && <span className="text-[10px] text-text-muted ml-1">{displayLabel}</span>}
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none"
        style={{ height }}
      >
        <div className="flex items-end gap-[2px] h-full" style={{ minWidth: Math.max(bars.length * 10, 100) }}>
          {bars.map((bar, i) => {
            const isLast = i === bars.length - 1;
            const isHovered = hover === i;
            return (
              <div
                key={i}
                className="flex-none flex flex-col items-center justify-end cursor-crosshair"
                style={{ width: 7, height: '100%' }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div
                  className="w-full rounded-t-sm transition-opacity duration-100"
                  style={{
                    height: `${(bar.count / maxCount) * 100}%`,
                    backgroundColor: 'var(--color-accent)',
                    opacity: isHovered ? 1 : (isLast && hover === null) ? 0.9 : 0.3 + (bar.volume / maxVolume) * 0.5,
                    minHeight: bar.count > 0 ? 2 : 0,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline labels */}
      <div className="flex justify-between mt-1.5">
        {bars.filter((_, i) => i % Math.ceil(bars.length / 6) === 0 || i === bars.length - 1).map((b, i) => (
          <span key={i} className="text-[9px] text-text-muted">{b.label}</span>
        ))}
      </div>

      {/* Legend -- below the graph */}
      <div className="text-[9px] text-text-muted flex items-center gap-3 mt-2 pt-2 border-t border-border-subtle">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-accent" /> Height = transactions</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-accent opacity-40" /> Opacity = volume</span>
      </div>
    </div>
  );
}

function formatVol(v) {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toFixed(1);
}
