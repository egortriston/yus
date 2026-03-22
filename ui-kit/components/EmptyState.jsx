import { clsx } from 'clsx';
import { useSquircle } from '../hooks/useSquircle.js';

function SquircleIcon({ icon: Icon }) {
  const [ref, style] = useSquircle(20);
  return (
    <div
      ref={ref}
      className="w-16 h-16 rounded-2xl bg-surface-overlay flex items-center justify-center mb-5"
      style={style}
    >
      <Icon size={28} className="text-text-muted" />
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  centered = false,
}) {
  return (
    <div className={clsx(
      'flex flex-col items-center justify-center px-6 text-center',
      centered ? 'min-h-[60vh]' : 'py-20',
      className,
    )}>
      {Icon && <SquircleIcon icon={Icon} />}
      {title && (
        <h3 className="text-sm font-semibold text-text-primary mb-1.5">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-xs text-text-muted max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
