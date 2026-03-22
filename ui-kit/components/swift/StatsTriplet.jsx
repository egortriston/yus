import { clsx } from 'clsx';

/**
 * Three stat blocks in a row.
 * @param {{ label: string, value: string|number, icon?: React.ComponentType }[]} stats
 */
export function StatsTriplet({ stats = [], className }) {
  return (
    <div className={clsx('grid grid-cols-3 rounded-xl overflow-hidden bg-surface-overlay', className)}>
      {stats.map((s, i) => (
        <div key={s.label} className={clsx('flex flex-col items-center gap-1 py-3 px-2', i > 0 && 'border-l border-border-subtle')}>
          {s.icon && <s.icon size={16} className="text-accent" weight="duotone" />}
          <span className="text-base font-bold text-text-primary tabular-nums leading-none">{s.value}</span>
          <span className="text-[9px] text-text-muted uppercase tracking-wider">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
