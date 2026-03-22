import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { TimeframeControl } from './TimeframeControl.jsx';

/**
 * SVG bar chart with primary/secondary modes and timeframe selector.
 */
export function BarChart({
  data = {},
  timeframes = ['1d', '1w', '1m'],
  title,
  modes,
  height = 200,
  className,
}) {
  const [tf, setTf] = useState(timeframes[0]);
  const [mode, setMode] = useState(0);
  const [hover, setHover] = useState(null);

  const series = data[tf] || { labels: [], primary: [], secondary: [] };
  const values = mode === 0 ? series.primary : (series.secondary || series.primary);
  const { labels } = series;

  const maxV = useMemo(() => Math.max(1, ...values), [values]);

  // Last value always displayed
  const lastVal = values.length > 0 ? values[values.length - 1] : null;
  const lastLabel = labels.length > 0 ? labels[labels.length - 1] : '';
  const displayVal = hover !== null && values[hover] !== undefined ? values[hover] : lastVal;
  const displayLabel = hover !== null && labels[hover] ? labels[hover] : lastLabel;

  return (
    <div className={clsx('rounded-2xl bg-surface-overlay p-4', className)}>
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {title && <h3 className="text-sm font-semibold text-text-primary">{title}</h3>}
          {modes && modes.length > 1 && (
            <div className="flex items-center gap-0.5 rounded-full bg-surface-raised p-0.5">
              {modes.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setMode(i)}
                  className={clsx(
                    'px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all',
                    mode === i ? 'bg-accent text-white' : 'text-text-muted',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
        <TimeframeControl options={timeframes} value={tf} onChange={setTf} />
      </div>

      {displayVal !== null && (
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-text-primary tabular-nums">{formatVal(displayVal)}</span>
          <span className="text-[10px] text-text-muted">{displayLabel}</span>
        </div>
      )}

      <div style={{ height }} className="flex items-end gap-[3px]">
        {values.map((v, i) => {
          const isLast = i === values.length - 1;
          return (
            <div
              key={i}
              className="flex-1 relative group cursor-crosshair"
              style={{ height: '100%' }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t transition-all duration-150"
                style={{
                  height: `${(v / maxV) * 100}%`,
                  backgroundColor: 'var(--color-accent)',
                  opacity: hover === i ? 1 : isLast && hover === null ? 0.9 : 0.55,
                  minHeight: v > 0 ? 2 : 0,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-1.5">
        {labels.filter((_, i) => i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1).map(l => (
          <span key={l} className="text-[9px] text-text-muted">{l}</span>
        ))}
      </div>
    </div>
  );
}

function formatVal(v) {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toFixed(0);
}
