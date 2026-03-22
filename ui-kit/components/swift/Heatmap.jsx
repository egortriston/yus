import { useState, useMemo, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { X, TrendUp, TrendDown, CurrencyDollar, ChartBar, Users, Coins } from '@phosphor-icons/react';
import { TimeframeControl } from './TimeframeControl.jsx';

/**
 * Treemap-style heatmap. Blocks sized by absolute change, colored green/red.
 * Only the outer rectangle is rounded; internal cells have no rounding.
 * Clicking a cell opens a detail panel BELOW the grid (Telegram-style).
 */
export function Heatmap({
  data = {},
  timeframes = ['12h', '24h', '3d', '7d', '30d'],
  title = 'Heatmap',
  className,
}) {
  const [tf, setTf] = useState(timeframes[0]);
  const [selected, setSelected] = useState(null);
  const items = data[tf] || [];
  const containerRef = useRef(null);
  const detailRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!selected) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setSelected(null);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [selected]);

  // Close on timeframe change
  useEffect(() => { setSelected(null); }, [tf]);

  // Scroll detail card into view when selected
  useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selected]);

  // Squarified treemap layout
  const blocks = useMemo(() => {
    if (!items.length) return [];
    const sorted = [...items].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    const totalWeight = sorted.reduce((s, i) => s + Math.max(Math.abs(i.change), 0.5), 0);
    return sorted.map(item => ({
      ...item,
      weight: Math.max(Math.abs(item.change), 0.5) / totalWeight,
    }));
  }, [items]);

  // Simple row layout
  const rows = useMemo(() => {
    if (!blocks.length) return [];
    const result = [];
    let row = [];
    let rowWeight = 0;
    const targetRowWeight = 1 / Math.ceil(Math.sqrt(blocks.length));
    for (const block of blocks) {
      row.push(block);
      rowWeight += block.weight;
      if (rowWeight >= targetRowWeight) {
        result.push({ items: row, weight: rowWeight });
        row = [];
        rowWeight = 0;
      }
    }
    if (row.length) result.push({ items: row, weight: rowWeight });
    return result;
  }, [blocks]);

  const totalRowWeight = rows.reduce((s, r) => s + r.weight, 0);

  return (
    <div ref={containerRef} className={clsx('rounded-2xl bg-surface-overlay p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        {title && <h3 className="text-sm font-semibold text-text-primary">{title}</h3>}
        <TimeframeControl options={timeframes} value={tf} onChange={setTf} />
      </div>

      {/* Grid */}
      <div className="rounded-xl overflow-hidden min-h-[200px]">
        <div className="flex flex-col gap-[1px] bg-surface-overlay">
          {rows.map((row, ri) => (
            <div
              key={ri}
              className="flex gap-[1px]"
              style={{ height: `${(row.weight / totalRowWeight) * 200}px`, minHeight: 36 }}
            >
              {row.items.map((item) => {
                const isPositive = item.change >= 0;
                const intensity = Math.min(Math.abs(item.change) / 30, 1);
                const bg = isPositive
                  ? `rgba(0, 184, 67, ${0.2 + intensity * 0.55})`
                  : `rgba(221, 39, 40, ${0.2 + intensity * 0.55})`;
                const isSelected = selected?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={clsx(
                      'flex-1 flex flex-col items-center justify-center text-center px-1 overflow-hidden cursor-pointer transition-colors',
                      isSelected && 'ring-1 ring-inset ring-white/30',
                    )}
                    style={{ backgroundColor: bg, minWidth: 0 }}
                    onClick={() => setSelected(isSelected ? null : item)}
                  >
                    <span className="text-[10px] font-semibold text-white truncate w-full">{item.name}</span>
                    <span className={clsx('text-[11px] font-bold', isPositive ? 'text-[#00B843]' : 'text-[#DD2728]')}>
                      {isPositive ? '+' : ''}{item.change.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
          {!items.length && (
            <div className="h-[200px] flex items-center justify-center text-[11px] text-text-muted">No data</div>
          )}
        </div>
      </div>

      {/* Detail card -- rendered BELOW the grid (Telegram-style) */}
      {selected && (() => {
        const isPositive = selected.change >= 0;
        return (
          <div
            ref={detailRef}
            className="mt-3 p-3 rounded-xl bg-surface-raised ring-1 ring-border-subtle"
            style={{ animation: 'heatmapSlideIn 200ms ease-out' }}
          >
            <style>{`@keyframes heatmapSlideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                {/* Token color dot */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: isPositive ? 'rgba(0,184,67,0.5)' : 'rgba(221,39,40,0.5)' }}
                >
                  {selected.name.slice(0, 2)}
                </div>
                <div>
                  <span className="text-sm font-bold text-text-primary">{selected.name}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isPositive
                      ? <TrendUp size={11} weight="bold" className="text-success" />
                      : <TrendDown size={11} weight="bold" className="text-error" />
                    }
                    <span className={clsx(
                      'text-[11px] font-bold',
                      isPositive ? 'text-success' : 'text-error',
                    )}>
                      {isPositive ? '+' : ''}{selected.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
              >
                <X size={14} weight="bold" />
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {selected.price != null && (
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-surface-overlay/60">
                  <CurrencyDollar size={13} className="text-text-muted shrink-0" />
                  <div>
                    <p className="text-[8px] text-text-muted uppercase tracking-wider leading-none">Price</p>
                    <p className="text-[11px] font-semibold text-text-primary tabular-nums mt-0.5">${selected.price.toLocaleString()}</p>
                  </div>
                </div>
              )}
              {selected.volume && (
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-surface-overlay/60">
                  <ChartBar size={13} className="text-text-muted shrink-0" />
                  <div>
                    <p className="text-[8px] text-text-muted uppercase tracking-wider leading-none">Volume</p>
                    <p className="text-[11px] font-semibold text-text-primary tabular-nums mt-0.5">{selected.volume}</p>
                  </div>
                </div>
              )}
              {selected.mcap && (
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-surface-overlay/60">
                  <Coins size={13} className="text-text-muted shrink-0" />
                  <div>
                    <p className="text-[8px] text-text-muted uppercase tracking-wider leading-none">MCap</p>
                    <p className="text-[11px] font-semibold text-text-primary tabular-nums mt-0.5">{selected.mcap}</p>
                  </div>
                </div>
              )}
              {selected.holders != null && (
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-surface-overlay/60">
                  <Users size={13} className="text-text-muted shrink-0" />
                  <div>
                    <p className="text-[8px] text-text-muted uppercase tracking-wider leading-none">Holders</p>
                    <p className="text-[11px] font-semibold text-text-primary tabular-nums mt-0.5">{selected.holders.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
