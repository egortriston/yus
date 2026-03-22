import { clsx } from 'clsx';

/**
 * Pill-style segmented tabs.
 * @param {{ id: string, label: string }[]} segments
 * @param {string} value - active segment id
 * @param {Function} onChange - called with segment id
 */
export function SegmentedControl({ segments = [], value, onChange, className }) {
  return (
    <div className={clsx('inline-flex items-center gap-0.5 rounded-xl bg-surface-overlay p-1', className)}>
      {segments.map(seg => (
        <button
          key={seg.id}
          onClick={() => onChange?.(seg.id)}
          className={clsx(
            'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
            value === seg.id
              ? 'bg-surface-raised text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary',
          )}
        >
          {seg.label}
        </button>
      ))}
    </div>
  );
}
