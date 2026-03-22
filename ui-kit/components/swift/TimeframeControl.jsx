import { clsx } from 'clsx';

/**
 * Row of timeframe buttons with single-select accent highlight.
 * @param {string[]} options - e.g. ['1h','6h','1d','3d','1w','1m']
 * @param {string}   value  - currently selected option
 * @param {Function} onChange - called with selected option string
 */
export function TimeframeControl({ options = [], value, onChange, className }) {
  return (
    <div className={clsx('inline-flex items-center gap-1 rounded-full bg-surface-overlay p-0.5', className)}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange?.(opt)}
          className={clsx(
            'px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-150',
            value === opt
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-muted hover:text-text-secondary',
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
