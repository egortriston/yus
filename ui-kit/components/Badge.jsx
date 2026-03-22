import { clsx } from 'clsx';

const statusStyles = {
  backlog: 'bg-text-muted/10 text-text-muted',
  pending: 'bg-text-muted/15 text-text-muted',
  in_progress: 'bg-info-muted text-info',
  rework: 'bg-warning-muted text-warning',
  awaiting_qa: 'bg-purple-muted text-purple',
  validating: 'bg-purple-muted text-purple',
  review: 'bg-purple-muted text-purple',
  completed: 'bg-success-muted text-success',
  approved: 'bg-success-muted text-success',
  validated: 'bg-success-muted text-success',
  failed: 'bg-danger-muted text-danger',
  qa_failed: 'bg-danger-muted text-danger',
  online: 'bg-success-muted text-success',
  offline: 'bg-text-muted/15 text-text-muted',
  passed: 'bg-success-muted text-success',
};

const variantStyles = {
  default: '',
  outline: 'border',
};

export function Badge({
  children,
  status,
  variant = 'default',
  className,
}) {
  const statusClass = status ? statusStyles[status] || statusStyles.pending : '';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        statusClass,
        variantStyles[variant],
        className
      )}
    >
      {children || (status ? status.replace(/_/g, ' ') : '')}
    </span>
  );
}
