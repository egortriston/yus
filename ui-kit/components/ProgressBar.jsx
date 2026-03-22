import { clsx } from 'clsx';

export function ProgressBar({ value = 0, max = 100, size = 'sm', className }) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div
      className={clsx(
        'w-full bg-surface-overlay rounded-full overflow-hidden',
        size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2' : 'h-3',
        className
      )}
    >
      <div
        className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
